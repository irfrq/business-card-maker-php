import { jsPDF } from 'jspdf';
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { StudioState } from '../types/brand';
import { DEFAULT_LETTERHEAD_ZONES } from '../data/presets';

export function slugifyFilename(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'brand-asset'
  );
}

function serializeSvg(svgElement: SVGSVGElement): string {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!clone.getAttribute('xmlns:xlink')) {
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }
  const serializer = new XMLSerializer();
  const raw = serializer.serializeToString(clone);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${raw}`;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

export function downloadSvgElement(svgElement: SVGSVGElement | null, filename: string): boolean {
  if (!svgElement) return false;
  const svgString = serializeSvg(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  triggerBlobDownload(blob, filename.endsWith('.svg') ? filename : `${filename}.svg`);
  return true;
}

async function rasterizeSvgToPng(
  svgElement: SVGSVGElement,
  targetWidth: number,
  targetHeight: number,
  backgroundColor?: string
): Promise<{ dataUrl: string; bytes: Uint8Array } | null> {
  const svgString = serializeSvg(svgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(null);
        return;
      }

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);

      const dataUrl = canvas.toDataURL('image/png');
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        blob.arrayBuffer().then((buf) => {
          resolve({ dataUrl, bytes: new Uint8Array(buf) });
        });
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export async function downloadSvgAsPng(
  svgElement: SVGSVGElement | null,
  filename: string,
  targetWidth: number,
  targetHeight: number,
  backgroundColor?: string
): Promise<boolean> {
  if (!svgElement) return false;
  const result = await rasterizeSvgToPng(svgElement, targetWidth, targetHeight, backgroundColor);
  if (!result) return false;
  const blob = new Blob([result.bytes as unknown as BlobPart], { type: 'image/png' });
  triggerBlobDownload(blob, filename.endsWith('.png') ? filename : `${filename}.png`);
  return true;
}

/* ============================================================================
 * PRINT-READY SEPARATE PDF EXPORTS (jsPDF)
 * ============================================================================ */

export async function downloadLetterheadPdf(
  svgEl: SVGSVGElement | null,
  state: StudioState
): Promise<boolean> {
  if (!svgEl) return false;
  const isA4 = state.letterhead.paperSize === 'a4';
  const wPx = isA4 ? 1985 : 2040;
  const hPx = isA4 ? 2808 : 2640;
  const raster = await rasterizeSvgToPng(svgEl, wPx, hPx, '#FFFFFF');
  if (!raster) return false;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: isA4 ? 'a4' : 'letter',
    compress: true,
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  pdf.addImage(raster.dataUrl, 'PNG', 0, 0, pageW, pageH, undefined, 'FAST');

  const slug = slugifyFilename(state.brand.companyName);
  pdf.save(`${slug}-letterhead.pdf`);
  return true;
}

export async function downloadVisitingCardPdf(
  frontSvgEl: SVGSVGElement | null,
  backSvgEl: SVGSVGElement | null,
  state: StudioState
): Promise<boolean> {
  if (!frontSvgEl || !backSvgEl) return false;
  const isIso = state.card.standard === 'iso';
  const wMm = isIso ? 85 : 88.9; // 3.5 in = 88.9 mm
  const hMm = isIso ? 55 : 50.8; // 2.0 in = 50.8 mm
  const wPx = isIso ? 1506 : 1575;
  const hPx = isIso ? 975 : 900;

  const [frontRaster, backRaster] = await Promise.all([
    rasterizeSvgToPng(frontSvgEl, wPx, hPx),
    rasterizeSvgToPng(backSvgEl, wPx, hPx),
  ]);
  if (!frontRaster || !backRaster) return false;

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [wMm, hMm],
    compress: true,
  });

  pdf.addImage(frontRaster.dataUrl, 'PNG', 0, 0, wMm, hMm, undefined, 'FAST');
  pdf.addPage([wMm, hMm], 'landscape');
  pdf.addImage(backRaster.dataUrl, 'PNG', 0, 0, wMm, hMm, undefined, 'FAST');

  const slug = slugifyFilename(state.brand.companyName);
  pdf.save(`${slug}-visiting-card.pdf`);
  return true;
}

export async function downloadStampPdf(
  stampSvgEl: SVGSVGElement | null,
  state: StudioState
): Promise<boolean> {
  if (!stampSvgEl) return false;
  const raster = await rasterizeSvgToPng(stampSvgEl, 1440, 1440, '#FFFFFF');
  if (!raster) return false;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [120, 136],
    compress: true,
  });

  pdf.addImage(raster.dataUrl, 'PNG', 10, 10, 100, 100, undefined, 'FAST');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 30, 35);
  pdf.text(state.brand.companyName.toUpperCase(), 60, 118, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 105, 115);
  pdf.text(`Official Stamp Seal  |  Ink: ${state.stamp.inkColor.toUpperCase()}`, 60, 124, {
    align: 'center',
  });

  const slug = slugifyFilename(state.brand.companyName);
  pdf.save(`${slug}-stamp-design.pdf`);
  return true;
}

export async function downloadLogoPdf(
  logoSvgEl: SVGSVGElement | null,
  state: StudioState
): Promise<boolean> {
  if (!logoSvgEl) return false;
  const raster = await rasterizeSvgToPng(logoSvgEl, 2000, 1200);
  if (!raster) return false;

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [210, 126],
    compress: true,
  });

  pdf.addImage(raster.dataUrl, 'PNG', 0, 0, 210, 126, undefined, 'FAST');

  const slug = slugifyFilename(state.brand.companyName);
  pdf.save(`${slug}-logo.pdf`);
  return true;
}

/* ============================================================================
 * EDITABLE MS WORD (.DOCX) EXPORTS
 * ============================================================================ */

export async function downloadLetterheadDocx(
  logoSvgEl: SVGSVGElement | null,
  stampSvgEl: SVGSVGElement | null,
  state: StudioState
): Promise<boolean> {
  const { brand, visibility: vis } = state;
  const letterhead = { ...DEFAULT_LETTERHEAD_ZONES, ...state.letterhead };
  const primaryHex = brand.primaryColor.replace('#', '').toUpperCase();
  const accentHex = brand.accentColor.replace('#', '').toUpperCase();

  const logoRaster =
    letterhead.showHeader && letterhead.headerShowLogo && logoSvgEl
      ? await rasterizeSvgToPng(logoSvgEl, 800, 480)
      : null;
  const stampRaster =
    letterhead.showStampOverlay && stampSvgEl
      ? await rasterizeSvgToPng(stampSvgEl, 480, 480)
      : null;

  const pName = vis.personName ? brand.personName : '';
  const pTitle = vis.personTitle ? brand.personTitle : '';
  const pPhone = vis.phone ? brand.phone : '';
  const primaryContactLine = [
    pTitle && pName ? `${pTitle}: ${pName}` : pName || pTitle,
    pPhone ? `(${pPhone})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const sName = vis.secondaryPersonName ? brand.secondaryPersonName : '';
  const sTitle = vis.secondaryPersonTitle ? brand.secondaryPersonTitle : '';
  const sPhone = vis.secondaryPhone ? brand.secondaryPhone : '';
  const secondaryContactLine = [
    sTitle && sName ? `${sTitle}: ${sName}` : sName || sTitle,
    sPhone ? `(${sPhone})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const hCompany = letterhead.showHeader && letterhead.headerShowCompany && vis.companyName ? brand.companyName : '';
  const hTagline = letterhead.showHeader && letterhead.headerShowTagline && vis.tagline ? brand.tagline : '';
  const hPrimary = letterhead.showHeader && letterhead.headerShowPrimaryContact ? primaryContactLine : '';
  const hSecondary = letterhead.showHeader && letterhead.headerShowSecondaryContact ? secondaryContactLine : '';
  const hAddress =
    letterhead.showHeader && letterhead.headerShowAddress && vis.address
      ? [brand.addressLine1, brand.cityState].filter(Boolean).join(', ')
      : '';
  const hDigital = [
    letterhead.showHeader && letterhead.headerShowDigital && vis.email ? brand.email : '',
    letterhead.showHeader && letterhead.headerShowDigital && vis.website ? brand.website : '',
  ].filter(Boolean);
  const hMeta = [hAddress, ...hDigital].filter(Boolean);

  const headerContactLines: Paragraph[] = [];
  if (hCompany) {
    headerContactLines.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 36 },
        children: [
          new TextRun({
            text: hCompany,
            bold: true,
            size: 24,
            color: primaryHex,
            font: 'Calibri',
          }),
        ],
      })
    );
  }
  if (hTagline) {
    headerContactLines.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 36 },
        children: [
          new TextRun({
            text: hTagline,
            size: 17,
            color: '52525B',
            font: 'Calibri',
          }),
        ],
      })
    );
  }
  if (hPrimary) {
    headerContactLines.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 36 },
        children: [
          new TextRun({
            text: hPrimary,
            size: 18,
            bold: true,
            color: '27272A',
            font: 'Calibri',
          }),
        ],
      })
    );
  }
  if (hSecondary) {
    headerContactLines.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 36 },
        children: [
          new TextRun({
            text: hSecondary,
            size: 18,
            color: '3F3F46',
            font: 'Calibri',
          }),
        ],
      })
    );
  }
  if (hMeta.length > 0) {
    headerContactLines.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: hMeta.join('  |  '),
            size: 16,
            color: '52525B',
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  const hasHeaderContent =
    letterhead.showHeader && (Boolean(logoRaster) || headerContactLines.length > 0);

  const fLine1Parts = [
    letterhead.showFooterRule && letterhead.footerShowCompany && vis.companyName ? brand.companyName : '',
    letterhead.showFooterRule && letterhead.footerShowAddress && vis.address
      ? [brand.addressLine1, brand.cityState].filter(Boolean).join(', ')
      : '',
  ].filter(Boolean);
  const fLine2Parts = [
    letterhead.showFooterRule && letterhead.footerShowPrimaryContact ? primaryContactLine : '',
    letterhead.showFooterRule && letterhead.footerShowSecondaryContact ? secondaryContactLine : '',
    letterhead.showFooterRule && letterhead.footerShowDigital && vis.email ? brand.email : '',
    letterhead.showFooterRule && letterhead.footerShowDigital && vis.website ? brand.website : '',
  ].filter(Boolean);

  const footerParagraphs: Paragraph[] = [];
  if (fLine1Parts.length > 0) {
    footerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: {
          top: { style: BorderStyle.SINGLE, size: 6, color: 'D4D4D8' },
        },
        spacing: { before: 100, after: fLine2Parts.length > 0 ? 30 : 0 },
        children: [
          new TextRun({
            text: fLine1Parts.join('  ·  '),
            bold: true,
            size: 16,
            color: primaryHex,
            font: 'Calibri',
          }),
        ],
      })
    );
  }
  if (fLine2Parts.length > 0) {
    footerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: fLine1Parts.length === 0 ? { top: { style: BorderStyle.SINGLE, size: 6, color: 'D4D4D8' } } : undefined,
        spacing: fLine1Parts.length === 0 ? { before: 100 } : undefined,
        children: [
          new TextRun({
            text: fLine2Parts.join('  |  '),
            size: 15,
            color: '52525B',
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  const bodyChildren: Paragraph[] = [];

  if (letterhead.showSampleContent) {
    if ((vis.letterDate && letterhead.dateText) || (vis.letterRef && letterhead.refNumber)) {
      bodyChildren.push(
        new Paragraph({
          spacing: { before: hasHeaderContent ? 220 : 0, after: 120 },
          children: [
            ...(vis.letterDate && letterhead.dateText
              ? [
                  new TextRun({
                    text: `${letterhead.dateText}          `,
                    size: 21,
                    font: 'Calibri',
                  }),
                ]
              : []),
            ...(vis.letterRef && letterhead.refNumber
              ? [
                  new TextRun({
                    text: letterhead.refNumber,
                    size: 19,
                    color: '52525B',
                    font: 'Consolas',
                  }),
                ]
              : []),
          ],
        })
      );
    }

    if (vis.letterRecipient && letterhead.recipientName) {
      bodyChildren.push(
        new Paragraph({
          spacing: { before: 100, after: letterhead.recipientAddress ? 40 : 180 },
          children: [
            new TextRun({
              text: letterhead.recipientName,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
          ],
        })
      );
      if (letterhead.recipientAddress) {
        bodyChildren.push(
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: letterhead.recipientAddress,
                size: 20,
                color: '52525B',
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }

    if (vis.letterSubject && letterhead.subjectLine) {
      bodyChildren.push(
        new Paragraph({
          spacing: { after: 180 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E4E4E7' },
          },
          children: [
            new TextRun({
              text: letterhead.subjectLine,
              bold: true,
              size: 23,
              color: primaryHex,
              font: 'Calibri',
            }),
          ],
        })
      );
    }

    if (vis.letterBody) {
      bodyChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 150 },
          children: [new TextRun({ text: 'Dear Sir / Madam,', size: 22, font: 'Calibri' })],
        }),
        new Paragraph({
          spacing: { after: 170, line: 320 },
          children: [new TextRun({ text: letterhead.bodyParagraph1, size: 22, font: 'Calibri' })],
        }),
        new Paragraph({
          spacing: { after: 260, line: 320 },
          children: [new TextRun({ text: letterhead.bodyParagraph2, size: 22, font: 'Calibri' })],
        })
      );
    }

    if (vis.letterSignature) {
      bodyChildren.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [new TextRun({ text: letterhead.closingText, size: 22, font: 'Calibri' })],
        })
      );
    }

    if (stampRaster) {
      bodyChildren.push(
        new Paragraph({
          spacing: { after: 110 },
          children: [
            new ImageRun({
              type: 'png',
              data: stampRaster.bytes,
              transformation: { width: 110, height: 110 },
            }),
          ],
        })
      );
    }

    if (vis.letterSignature) {
      if (pName) {
        bodyChildren.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: pName,
                bold: true,
                size: 22,
                color: primaryHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
      const sigTitleLine = [pTitle, vis.companyName ? brand.companyName : ''].filter(Boolean).join(', ');
      if (sigTitleLine) {
        bodyChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: sigTitleLine,
                size: 20,
                color: '52525B',
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  if (bodyChildren.length === 0) {
    bodyChildren.push(new Paragraph({ children: [] }));
  }

  const headerCells: TableCell[] = [];
  if (logoRaster) {
    headerCells.push(
      new TableCell({
        width: { size: headerContactLines.length > 0 ? 36 : 100, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                type: 'png',
                data: logoRaster.bytes,
                transformation: { width: 160, height: 96 },
              }),
            ],
          }),
        ],
      })
    );
  }
  if (headerContactLines.length > 0) {
    headerCells.push(
      new TableCell({
        width: { size: logoRaster ? 64 : 100, type: WidthType.PERCENTAGE },
        children: headerContactLines,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: hasHeaderContent ? 720 : 900,
              right: 900,
              bottom: footerParagraphs.length > 0 ? 720 : 900,
              left: 900,
            },
          },
        },
        headers: hasHeaderContent
          ? {
              default: new Header({
                children: [
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                      bottom: { style: BorderStyle.SINGLE, size: 12, color: accentHex },
                    },
                    rows: [
                      new TableRow({
                        children: headerCells,
                      }),
                    ],
                  }),
                ],
              }),
            }
          : undefined,
        footers:
          footerParagraphs.length > 0
            ? {
                default: new Footer({
                  children: footerParagraphs,
                }),
              }
            : undefined,
        children: bodyChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const slug = slugifyFilename(brand.companyName);
  triggerBlobDownload(blob, `${slug}-letterhead.docx`);
  return true;
}

export async function downloadVisitingCardDocx(
  frontSvgEl: SVGSVGElement | null,
  backSvgEl: SVGSVGElement | null,
  state: StudioState
): Promise<boolean> {
  const { brand, visibility: vis } = state;
  const frontRaster = frontSvgEl ? await rasterizeSvgToPng(frontSvgEl, 1050, 600) : null;
  const backRaster = backSvgEl ? await rasterizeSvgToPng(backSvgEl, 1050, 600) : null;
  const primaryHex = brand.primaryColor.replace('#', '').toUpperCase();

  const detailRows: [string, string][] = [];
  if (vis.companyName && brand.companyName) detailRows.push(['Business Name', brand.companyName]);
  if (vis.tagline && brand.tagline) detailRows.push(['Tagline', brand.tagline]);

  const pSummary = [
    vis.personName ? brand.personName : '',
    vis.personTitle && brand.personTitle ? `(${brand.personTitle})` : '',
    vis.phone && brand.phone ? `— ${brand.phone}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  if (pSummary) detailRows.push(['Primary Contact', pSummary]);

  const sSummary = [
    vis.secondaryPersonName ? brand.secondaryPersonName : '',
    vis.secondaryPersonTitle && brand.secondaryPersonTitle ? `(${brand.secondaryPersonTitle})` : '',
    vis.secondaryPhone && brand.secondaryPhone ? `— ${brand.secondaryPhone}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  if (sSummary) detailRows.push(['Secondary Contact', sSummary]);

  if (vis.email && brand.email) detailRows.push(['Email', brand.email]);
  if (vis.website && brand.website) detailRows.push(['Website', brand.website]);
  if (vis.address && (brand.addressLine1 || brand.cityState)) {
    detailRows.push(['Address', [brand.addressLine1, brand.cityState].filter(Boolean).join(', ')]);
  }

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: `${vis.companyName ? brand.companyName : 'Visiting Card'} — Editable Visiting Card Sheet`,
                bold: true,
                size: 28,
                color: primaryHex,
                font: 'Calibri',
              }),
            ],
          }),
          ...(frontRaster
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [new TextRun({ text: 'Front Face (Print Proof 3.5 × 2.0 in)', bold: true, size: 20 })],
                }),
                new Paragraph({
                  spacing: { after: 200 },
                  children: [
                    new ImageRun({
                      type: 'png',
                      data: frontRaster.bytes,
                      transformation: { width: 336, height: 192 },
                    }),
                  ],
                }),
              ]
            : []),
          ...(backRaster
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [new TextRun({ text: 'Back Face (Print Proof 3.5 × 2.0 in)', bold: true, size: 20 })],
                }),
                new Paragraph({
                  spacing: { after: 240 },
                  children: [
                    new ImageRun({
                      type: 'png',
                      data: backRaster.bytes,
                      transformation: { width: 336, height: 192 },
                    }),
                  ],
                }),
              ]
            : []),
          ...(detailRows.length > 0
            ? [
                new Paragraph({
                  spacing: { before: 120, after: 120 },
                  children: [
                    new TextRun({
                      text: 'Editable Visiting Card Details',
                      bold: true,
                      size: 24,
                      color: primaryHex,
                    }),
                  ],
                }),
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: detailRows.map(
                    ([k, v]) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            width: { size: 32, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({
                                children: [new TextRun({ text: k, bold: true, size: 20 })],
                              }),
                            ],
                          }),
                          new TableCell({
                            width: { size: 68, type: WidthType.PERCENTAGE },
                            children: [new Paragraph({ children: [new TextRun({ text: v, size: 20 })] })],
                          }),
                        ],
                      })
                  ),
                }),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const slug = slugifyFilename(brand.companyName);
  triggerBlobDownload(blob, `${slug}-visiting-card.docx`);
  return true;
}

export async function downloadStampDocx(
  stampSvgEl: SVGSVGElement | null,
  state: StudioState
): Promise<boolean> {
  const { brand, stamp, visibility: vis } = state;
  const stampRaster = stampSvgEl ? await rasterizeSvgToPng(stampSvgEl, 960, 960) : null;
  const primaryHex = brand.primaryColor.replace('#', '').toUpperCase();

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: `${vis.companyName ? brand.companyName : 'Official Stamp'} — Official Stamp Design`,
                bold: true,
                size: 28,
                color: primaryHex,
              }),
            ],
          }),
          ...(stampRaster
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120, after: 240 },
                  children: [
                    new ImageRun({
                      type: 'png',
                      data: stampRaster.bytes,
                      transformation: { width: 240, height: 240 },
                    }),
                  ],
                }),
              ]
            : []),
          ...(vis.stampTopArc && stamp.topArcText
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [new TextRun({ text: `Top Ring Text: ${stamp.topArcText}`, bold: true, size: 21 })],
                }),
              ]
            : []),
          ...(vis.stampBottomArc && stamp.bottomArcText
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [new TextRun({ text: `Bottom Ring Text: ${stamp.bottomArcText}`, size: 21 })],
                }),
              ]
            : []),
          ...(vis.stampSubLabel && stamp.subLabel
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [new TextRun({ text: `Inner Label: ${stamp.subLabel}`, size: 21 })],
                }),
              ]
            : []),
          new Paragraph({
            children: [new TextRun({ text: `Ink Color: ${stamp.inkColor.toUpperCase()}`, size: 21 })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const slug = slugifyFilename(brand.companyName);
  triggerBlobDownload(blob, `${slug}-stamp-design.docx`);
  return true;
}

export async function downloadLogoDocx(
  logoSvgEl: SVGSVGElement | null,
  state: StudioState
): Promise<boolean> {
  const { brand, visibility: vis } = state;
  const logoRaster = logoSvgEl ? await rasterizeSvgToPng(logoSvgEl, 1600, 960) : null;
  const primaryHex = brand.primaryColor.replace('#', '').toUpperCase();

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: `${vis.companyName ? brand.companyName : 'Brand Identity'} — Brand Logo Sheet`,
                bold: true,
                size: 28,
                color: primaryHex,
              }),
            ],
          }),
          ...(logoRaster
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120, after: 240 },
                  children: [
                    new ImageRun({
                      type: 'png',
                      data: logoRaster.bytes,
                      transformation: { width: 420, height: 252 },
                    }),
                  ],
                }),
              ]
            : []),
          ...(vis.companyName && brand.companyName
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [new TextRun({ text: `Business Name: ${brand.companyName}`, bold: true, size: 22 })],
                }),
              ]
            : []),
          ...(vis.tagline && brand.tagline
            ? [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [new TextRun({ text: `Tagline: ${brand.tagline}`, size: 21 })],
                }),
              ]
            : []),
          new Paragraph({
            children: [
              new TextRun({
                text: `Primary Color: ${brand.primaryColor.toUpperCase()}   |   Accent Color: ${brand.accentColor.toUpperCase()}`,
                size: 20,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const slug = slugifyFilename(brand.companyName);
  triggerBlobDownload(blob, `${slug}-logo.docx`);
  return true;
}
