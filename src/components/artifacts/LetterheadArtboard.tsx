import React from 'react';
import {
  BrandIdentity,
  LetterheadConfig,
  LogoConfig,
  StampConfig,
  TextVisibility,
} from '../../types/brand';
import { DEFAULT_LETTERHEAD_ZONES, DEFAULT_TEXT_VISIBILITY } from '../../data/presets';
import { getFontSet } from '../../utils/typography';
import { LogoEmblemSvg } from '../emblems/LogoEmblemSvg';
import { LivestockWatermarkSvg } from '../emblems/LivestockWatermarkSvg';
import { StampArtboard } from './StampArtboard';

interface LetterheadArtboardProps {
  brand: BrandIdentity;
  logo: LogoConfig;
  stamp: StampConfig;
  letterhead: LetterheadConfig;
  visibility?: TextVisibility;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

function wrapTextLines(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if (!current) {
      current = w;
    } else if (current.length + 1 + w.length <= maxChars) {
      current += ' ' + w;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface FlowTextLine {
  text: string;
  color: string;
  weight?: string;
  size: number;
  fontFamily: string;
  letterSpacing?: string;
}

export const LetterheadArtboard: React.FC<LetterheadArtboardProps> = ({
  brand,
  logo,
  stamp,
  letterhead,
  visibility = DEFAULT_TEXT_VISIBILITY,
  svgRef,
}) => {
  const fonts = getFontSet(brand.fontPairing);
  const lh = { ...DEFAULT_LETTERHEAD_ZONES, ...letterhead };

  const w = lh.paperSize === 'a4' ? 794 : 816;
  const h = lh.paperSize === 'a4' ? 1123 : 1056;

  const paperBg = lh.paperStock === 'cotton-ivory' ? '#FAF8F3' : '#FFFFFF';
  const primary = brand.primaryColor || '#111827';
  const accent = brand.accentColor || '#1E40AF';
  const ink = '#18181B';
  const muted = '#52525B';
  const hairline = lh.paperStock === 'cotton-ivory' ? '#E3DDD1' : '#E2E8F0';

  const rawCompany = visibility.companyName ? brand.companyName.trim() : '';
  const rawTagline = visibility.tagline ? brand.tagline.trim() : '';
  const rawPersonName = visibility.personName ? brand.personName.trim() : '';
  const rawPersonTitle = visibility.personTitle ? brand.personTitle.trim() : '';
  const rawPhone = visibility.phone ? brand.phone.trim() : '';

  const rawSecName = visibility.secondaryPersonName ? brand.secondaryPersonName.trim() : '';
  const rawSecTitle = visibility.secondaryPersonTitle ? brand.secondaryPersonTitle.trim() : '';
  const rawSecPhone = visibility.secondaryPhone ? brand.secondaryPhone.trim() : '';

  const rawEmail = visibility.email ? brand.email.trim() : '';
  const rawWebsite = visibility.website ? brand.website.trim() : '';
  const rawAddr1 = visibility.address ? brand.addressLine1.trim() : '';
  const rawAddrCity = visibility.address ? brand.cityState.trim() : '';
  const rawFullAddr = [rawAddr1, rawAddrCity].filter(Boolean).join(', ');
  const regNo = visibility.registrationNo ? brand.registrationNo.trim() : '';

  const buildContactLine = (title: string, name: string, phoneVal: string) =>
    [title && name ? `${title}: ${name}` : name || title, phoneVal ? `(${phoneVal})` : '']
      .filter(Boolean)
      .join(' ');

  // Separate Header Values
  const hShowLogo = lh.showHeader && lh.headerShowLogo;
  const hCompany = lh.showHeader && lh.headerShowCompany ? rawCompany : '';
  const hTagline = lh.showHeader && lh.headerShowTagline ? rawTagline : '';
  const hPrimaryLine =
    lh.showHeader && lh.headerShowPrimaryContact
      ? buildContactLine(rawPersonTitle, rawPersonName, rawPhone)
      : '';
  const hSecondaryLine =
    lh.showHeader && lh.headerShowSecondaryContact
      ? buildContactLine(rawSecTitle, rawSecName, rawSecPhone)
      : '';
  const hAddress = lh.showHeader && lh.headerShowAddress ? rawFullAddr : '';
  const hAddr1 = lh.showHeader && lh.headerShowAddress ? rawAddr1 : '';
  const hAddrCity = lh.showHeader && lh.headerShowAddress ? rawAddrCity : '';
  const hEmail = lh.showHeader && lh.headerShowDigital ? rawEmail : '';
  const hWebsite = lh.showHeader && lh.headerShowDigital ? rawWebsite : '';
  const hDigitalLine = [hEmail, hWebsite].filter(Boolean).join('  ·  ');

  // Separate Footer Values
  const fCompany = lh.showFooterRule && lh.footerShowCompany ? rawCompany : '';
  const fAddress = lh.showFooterRule && lh.footerShowAddress ? rawFullAddr : '';
  const fPrimaryLine =
    lh.showFooterRule && lh.footerShowPrimaryContact
      ? buildContactLine(rawPersonTitle, rawPersonName, rawPhone)
      : '';
  const fSecondaryLine =
    lh.showFooterRule && lh.footerShowSecondaryContact
      ? buildContactLine(rawSecTitle, rawSecName, rawSecPhone)
      : '';
  const fEmail = lh.showFooterRule && lh.footerShowDigital ? rawEmail : '';
  const fWebsite = lh.showFooterRule && lh.footerShowDigital ? rawWebsite : '';

  const isLeftRail = lh.layout === 'left-rail' && lh.showHeader;
  const bodyLeftX = isLeftRail ? 238 : 72;
  const bodyRightX = w - 72;
  const bodyWidthChars = isLeftRail ? 62 : 78;

  // Dynamic Header Height Calculation (zero blank gaps when header items are hidden)
  let headerBottomY = 74;

  const renderTopBandHeader = (opts: {
    darkBand?: boolean;
    doubleRule?: boolean;
    framed?: boolean;
    emblemSize?: number;
    topPad?: number;
    accentTopBar?: boolean;
  }) => {
    const emblemSize = opts.emblemSize ?? 62;
    const topPad = opts.topPad ?? 48;
    const brandX = hShowLogo ? 72 + emblemSize + 18 : 72;
    const textInk = opts.darkBand ? '#FFFFFF' : primary;
    const textSub = opts.darkBand ? 'rgba(255,255,255,0.78)' : muted;

    const brandLines: FlowTextLine[] = [];
    if (hCompany) {
      brandLines.push({
        text: hCompany,
        color: textInk,
        weight: String(fonts.displayWeight),
        size: 23,
        fontFamily: fonts.displayFamily,
        letterSpacing: '0.12em',
      });
    }
    if (hTagline) {
      brandLines.push({
        text: hTagline.toUpperCase(),
        color: opts.darkBand ? 'rgba(255,255,255,0.76)' : accent,
        weight: '500',
        size: 10.2,
        fontFamily: fonts.bodyFamily,
        letterSpacing: '0.16em',
      });
    }

    const rightLines: FlowTextLine[] = [];
    if (hPrimaryLine) {
      rightLines.push({
        text: hPrimaryLine,
        color: textInk,
        weight: '600',
        size: 10,
        fontFamily: fonts.bodyFamily,
      });
    }
    if (hSecondaryLine) {
      rightLines.push({
        text: hSecondaryLine,
        color: opts.darkBand ? 'rgba(255,255,255,0.88)' : primary,
        weight: '500',
        size: 10,
        fontFamily: fonts.bodyFamily,
      });
    }
    if (hAddress) {
      rightLines.push({
        text: hAddress,
        color: textSub,
        weight: '400',
        size: 10,
        fontFamily: fonts.bodyFamily,
      });
    }
    if (hDigitalLine) {
      rightLines.push({
        text: hDigitalLine,
        color: textSub,
        weight: '400',
        size: 9.5,
        fontFamily: fonts.monoFamily,
      });
    }
    if (opts.framed && regNo) {
      rightLines.push({
        text: regNo,
        color: accent,
        weight: '600',
        size: 9.5,
        fontFamily: fonts.monoFamily,
      });
    }

    const rightLineHeight = rightLines.length <= 2 ? 18 : 16;
    const rightBlockH = rightLines.length > 0 ? rightLines.length * rightLineHeight : 0;
    const brandBlockH = brandLines.length === 2 ? 42 : brandLines.length === 1 ? 22 : 0;
    const logoH = hShowLogo ? emblemSize : 0;
    const headerContentH = Math.max(logoH, brandBlockH, rightBlockH, 20);

    const logoY = topPad + (headerContentH - logoH) / 2;
    const brandStartY = topPad + (headerContentH - brandBlockH) / 2 + 18;
    const rightStartY = topPad + (headerContentH - rightBlockH) / 2 + 11;
    const ruleY = topPad + headerContentH + 20;
    headerBottomY = ruleY;

    return (
      <g>
        {opts.framed && (
          <>
            <rect x={44} y={36} width={w - 88} height={h - 72} fill="none" stroke={primary} strokeWidth="1.5" />
            <rect x={50} y={42} width={w - 100} height={h - 84} fill="none" stroke={hairline} strokeWidth="0.9" />
          </>
        )}
        {opts.darkBand ? (
          <>
            <rect x={0} y={0} width={w} height={ruleY} fill={primary} />
            <rect x={0} y={ruleY} width={w} height={5} fill={accent} />
          </>
        ) : (
          opts.accentTopBar && <rect x={0} y={0} width={w} height={6} fill={accent} />
        )}

        {hShowLogo && (
          <LogoEmblemSvg
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor={opts.darkBand ? '#FFFFFF' : primary}
            accentColor={opts.darkBand ? 'rgba(255,255,255,0.78)' : accent}
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={72}
            y={logoY}
            size={emblemSize}
          />
        )}

        {brandLines.map((ln, idx) => (
          <text
            key={`hb-${idx}`}
            x={brandX}
            y={brandStartY + idx * 22}
            fill={ln.color}
            fontFamily={ln.fontFamily}
            fontWeight={ln.weight}
            fontSize={ln.size}
            letterSpacing={ln.letterSpacing}
          >
            {ln.text}
          </text>
        ))}

        {rightLines.map((ln, idx) => (
          <text
            key={`hr-${idx}`}
            x={w - 72}
            y={rightStartY + idx * rightLineHeight}
            textAnchor="end"
            fill={ln.color}
            fontFamily={ln.fontFamily}
            fontWeight={ln.weight}
            fontSize={ln.size}
          >
            {ln.text}
          </text>
        ))}

        {!opts.darkBand && (
          <>
            <line
              x1={opts.framed ? 50 : 72}
              y1={ruleY}
              x2={opts.framed ? w - 50 : w - 72}
              y2={ruleY}
              stroke={opts.doubleRule ? primary : accent}
              strokeWidth={opts.doubleRule ? 1.5 : 2}
            />
            {opts.doubleRule && (
              <line x1={72} y1={ruleY + 5} x2={w - 72} y2={ruleY + 5} stroke={hairline} strokeWidth="1" />
            )}
          </>
        )}
      </g>
    );
  };

  let headerNode: React.ReactNode = null;

  if (lh.showHeader) {
    if (lh.layout === 'classic-executive') {
      headerNode = renderTopBandHeader({
        accentTopBar: true,
        doubleRule: true,
        emblemSize: 64,
        topPad: 46,
      });
    } else if (lh.layout === 'minimal-rule') {
      headerNode = renderTopBandHeader({
        accentTopBar: false,
        doubleRule: false,
        emblemSize: 48,
        topPad: 46,
      });
    } else if (lh.layout === 'modern-asymmetric') {
      headerNode = renderTopBandHeader({
        darkBand: true,
        emblemSize: 62,
        topPad: 36,
      });
    } else if (lh.layout === 'double-ledger') {
      headerNode = renderTopBandHeader({
        framed: true,
        doubleRule: false,
        emblemSize: 58,
        topPad: 56,
      });
    } else if (lh.layout === 'pastoral-band') {
      headerNode = renderTopBandHeader({
        accentTopBar: false,
        doubleRule: false,
        emblemSize: 56,
        topPad: 44,
      });
    } else if (lh.layout === 'institutional-crest') {
      let cy = 38;
      const items: React.ReactNode[] = [];
      if (hShowLogo) {
        items.push(
          <LogoEmblemSvg
            key="ic-logo"
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor={primary}
            accentColor={accent}
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={w / 2 - 30}
            y={cy}
            size={60}
          />
        );
        cy += 84;
      } else {
        cy += 24;
      }
      if (hCompany) {
        items.push(
          <text
            key="ic-co"
            x={w / 2}
            y={cy}
            fill={primary}
            fontFamily={fonts.displayFamily}
            fontWeight="700"
            fontSize="24"
            letterSpacing="0.18em"
          >
            {hCompany}
          </text>
        );
        cy += 22;
      }
      if (hTagline) {
        items.push(
          <text
            key="ic-tag"
            x={w / 2}
            y={cy}
            fill={accent}
            fontFamily={fonts.bodyFamily}
            fontWeight="600"
            fontSize="10"
            letterSpacing="0.2em"
          >
            {hTagline.toUpperCase()}
          </text>
        );
        cy += 22;
      }
      const metaSummary = [hAddress, hPrimaryLine, hSecondaryLine, hDigitalLine].filter(Boolean).join('  ·  ');
      if (metaSummary) {
        items.push(
          <text key="ic-meta" x={w / 2} y={cy} fill={muted} fontFamily={fonts.bodyFamily} fontSize="10">
            {metaSummary}
          </text>
        );
        cy += 20;
      }
      const ruleY = Math.max(cy, 72);
      headerBottomY = ruleY + 6;
      headerNode = (
        <g textAnchor="middle">
          {items}
          <line x1={72} y1={ruleY} x2={w - 72} y2={ruleY} stroke={primary} strokeWidth="1.5" />
          <line x1={72} y1={ruleY + 5} x2={w - 72} y2={ruleY + 5} stroke={primary} strokeWidth="0.6" />
        </g>
      );
    } else if (lh.layout === 'left-rail') {
      headerBottomY = 48;
      let railY = 46;
      const railNodes: React.ReactNode[] = [];
      if (hShowLogo) {
        railNodes.push(
          <LogoEmblemSvg
            key="lr-logo"
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor={primary}
            accentColor={accent}
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={30}
            y={railY}
            size={60}
          />
        );
        railY += 86;
      } else {
        railY += 16;
      }
      if (hCompany) {
        railNodes.push(
          <text
            key="lr-co"
            x={30}
            y={railY}
            fill={primary}
            fontFamily={fonts.displayFamily}
            fontWeight="700"
            fontSize="15"
            letterSpacing="0.1em"
          >
            {hCompany}
          </text>
        );
        railY += 20;
      }
      if (hTagline) {
        railNodes.push(
          <text
            key="lr-tag"
            x={30}
            y={railY}
            fill={muted}
            fontFamily={fonts.bodyFamily}
            fontSize="9"
            letterSpacing="0.12em"
          >
            {hTagline.toUpperCase()}
          </text>
        );
        railY += 22;
      }
      if (hShowLogo || hCompany || hTagline) {
        railNodes.push(<line key="lr-div" x1={30} y1={railY} x2={168} y2={railY} stroke={hairline} strokeWidth="1.2" />);
        railY += 28;
      }
      if (lh.headerShowPrimaryContact && (rawPersonName || rawPhone)) {
        railNodes.push(
          <text key="lr-pt" x={30} y={railY} fill={primary} fontWeight="700" fontSize="9" letterSpacing="0.12em">
            {(rawPersonTitle || 'PROPRIETOR').toUpperCase()}
          </text>
        );
        railY += 16;
        if (rawPersonName) {
          railNodes.push(<text key="lr-pn" x={30} y={railY} fill={ink} fontWeight="600">{rawPersonName}</text>);
          railY += 15;
        }
        if (rawPhone) {
          railNodes.push(<text key="lr-pp" x={30} y={railY} fontFamily={fonts.monoFamily}>{rawPhone}</text>);
          railY += 15;
        }
        railY += 18;
      }
      if (lh.headerShowSecondaryContact && (rawSecName || rawSecPhone)) {
        railNodes.push(
          <text key="lr-st" x={30} y={railY} fill={primary} fontWeight="700" fontSize="9" letterSpacing="0.1em">
            {(rawSecTitle || 'FARM OPERATIONS').toUpperCase().slice(0, 20)}
          </text>
        );
        railY += 16;
        if (rawSecName) {
          railNodes.push(<text key="lr-sn" x={30} y={railY} fill={ink} fontWeight="600">{rawSecName}</text>);
          railY += 15;
        }
        if (rawSecPhone) {
          railNodes.push(<text key="lr-sp" x={30} y={railY} fontFamily={fonts.monoFamily}>{rawSecPhone}</text>);
          railY += 15;
        }
        railY += 18;
      }
      if (hAddress) {
        railNodes.push(
          <text key="lr-at" x={30} y={railY} fill={primary} fontWeight="700" fontSize="9" letterSpacing="0.12em">
            ADDRESS
          </text>
        );
        railY += 16;
        if (hAddr1) {
          railNodes.push(<text key="lr-a1" x={30} y={railY}>{hAddr1}</text>);
          railY += 15;
        }
        if (hAddrCity) {
          railNodes.push(<text key="lr-a2" x={30} y={railY}>{hAddrCity}</text>);
          railY += 15;
        }
        railY += 18;
      }
      if (hEmail || hWebsite) {
        railNodes.push(
          <text key="lr-dt" x={30} y={railY} fill={primary} fontWeight="700" fontSize="9" letterSpacing="0.12em">
            DIGITAL
          </text>
        );
        railY += 16;
        if (hEmail) {
          railNodes.push(<text key="lr-em" x={30} y={railY}>{hEmail}</text>);
          railY += 15;
        }
        if (hWebsite) {
          railNodes.push(<text key="lr-wb" x={30} y={railY} fill={accent}>{hWebsite}</text>);
        }
      }

      headerNode = (
        <g>
          <rect
            x={0}
            y={0}
            width={198}
            height={h}
            fill={lh.paperStock === 'cotton-ivory' ? '#F1EDE3' : '#F8FAFC'}
          />
          <line x1={198} y1={0} x2={198} y2={h} stroke={hairline} strokeWidth="1.2" />
          <rect x={0} y={0} width={198} height={8} fill={accent} />
          <g fontFamily={fonts.bodyFamily} fontSize="9.5" fill={muted}>
            {railNodes}
          </g>
        </g>
      );
    }
  } else if (lh.layout === 'double-ledger') {
    headerNode = (
      <g>
        <rect x={44} y={36} width={w - 88} height={h - 72} fill="none" stroke={primary} strokeWidth="1.5" />
        <rect x={50} y={42} width={w - 100} height={h - 84} fill="none" stroke={hairline} strokeWidth="0.9" />
      </g>
    );
    headerBottomY = 66;
  }

  // Dynamic Flowing Body Layout (zero blank gaps when any field is turned off)
  const p1Lines = wrapTextLines(lh.bodyParagraph1, bodyWidthChars);
  const p2Lines = wrapTextLines(lh.bodyParagraph2, bodyWidthChars);
  let cursorY = lh.showHeader ? headerBottomY + 48 : 88;
  const bodyLineHeight = !lh.showHeader || !lh.showFooterRule ? 23.5 : 22;

  const dateVisible = visibility.letterDate && Boolean(lh.dateText.trim());
  const refVisible = visibility.letterRef && Boolean(lh.refNumber.trim());
  const dateRowY = cursorY;
  if (dateVisible || refVisible) {
    cursorY += 42;
  }

  const recipientVisible =
    visibility.letterRecipient && Boolean(lh.recipientName.trim() || lh.recipientAddress.trim());
  const recipientStartY = cursorY;
  if (recipientVisible) {
    if (lh.recipientName.trim()) cursorY += 19;
    if (lh.recipientAddress.trim()) cursorY += 18;
    cursorY += 26;
  }

  const subjectVisible = visibility.letterSubject && Boolean(lh.subjectLine.trim());
  const subjectY = cursorY;
  if (subjectVisible) {
    cursorY += 42;
  }

  const salutationY = cursorY;
  let p1StartY = cursorY;
  let p2StartY = cursorY;
  if (visibility.letterBody) {
    p1StartY = salutationY + 34;
    p2StartY = p1StartY + p1Lines.length * bodyLineHeight + 16;
    cursorY = p2StartY + p2Lines.length * bodyLineHeight + 34;
  }

  const signatureStartY = cursorY;
  const sigTextLines: { text: string; color: string; weight: string; size: number }[] = [];
  if (visibility.letterSignature) {
    if (rawPersonName) {
      sigTextLines.push({ text: rawPersonName, color: primary, weight: '700', size: 13 });
    }
    const subSig = [rawPersonTitle, rawCompany].filter(Boolean).join(' · ');
    if (subSig) {
      sigTextLines.push({ text: subSig, color: muted, weight: '400', size: 11.5 });
    }
  }
  const stampX = visibility.letterSignature ? bodyLeftX + 240 : bodyLeftX;

  // Dynamic Footer Flow
  const footerLeftLines: { text: string; color: string; weight: string; size: number; font: string }[] = [];
  const fLine1 = [fCompany, fAddress].filter(Boolean).join('  ·  ');
  const fLine2 = [fPrimaryLine, fSecondaryLine].filter(Boolean).join('  |  ');
  const isDarkFooter = lh.layout === 'pastoral-band';

  if (fLine1) {
    footerLeftLines.push({
      text: fLine1,
      color: isDarkFooter ? '#FFFFFF' : primary,
      weight: '600',
      size: 9.8,
      font: fonts.bodyFamily,
    });
  }
  if (fLine2) {
    footerLeftLines.push({
      text: fLine2,
      color: isDarkFooter ? 'rgba(255,255,255,0.82)' : muted,
      weight: '400',
      size: 9.2,
      font: fonts.monoFamily,
    });
  }
  const fRightItems = [fEmail, fWebsite].filter(Boolean);
  const hasFooterContent = footerLeftLines.length > 0 || fRightItems.length > 0;
  const pastoralBandH = footerLeftLines.length === 2 ? 92 : 70;
  const footerTopY = isDarkFooter ? h - pastoralBandH : footerLeftLines.length === 2 ? h - 74 : h - 58;
  const footerCenterY = isDarkFooter ? h - pastoralBandH / 2 + 4 : footerTopY + (h - footerTopY) / 2 - 4;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-auto block select-none print-only-sheet"
      role="img"
      aria-label={`${brand.companyName} letterhead`}
    >
      <rect width={w} height={h} fill={paperBg} />

      {/* Center Subtle Watermark Emblem */}
      {lh.showWatermark && (
        <g opacity={lh.watermarkOpacity}>
          <LogoEmblemSvg
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor={primary}
            accentColor={accent}
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={(isLeftRail ? (w + 180) / 2 : w / 2) - 150}
            y={h / 2 - 170}
            size={300}
          />
        </g>
      )}

      {/* Low-Opacity Pastoral Livestock Herd Backdrop */}
      {lh.showLivestockBackdrop && (
        <LivestockWatermarkSvg
          x={isLeftRail ? 204 : 60}
          y={lh.showFooterRule ? h - 275 : h - 220}
          width={isLeftRail ? w - 240 : w - 120}
          color={primary}
          opacity={lh.watermarkOpacity + 0.015}
        />
      )}

      {/* HEADER (Independent Show/Hide) */}
      {headerNode}

      {/* SAMPLE LETTER BODY CONTENT (Flows dynamically without leaving gaps) */}
      {lh.showSampleContent && (
        <g>
          {dateVisible && (
            <text
              x={refVisible ? bodyLeftX : bodyLeftX}
              y={dateRowY}
              fill={ink}
              fontFamily={fonts.bodyFamily}
              fontSize="12"
              fontWeight="500"
            >
              {lh.dateText}
            </text>
          )}
          {refVisible && (
            <text
              x={dateVisible ? bodyRightX : bodyLeftX}
              y={dateRowY}
              textAnchor={dateVisible ? 'end' : 'start'}
              fill={muted}
              fontFamily={fonts.monoFamily}
              fontSize="11"
            >
              {lh.refNumber}
            </text>
          )}

          {recipientVisible && (
            <>
              {lh.recipientName.trim() && (
                <text x={bodyLeftX} y={recipientStartY} fill={ink} fontFamily={fonts.bodyFamily} fontWeight="600" fontSize="12.5">
                  {lh.recipientName}
                </text>
              )}
              {lh.recipientAddress.trim() && (
                <text
                  x={bodyLeftX}
                  y={lh.recipientName.trim() ? recipientStartY + 19 : recipientStartY}
                  fill={muted}
                  fontFamily={fonts.bodyFamily}
                  fontSize="11.5"
                >
                  {lh.recipientAddress}
                </text>
              )}
            </>
          )}

          {subjectVisible && (
            <>
              <text x={bodyLeftX} y={subjectY} fill={primary} fontFamily={fonts.bodyFamily} fontWeight="700" fontSize="13">
                {lh.subjectLine}
              </text>
              <line x1={bodyLeftX} y1={subjectY + 12} x2={bodyRightX} y2={subjectY + 12} stroke={hairline} strokeWidth="1" />
            </>
          )}

          {visibility.letterBody && (
            <>
              <text x={bodyLeftX} y={salutationY} fill={ink} fontFamily={fonts.bodyFamily} fontSize="12.5">
                Dear Sir / Madam,
              </text>
              <g fontFamily={fonts.bodyFamily} fontSize="12.2" fill="#27272A">
                {p1Lines.map((line, i) => (
                  <text key={`p1-${i}`} x={bodyLeftX} y={p1StartY + i * bodyLineHeight}>
                    {line}
                  </text>
                ))}
              </g>
              <g fontFamily={fonts.bodyFamily} fontSize="12.2" fill="#27272A">
                {p2Lines.map((line, i) => (
                  <text key={`p2-${i}`} x={bodyLeftX} y={p2StartY + i * bodyLineHeight}>
                    {line}
                  </text>
                ))}
              </g>
            </>
          )}

          {visibility.letterSignature && (
            <>
              <text x={bodyLeftX} y={signatureStartY} fill={ink} fontFamily={fonts.bodyFamily} fontSize="12.2">
                {lh.closingText}
              </text>
              <path
                d={`M ${bodyLeftX} ${signatureStartY + 42} C ${bodyLeftX + 18} ${signatureStartY + 18}, ${bodyLeftX + 34} ${signatureStartY + 54}, ${bodyLeftX + 54} ${signatureStartY + 34} C ${bodyLeftX + 70} ${signatureStartY + 20}, ${bodyLeftX + 94} ${signatureStartY + 48}, ${bodyLeftX + 122} ${signatureStartY + 32} L ${bodyLeftX + 148} ${signatureStartY + 36}`}
                fill="none"
                stroke={primary}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {sigTextLines.map((sl, idx) => (
                <text
                  key={`sig-${idx}`}
                  x={bodyLeftX}
                  y={signatureStartY + 74 + idx * 18}
                  fill={sl.color}
                  fontFamily={fonts.bodyFamily}
                  fontWeight={sl.weight}
                  fontSize={sl.size}
                >
                  {sl.text}
                </text>
              ))}
            </>
          )}

          {lh.showStampOverlay && (
            <g transform={`translate(${stampX}, ${signatureStartY - 18})`} opacity="0.88">
              <svg width="160" height="160" viewBox="0 0 480 480">
                <StampArtboard
                  brand={brand}
                  logo={logo}
                  stamp={stamp}
                  visibility={visibility}
                  transparentBg={true}
                />
              </svg>
            </g>
          )}
        </g>
      )}

      {/* FOOTER STRIP (Independent Show/Hide + Dynamic Line Height & Float) */}
      {lh.showFooterRule && !isLeftRail && hasFooterContent && (
        isDarkFooter ? (
          <g>
            <rect x={0} y={h - pastoralBandH} width={w} height={pastoralBandH} fill={primary} />
            {footerLeftLines.map((fl, idx) => {
              const baseY =
                footerLeftLines.length === 1
                  ? footerCenterY
                  : h - pastoralBandH + 34 + idx * 20;
              return (
                <text
                  key={`fl-${idx}`}
                  x={72}
                  y={baseY}
                  fill={fl.color}
                  fontFamily={fl.font}
                  fontWeight={fl.weight}
                  fontSize={fl.size}
                >
                  {fl.text}
                </text>
              );
            })}
            {fRightItems.length > 0 && (
              <text
                x={footerLeftLines.length > 0 ? w - 72 : w / 2}
                y={footerCenterY}
                textAnchor={footerLeftLines.length > 0 ? 'end' : 'middle'}
                fill="rgba(255,255,255,0.9)"
                fontFamily={fonts.monoFamily}
                fontSize="10"
              >
                {fRightItems.join('  ·  ')}
              </text>
            )}
          </g>
        ) : (
          <g>
            <line x1={72} y1={footerTopY} x2={w - 72} y2={footerTopY} stroke={hairline} strokeWidth="1.2" />
            {footerLeftLines.map((fl, idx) => {
              const baseY =
                footerLeftLines.length === 1 ? footerCenterY + 4 : footerTopY + 22 + idx * 17;
              return (
                <text
                  key={`fl-${idx}`}
                  x={72}
                  y={baseY}
                  fill={fl.color}
                  fontFamily={fl.font}
                  fontWeight={fl.weight}
                  fontSize={fl.size}
                >
                  {fl.text}
                </text>
              );
            })}
            {fRightItems.length > 0 && (
              <text
                x={footerLeftLines.length > 0 ? w - 72 : w / 2}
                y={footerCenterY + 4}
                textAnchor={footerLeftLines.length > 0 ? 'end' : 'middle'}
                fill={accent}
                fontFamily={fonts.monoFamily}
                fontSize="9.5"
              >
                {fRightItems.join('  ·  ')}
              </text>
            )}
          </g>
        )
      )}
    </svg>
  );
};
