import React from 'react';
import {
  BrandIdentity,
  LogoConfig,
  PaperStock,
  TextVisibility,
  VisitingCardConfig,
} from '../../types/brand';
import { DEFAULT_TEXT_VISIBILITY } from '../../data/presets';
import { generateQrMatrix, getFontSet } from '../../utils/typography';
import { LogoEmblemSvg } from '../emblems/LogoEmblemSvg';
import { LivestockWatermarkSvg } from '../emblems/LivestockWatermarkSvg';

interface VisitingCardFaceProps {
  brand: BrandIdentity;
  logo: LogoConfig;
  card: VisitingCardConfig;
  visibility?: TextVisibility;
  side: 'front' | 'back';
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

export function getPaperStockPalette(
  stock: PaperStock,
  primaryColor: string,
  accentColor: string
) {
  switch (stock) {
    case 'cotton-ivory':
      return {
        bg: '#FAF8F3',
        ink: primaryColor,
        muted: '#57534E',
        rule: '#DFD9CE',
        accent: accentColor,
        isDark: false,
      };
    case 'warm-kraft':
      return {
        bg: '#EAE2D3',
        ink: '#292118',
        muted: '#5C4D3C',
        rule: '#CFC3AE',
        accent: '#7C2D12',
        isDark: false,
      };
    case 'obsidian':
      return {
        bg: '#14161B',
        ink: '#F8FAFC',
        muted: '#94A3B8',
        rule: '#2A2E39',
        accent: '#60A5FA',
        isDark: true,
      };
    case 'slate-navy':
      return {
        bg: '#0F172A',
        ink: '#F8FAFC',
        muted: '#94A3B8',
        rule: '#1E293B',
        accent: '#38BDF8',
        isDark: true,
      };
    case 'white':
    default:
      return {
        bg: '#FFFFFF',
        ink: primaryColor,
        muted: '#52525B',
        rule: '#E4E4E7',
        accent: accentColor,
        isDark: false,
      };
  }
}

export const VisitingCardFaceSvg: React.FC<VisitingCardFaceProps> = ({
  brand,
  logo,
  card,
  visibility = DEFAULT_TEXT_VISIBILITY,
  side,
  svgRef,
}) => {
  const fonts = getFontSet(brand.fontPairing);
  const palette = getPaperStockPalette(card.paperStock, brand.primaryColor, brand.accentColor);

  const w = card.standard === 'iso' ? 1004 : 1050;
  const h = card.standard === 'iso' ? 650 : 600;
  const pad = 64;

  const company = visibility.companyName ? brand.companyName.trim() : '';
  const tagline = visibility.tagline ? brand.tagline.trim() : '';
  const regNo = visibility.registrationNo ? brand.registrationNo.trim() : '';
  const estText =
    visibility.establishedYear && brand.establishedYear.trim()
      ? `EST. ${brand.establishedYear.trim()}`
      : '';

  const person = visibility.personName ? brand.personName.trim() : '';
  const title = visibility.personTitle ? brand.personTitle.trim() : '';
  const phone = visibility.phone ? brand.phone.trim() : '';

  const secName = visibility.secondaryPersonName ? brand.secondaryPersonName.trim() : '';
  const secTitle = visibility.secondaryPersonTitle ? brand.secondaryPersonTitle.trim() : '';
  const secPhone = visibility.secondaryPhone ? brand.secondaryPhone.trim() : '';

  const primaryLine = [title.toUpperCase(), phone].filter(Boolean).join('  ·  ');
  const secLine = [secTitle.toUpperCase(), secPhone].filter(Boolean).join('  ·  ');
  const hasPrimary = Boolean(person || primaryLine);
  const hasSecondary = Boolean(secName || secLine);

  const email = visibility.email ? brand.email.trim() : '';
  const website = visibility.website ? brand.website.trim() : '';
  const addr1 = visibility.address ? brand.addressLine1.trim() : '';
  const addrCity = visibility.address ? brand.cityState.trim() : '';
  const fullAddr = [addr1, addrCity].filter(Boolean).join(', ');

  const qrSeed = `${brand.companyName}|${brand.personName}|${brand.phone}|${brand.email}|${brand.website}`;
  const qrMatrix = generateQrMatrix(qrSeed);

  const renderQrBlock = (qx: number, qy: number, qSize: number, fg: string, bg: string) => {
    const cell = qSize / qrMatrix.length;
    return (
      <g>
        <rect x={qx - 6} y={qy - 6} width={qSize + 12} height={qSize + 12} fill={bg} />
        {qrMatrix.map((row, rIdx) =>
          row.map((on, cIdx) =>
            on ? (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={qx + cIdx * cell}
                y={qy + rIdx * cell}
                width={cell + 0.3}
                height={cell + 0.3}
                fill={fg}
              />
            ) : null
          )
        )}
      </g>
    );
  };

  const renderBleedMarks = () => {
    if (!card.showBleedMarks) return null;
    const m = 28;
    const markColor = palette.isDark ? '#64748B' : '#94A3B8';
    return (
      <g stroke={markColor} strokeWidth="1.5" strokeDasharray="5 4">
        <rect x={m} y={m} width={w - m * 2} height={h - m * 2} fill="none" />
        <line x1={0} y1={m} x2={18} y2={m} strokeDasharray="none" />
        <line x1={m} y1={0} x2={m} y2={18} strokeDasharray="none" />
        <line x1={w} y1={m} x2={w - 18} y2={m} strokeDasharray="none" />
        <line x1={w - m} y1={0} x2={w - m} y2={18} strokeDasharray="none" />
        <line x1={0} y1={h - m} x2={18} y2={h - m} strokeDasharray="none" />
        <line x1={m} y1={h} x2={m} y2={h - 18} strokeDasharray="none" />
        <line x1={w} y1={h - m} x2={w - 18} y2={h - m} strokeDasharray="none" />
        <line x1={w - m} y1={h} x2={w - m} y2={h - 18} strokeDasharray="none" />
      </g>
    );
  };

  // Back Face (dynamically centered regardless of hidden company/tagline/address)
  if (side === 'back') {
    const isSolidBack = card.backStyle === 'solid-accent';
    const backBg = isSolidBack ? (palette.isDark ? palette.accent : brand.primaryColor) : palette.bg;
    const backInk = isSolidBack ? '#FFFFFF' : palette.ink;
    const backMuted = isSolidBack ? 'rgba(255,255,255,0.75)' : palette.muted;
    const backAccent = isSolidBack ? 'rgba(255,255,255,0.86)' : palette.accent;

    const showBackEmblem = card.backStyle !== 'minimal-wordmark';
    const textH = (company ? 38 : 0) + (tagline ? 32 : 0);
    const totalCenterH = (showBackEmblem ? 128 + (textH > 0 ? 28 : 0) : 0) + textH;
    const centerAreaMid = fullAddr ? (h - 54) / 2 : h / 2;
    let curY = centerAreaMid - totalCenterH / 2;

    return (
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto block select-none"
        role="img"
        aria-label={`${brand.companyName} visiting card back`}
      >
        <rect width={w} height={h} fill={backBg} />

        {card.showLivestockWatermark && (
          <LivestockWatermarkSvg
            x={w / 2 - 360}
            y={h - 215}
            width={720}
            color={backInk}
            opacity={isSolidBack ? 0.08 : 0.055}
          />
        )}

        {card.layout === 'architectural-frame' && (
          <rect
            x={34}
            y={34}
            width={w - 68}
            height={h - 68}
            fill="none"
            stroke={backInk}
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
        )}

        {showBackEmblem && (
          <LogoEmblemSvg
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor={backInk}
            accentColor={backAccent}
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={w / 2 - 64}
            y={curY}
            size={128}
          />
        )}
        {(() => {
          if (showBackEmblem) curY += 156;
          const nodes: React.ReactNode[] = [];
          if (company) {
            nodes.push(
              <text
                key="b-co"
                x={w / 2}
                y={curY + 26}
                textAnchor="middle"
                fill={backInk}
                fontFamily={fonts.displayFamily}
                fontWeight={fonts.displayWeight}
                fontSize={showBackEmblem ? 28 : 36}
                letterSpacing="0.18em"
              >
                {company}
              </text>
            );
            curY += 38;
          }
          if (tagline) {
            nodes.push(
              <text
                key="b-tag"
                x={w / 2}
                y={curY + 20}
                textAnchor="middle"
                fill={backMuted}
                fontFamily={fonts.bodyFamily}
                fontWeight="500"
                fontSize={showBackEmblem ? 13 : 14}
                letterSpacing="0.2em"
              >
                {tagline.toUpperCase()}
              </text>
            );
          }
          return nodes;
        })()}

        {(card.backStyle === 'minimal-wordmark' ? website : fullAddr) && (
          <text
            x={w / 2}
            y={h - 48}
            textAnchor="middle"
            fill={card.backStyle === 'minimal-wordmark' ? backAccent : backMuted}
            fontFamily={fonts.monoFamily}
            fontWeight="500"
            fontSize="14.5"
            letterSpacing="0.1em"
          >
            {card.backStyle === 'minimal-wordmark' ? website : fullAddr}
          </text>
        )}

        {card.showQrMatrix &&
          renderQrBlock(
            w - 140,
            h - 140,
            80,
            isSolidBack ? backBg : backInk,
            isSolidBack ? '#FFFFFF' : palette.isDark ? '#1E293B' : '#FFFFFF'
          )}

        {renderBleedMarks()}
      </svg>
    );
  }

  // Helper to render stacked flowing contact blocks for left-aligned layouts
  const renderStackedPeople = (xPos: number, startY: number, align: 'start' | 'end' = 'start', compactGap = 24) => {
    let py = startY;
    const nodes: React.ReactNode[] = [];

    if (hasPrimary) {
      if (person) {
        nodes.push(
          <text
            key="p-name"
            x={xPos}
            y={py}
            textAnchor={align}
            fill={palette.ink}
            fontFamily={fonts.displayFamily}
            fontWeight="700"
            fontSize="30"
          >
            {person}
          </text>
        );
        py += 28;
      }
      if (primaryLine) {
        nodes.push(
          <text
            key="p-meta"
            x={xPos}
            y={py}
            textAnchor={align}
            fill={palette.accent}
            fontFamily={fonts.bodyFamily}
            fontWeight="600"
            fontSize="13.5"
            letterSpacing="0.09em"
          >
            {primaryLine}
          </text>
        );
        py += 22;
      }
      py += compactGap;
    }

    if (hasSecondary) {
      if (secName) {
        nodes.push(
          <text
            key="s-name"
            x={xPos}
            y={py}
            textAnchor={align}
            fill={palette.ink}
            fontFamily={fonts.displayFamily}
            fontWeight="700"
            fontSize="24"
          >
            {secName}
          </text>
        );
        py += 26;
      }
      if (secLine) {
        nodes.push(
          <text
            key="s-meta"
            x={xPos}
            y={py}
            textAnchor={align}
            fill={palette.muted}
            fontFamily={fonts.bodyFamily}
            fontWeight="600"
            fontSize="12"
            letterSpacing="0.06em"
          >
            {secLine}
          </text>
        );
        py += 20;
      }
    }

    return { nodes, endY: py };
  };

  // Bottom stack helper (builds lines bottom-up so no empty gap above bottom edge)
  const renderBottomStack = (
    xPos: number,
    bottomY: number,
    lines: { text: string; color: string; font: string; size?: number }[],
    align: 'start' | 'end' | 'middle' = 'start',
    step = 30
  ) => {
    const active = lines.filter((l) => l.text);
    return active.map((ln, i) => {
      const y = bottomY - (active.length - 1 - i) * step;
      return (
        <text
          key={`bot-${i}`}
          x={xPos}
          y={y}
          textAnchor={align}
          fill={ln.color}
          fontFamily={ln.font}
          fontSize={ln.size ?? 14.5}
        >
          {ln.text}
        </text>
      );
    });
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-auto block select-none"
      role="img"
      aria-label={`${brand.companyName} visiting card front`}
    >
      <rect width={w} height={h} fill={palette.bg} />

      {card.showLivestockWatermark && (
        <LivestockWatermarkSvg
          x={w - 590}
          y={h - 195}
          width={560}
          color={palette.ink}
          opacity={palette.isDark ? 0.08 : 0.055}
        />
      )}

      {/* 1. EXECUTIVE MINIMAL */}
      {card.layout === 'executive-minimal' && (
        <g>
          <LogoEmblemSvg
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor={palette.ink}
            accentColor={palette.accent}
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={pad}
            y={pad - 8}
            size={64}
          />
          {company && (
            <text
              x={pad + 82}
              y={tagline ? pad + 22 : pad + 32}
              fill={palette.ink}
              fontFamily={fonts.displayFamily}
              fontWeight={fonts.displayWeight}
              fontSize="24"
              letterSpacing="0.12em"
            >
              {company}
            </text>
          )}
          {tagline && (
            <text
              x={pad + 82}
              y={company ? pad + 46 : pad + 30}
              fill={palette.muted}
              fontFamily={fonts.bodyFamily}
              fontWeight="500"
              fontSize="12"
              letterSpacing="0.16em"
            >
              {tagline.toUpperCase()}
            </text>
          )}

          <line x1={pad} y1={164} x2={w - pad} y2={164} stroke={palette.rule} strokeWidth="1.5" />

          {renderStackedPeople(pad, 236, 'start', 26).nodes}

          {fullAddr && (
            <text x={pad} y={h - 56} fill={palette.muted} fontFamily={fonts.bodyFamily} fontSize="14.5">
              {fullAddr}
            </text>
          )}

          {renderBottomStack(
            w - pad,
            h - 56,
            [
              { text: email, color: palette.ink, font: fonts.monoFamily },
              { text: website, color: palette.accent, font: fonts.monoFamily },
            ],
            'end',
            32
          )}
        </g>
      )}

      {/* 2. SWISS GRID */}
      {card.layout === 'swiss-grid' && (() => {
        const rightRows: { label: string; lines: string[]; accent?: boolean }[] = [];
        if (phone) rightRows.push({ label: 'MOBILE', lines: [phone] });
        if (email) rightRows.push({ label: 'EMAIL', lines: [email] });
        if (website) rightRows.push({ label: 'WEB', lines: [website], accent: true });
        if (addr1 || addrCity) {
          rightRows.push({ label: 'FARM', lines: [addr1, addrCity].filter(Boolean) });
        }

        const hasRightCol = rightRows.length > 0;
        const dividerX = w * 0.49;
        const rowStep = rightRows.length <= 2 ? 78 : rightRows.length === 3 ? 68 : 60;
        let ry = 208;

        let leftY = 204;
        const leftNodes: React.ReactNode[] = [];
        if (hasPrimary) {
          if (person) {
            leftNodes.push(
              <text key="sg-pn" x={pad} y={leftY} fill={palette.ink} fontFamily={fonts.displayFamily} fontWeight="700" fontSize="28">
                {person}
              </text>
            );
            leftY += 26;
          }
          if (title) {
            leftNodes.push(
              <text key="sg-pt" x={pad} y={leftY} fill={palette.accent} fontFamily={fonts.bodyFamily} fontWeight="600" fontSize="13" letterSpacing="0.1em">
                {title.toUpperCase()}
              </text>
            );
            leftY += 25;
          }
          if (phone) {
            leftNodes.push(
              <text key="sg-pp" x={pad} y={leftY} fill={palette.ink} fontFamily={fonts.monoFamily} fontSize="14">
                {phone}
              </text>
            );
            leftY += 24;
          }
          if (hasSecondary) {
            leftNodes.push(
              <line
                key="sg-div"
                x1={pad}
                y1={leftY + 6}
                x2={(hasRightCol ? dividerX : w - pad) - 34}
                y2={leftY + 6}
                stroke={palette.rule}
                strokeWidth="1"
              />
            );
            leftY += 42;
          }
        }
        if (hasSecondary) {
          if (secName) {
            leftNodes.push(
              <text key="sg-sn" x={pad} y={leftY} fill={palette.ink} fontFamily={fonts.displayFamily} fontWeight="700" fontSize="23">
                {secName}
              </text>
            );
            leftY += 25;
          }
          if (secTitle) {
            leftNodes.push(
              <text key="sg-st" x={pad} y={leftY} fill={palette.muted} fontFamily={fonts.bodyFamily} fontWeight="600" fontSize="11.5" letterSpacing="0.06em">
                {secTitle.toUpperCase()}
              </text>
            );
            leftY += 24;
          }
          if (secPhone) {
            leftNodes.push(
              <text key="sg-sp" x={pad} y={leftY} fill={palette.ink} fontFamily={fonts.monoFamily} fontSize="14">
                {secPhone}
              </text>
            );
          }
        }

        return (
          <g>
            <rect x={0} y={0} width={w} height={10} fill={palette.accent} />

            <LogoEmblemSvg
              emblemId={logo.emblemId}
              useMonogram={logo.useMonogramEmblem}
              monogram={brand.monogram}
              primaryColor={palette.ink}
              accentColor={palette.accent}
              strokeWidth={logo.strokeWeight}
              rounded={logo.roundedCorners}
              fontFamily={fonts.displayFamily}
              x={pad}
              y={50}
              size={62}
            />
            {company && (
              <text
                x={pad + 80}
                y={tagline ? 79 : 89}
                fill={palette.ink}
                fontFamily={fonts.displayFamily}
                fontWeight={fonts.displayWeight}
                fontSize="24"
                letterSpacing="0.12em"
              >
                {company}
              </text>
            )}
            {tagline && (
              <text
                x={pad + 80}
                y={company ? 104 : 86}
                fill={palette.muted}
                fontFamily={fonts.bodyFamily}
                fontWeight="500"
                fontSize="11.5"
                letterSpacing="0.16em"
              >
                {tagline.toUpperCase()}
              </text>
            )}
            {regNo && (
              <text
                x={w - pad}
                y={82}
                textAnchor="end"
                fill={palette.muted}
                fontFamily={fonts.monoFamily}
                fontSize="12.5"
              >
                {regNo}
              </text>
            )}

            <line x1={pad} y1={148} x2={w - pad} y2={148} stroke={palette.rule} strokeWidth="1.5" />
            {hasRightCol && (
              <line x1={dividerX} y1={148} x2={dividerX} y2={h - 46} stroke={palette.rule} strokeWidth="1.5" />
            )}

            {leftNodes}

            {fullAddr && (
              <text x={pad} y={h - 60} fill={palette.muted} fontFamily={fonts.bodyFamily} fontSize="13.5">
                {fullAddr}
              </text>
            )}

            {hasRightCol && (
              <g fontSize="14.5">
                {rightRows.map((row, rIdx) => {
                  const currentY = ry;
                  ry += rowStep + (row.lines.length > 1 ? 14 : 0);
                  return (
                    <g key={row.label}>
                      <text x={dividerX + 34} y={currentY} fill={palette.muted} fontFamily={fonts.monoFamily} fontSize="11.5">
                        {row.label}
                      </text>
                      {row.lines.map((ln, lIdx) => (
                        <text
                          key={lIdx}
                          x={dividerX + 106}
                          y={currentY + lIdx * 23}
                          fill={lIdx > 0 ? palette.muted : row.accent ? palette.accent : palette.ink}
                          fontFamily={row.label === 'MOBILE' || row.label === 'WEB' ? fonts.monoFamily : fonts.bodyFamily}
                          fontSize={lIdx > 0 ? 13.5 : 14}
                        >
                          {ln}
                        </text>
                      ))}
                      {rIdx < rightRows.length - 1 && (
                        <line
                          x1={dividerX + 34}
                          y1={currentY + (row.lines.length > 1 ? 42 : 24)}
                          x2={w - pad}
                          y2={currentY + (row.lines.length > 1 ? 42 : 24)}
                          stroke={palette.rule}
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        );
      })()}

      {/* 3. EDITORIAL SPLIT */}
      {card.layout === 'editorial-split' && (() => {
        const rightX = w * 0.35 + 54;
        const { nodes: peopleNodes, endY } = renderStackedPeople(rightX, 106, 'start', 24);
        const showDivider = (hasPrimary || hasSecondary) && (email || website || addr1 || addrCity);
        const ruleY = Math.max(endY + 12, 130);
        const contactItems = [
          { text: email, color: palette.ink, font: fonts.bodyFamily },
          { text: website, color: palette.accent, font: fonts.bodyFamily },
        ].filter((c) => c.text);

        // Center left-panel emblem vertically if company/regNo are hidden
        const leftHasText = Boolean(company);
        const emblemY = leftHasText ? h * 0.32 - 48 : h / 2 - 48;

        return (
          <g>
            <rect
              x={0}
              y={0}
              width={w * 0.35}
              height={h}
              fill={palette.isDark ? palette.accent : brand.primaryColor}
            />
            <LogoEmblemSvg
              emblemId={logo.emblemId}
              useMonogram={logo.useMonogramEmblem}
              monogram={brand.monogram}
              primaryColor="#FFFFFF"
              accentColor="rgba(255,255,255,0.78)"
              strokeWidth={logo.strokeWeight}
              rounded={logo.roundedCorners}
              fontFamily={fonts.displayFamily}
              x={w * 0.175 - 48}
              y={emblemY}
              size={96}
            />
            {company && (
              <text
                x={w * 0.175}
                y={h * 0.6}
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily={fonts.displayFamily}
                fontWeight="700"
                fontSize="18"
                letterSpacing="0.12em"
              >
                {company}
              </text>
            )}
            {(regNo || estText) && (
              <text
                x={w * 0.175}
                y={h - 56}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontFamily={fonts.monoFamily}
                fontSize="12.5"
                letterSpacing="0.16em"
              >
                {regNo || estText}
              </text>
            )}

            {peopleNodes}

            {showDivider && (
              <line x1={rightX} y1={ruleY} x2={w - pad} y2={ruleY} stroke={palette.rule} strokeWidth="1.5" />
            )}

            <g fontFamily={fonts.bodyFamily} fontSize="15.5">
              {contactItems.map((ci, idx) => (
                <text
                  key={`ed-c-${idx}`}
                  x={rightX}
                  y={(showDivider ? ruleY + 46 : 112) + idx * 34}
                  fill={ci.color}
                  fontFamily={ci.font}
                >
                  {ci.text}
                </text>
              ))}
              {renderBottomStack(
                rightX,
                h - 62,
                [
                  { text: addr1, color: palette.muted, font: fonts.bodyFamily },
                  { text: addrCity, color: palette.muted, font: fonts.bodyFamily },
                ],
                'start',
                28
              )}
            </g>
          </g>
        );
      })()}

      {/* 4. MONOGRAM CREST */}
      {card.layout === 'monogram-crest' && (() => {
        let cy = 42;
        const topNodes: React.ReactNode[] = [
          <LogoEmblemSvg
            key="mc-em"
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor={palette.ink}
            accentColor={palette.accent}
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={w / 2 - 36}
            y={cy}
            size={72}
          />,
        ];
        cy += 106;
        if (company) {
          topNodes.push(
            <text
              key="mc-co"
              x={w / 2}
              y={cy}
              fill={palette.ink}
              fontFamily={fonts.displayFamily}
              fontWeight={fonts.displayWeight}
              fontSize="24"
              letterSpacing="0.2em"
            >
              {company}
            </text>
          );
          cy += 26;
        }
        topNodes.push(
          <line key="mc-r1" x1={w / 2 - 90} y1={cy} x2={w / 2 + 90} y2={cy} stroke={palette.accent} strokeWidth="1.5" />
        );
        cy += 58;

        if (person) {
          topNodes.push(
            <text key="mc-pn" x={w / 2} y={cy} fill={palette.ink} fontFamily={fonts.displayFamily} fontWeight="700" fontSize="31">
              {person}
            </text>
          );
          cy += 30;
        }
        if (primaryLine) {
          topNodes.push(
            <text key="mc-pm" x={w / 2} y={cy} fill={palette.accent} fontFamily={fonts.bodyFamily} fontWeight="600" fontSize="13.5" letterSpacing="0.14em">
              {primaryLine}
            </text>
          );
          cy += 46;
        }
        if (hasSecondary) {
          topNodes.push(
            <text key="mc-sec" x={w / 2} y={cy} fill={palette.ink} fontFamily={fonts.bodyFamily} fontWeight="500" fontSize="14">
              {[secName, secTitle ? `(${secTitle})` : '', secPhone].filter(Boolean).join('  ·  ')}
            </text>
          );
        }

        const digitalLine = [email, website].filter(Boolean).join('  ·  ');
        const bottomLines = [
          { text: digitalLine, color: palette.ink, font: fonts.monoFamily, size: 14.5 },
          { text: fullAddr, color: palette.muted, font: fonts.bodyFamily, size: 14 },
        ].filter((b) => b.text);

        return (
          <g textAnchor="middle">
            {topNodes}
            {bottomLines.length > 0 && (
              <>
                <line
                  x1={pad}
                  y1={h - 56 - bottomLines.length * 32}
                  x2={w - pad}
                  y2={h - 56 - bottomLines.length * 32}
                  stroke={palette.rule}
                  strokeWidth="1.2"
                />
                {renderBottomStack(w / 2, h - 50, bottomLines, 'middle', 32)}
              </>
            )}
          </g>
        );
      })()}

      {/* 5. ARCHITECTURAL FRAME */}
      {card.layout === 'architectural-frame' && (
        <g>
          <rect x={32} y={32} width={w - 64} height={h - 64} fill="none" stroke={palette.ink} strokeWidth="2" />
          <rect x={42} y={42} width={w - 84} height={h - 84} fill="none" stroke={palette.rule} strokeWidth="1" />

          <LogoEmblemSvg
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor={palette.ink}
            accentColor={palette.accent}
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={76}
            y={72}
            size={64}
          />
          {company && (
            <text
              x={160}
              y={tagline ? 100 : 112}
              fill={palette.ink}
              fontFamily={fonts.displayFamily}
              fontWeight={fonts.displayWeight}
              fontSize="24"
              letterSpacing="0.14em"
            >
              {company}
            </text>
          )}
          {tagline && (
            <text
              x={160}
              y={company ? 124 : 108}
              fill={palette.muted}
              fontFamily={fonts.bodyFamily}
              fontSize="12"
              letterSpacing="0.15em"
            >
              {tagline.toUpperCase()}
            </text>
          )}

          {(() => {
            // Compute stacked left-bottom block so hiding primary/secondary leaves zero gap above bottom frame
            const leftStack: { text: string; color: string; font: string; size: number; weight?: string; gapAfter?: number }[] = [];
            if (person) leftStack.push({ text: person, color: palette.ink, font: fonts.displayFamily, size: 30, weight: '700' });
            if (primaryLine) leftStack.push({ text: primaryLine, color: palette.accent, font: fonts.monoFamily, size: 13.5, weight: '600', gapAfter: hasSecondary ? 22 : 0 });
            if (secName) leftStack.push({ text: secName, color: palette.ink, font: fonts.displayFamily, size: 24, weight: '700' });
            if (secLine) leftStack.push({ text: secLine, color: palette.muted, font: fonts.monoFamily, size: 12.5 });

            let totalH = leftStack.reduce((acc, item) => acc + (item.size > 20 ? 32 : 24) + (item.gapAfter ?? 0), 0);
            let curY = h - 68 - totalH + 24;
            return leftStack.map((item, idx) => {
              const node = (
                <text
                  key={`af-l-${idx}`}
                  x={76}
                  y={curY}
                  fill={item.color}
                  fontFamily={item.font}
                  fontWeight={item.weight}
                  fontSize={item.size}
                >
                  {item.text}
                </text>
              );
              curY += (item.size > 20 ? 32 : 24) + (item.gapAfter ?? 0);
              return node;
            });
          })()}

          {renderBottomStack(
            w - 76,
            h - 70,
            [
              { text: email, color: palette.ink, font: fonts.monoFamily, size: 14 },
              { text: website, color: palette.accent, font: fonts.monoFamily, size: 14 },
              { text: addr1, color: palette.muted, font: fonts.monoFamily, size: 14 },
              { text: addrCity, color: palette.muted, font: fonts.monoFamily, size: 14 },
            ],
            'end',
            29
          )}
        </g>
      )}

      {/* 6. DIAGONAL RIBBON */}
      {card.layout === 'diagonal-ribbon' && (() => {
        const leftHasText = Boolean(company || tagline);
        return (
          <g>
            <polygon
              points={`0,0 ${w * 0.44},0 ${w * 0.28},${h} 0,${h}`}
              fill={palette.isDark ? palette.accent : brand.primaryColor}
            />
            <polygon
              points={`${w * 0.44},0 ${w * 0.455},0 ${w * 0.295},${h} ${w * 0.28},${h}`}
              fill={palette.accent}
              fillOpacity="0.6"
            />

            <LogoEmblemSvg
              emblemId={logo.emblemId}
              useMonogram={logo.useMonogramEmblem}
              monogram={brand.monogram}
              primaryColor="#FFFFFF"
              accentColor="rgba(255,255,255,0.75)"
              strokeWidth={logo.strokeWeight}
              rounded={logo.roundedCorners}
              fontFamily={fonts.displayFamily}
              x={64}
              y={leftHasText ? 74 : h / 2 - 42}
              size={84}
            />
            {company && (
              <text
                x={64}
                y={212}
                fill="#FFFFFF"
                fontFamily={fonts.displayFamily}
                fontWeight="700"
                fontSize="20"
                letterSpacing="0.1em"
              >
                {company}
              </text>
            )}
            {tagline && (
              <text
                x={64}
                y={company ? 242 : 212}
                fill="rgba(255,255,255,0.75)"
                fontFamily={fonts.bodyFamily}
                fontSize="11.5"
                letterSpacing="0.12em"
              >
                {tagline.toUpperCase()}
              </text>
            )}

            {renderStackedPeople(w - pad, 128, 'end', 26).nodes}

            {renderBottomStack(
              w - pad,
              h - 62,
              [
                { text: email, color: palette.ink, font: fonts.monoFamily },
                { text: website, color: palette.accent, font: fonts.monoFamily },
                { text: fullAddr, color: palette.muted, font: fonts.bodyFamily, size: 14 },
              ],
              'end',
              32
            )}
          </g>
        );
      })()}

      {/* 7. PASTORAL HORIZON */}
      {card.layout === 'pastoral-horizon' && (
        <g>
          <rect
            x={0}
            y={0}
            width={w}
            height={146}
            fill={palette.isDark ? palette.accent : brand.primaryColor}
          />
          <rect x={0} y={146} width={w} height={6} fill={palette.accent} />

          <LogoEmblemSvg
            emblemId={logo.emblemId}
            useMonogram={logo.useMonogramEmblem}
            monogram={brand.monogram}
            primaryColor="#FFFFFF"
            accentColor="rgba(255,255,255,0.8)"
            strokeWidth={logo.strokeWeight}
            rounded={logo.roundedCorners}
            fontFamily={fonts.displayFamily}
            x={pad}
            y={38}
            size={70}
          />
          {company && (
            <text
              x={pad + 92}
              y={tagline ? 72 : 83}
              fill="#FFFFFF"
              fontFamily={fonts.displayFamily}
              fontWeight="700"
              fontSize="27"
              letterSpacing="0.14em"
            >
              {company}
            </text>
          )}
          {tagline && (
            <text
              x={pad + 92}
              y={company ? 100 : 80}
              fill="rgba(255,255,255,0.8)"
              fontFamily={fonts.bodyFamily}
              fontSize="12.5"
              letterSpacing="0.16em"
            >
              {tagline.toUpperCase()}
            </text>
          )}

          {hasPrimary && (
            <g>
              {person && (
                <text x={pad} y={236} fill={palette.ink} fontFamily={fonts.displayFamily} fontWeight="700" fontSize="30">
                  {person}
                </text>
              )}
              {primaryLine && (
                <text x={pad} y={person ? 266 : 236} fill={palette.accent} fontFamily={fonts.bodyFamily} fontWeight="600" fontSize="13.5">
                  {primaryLine}
                </text>
              )}
            </g>
          )}

          {hasSecondary && (
            <g>
              {secName && (
                <text
                  x={hasPrimary ? w * 0.54 : pad}
                  y={236}
                  fill={palette.ink}
                  fontFamily={fonts.displayFamily}
                  fontWeight="700"
                  fontSize="26"
                >
                  {secName}
                </text>
              )}
              {secLine && (
                <text
                  x={hasPrimary ? w * 0.54 : pad}
                  y={secName ? 266 : 236}
                  fill={palette.muted}
                  fontFamily={fonts.bodyFamily}
                  fontWeight="600"
                  fontSize="12.5"
                >
                  {secLine}
                </text>
              )}
            </g>
          )}

          {(fullAddr || email || website) && (
            <>
              <line
                x1={pad}
                y1={fullAddr && (email || website) ? h - 144 : h - 108}
                x2={w - pad}
                y2={fullAddr && (email || website) ? h - 144 : h - 108}
                stroke={palette.rule}
                strokeWidth="1.2"
              />
              {renderBottomStack(
                pad,
                h - 58,
                [
                  { text: fullAddr, color: palette.muted, font: fonts.bodyFamily },
                  { text: [email, website].filter(Boolean).join('   ·   '), color: palette.ink, font: fonts.monoFamily },
                ],
                'start',
                34
              )}
            </>
          )}
        </g>
      )}

      {renderBleedMarks()}
    </svg>
  );
};
