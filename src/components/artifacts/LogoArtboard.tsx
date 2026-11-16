import React from 'react';
import { BrandIdentity, LogoConfig, TextVisibility } from '../../types/brand';
import { DEFAULT_TEXT_VISIBILITY } from '../../data/presets';
import { getFontSet } from '../../utils/typography';
import { LogoEmblemSvg } from '../emblems/LogoEmblemSvg';

interface LogoArtboardProps {
  brand: BrandIdentity;
  logo: LogoConfig;
  visibility?: TextVisibility;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  compact?: boolean;
}

export function getLogoSurfaceColors(
  surface: LogoConfig['surface'],
  primaryColor: string,
  accentColor: string
) {
  switch (surface) {
    case 'obsidian':
      return {
        bg: '#111318',
        ink: '#F8FAFC',
        subInk: '#94A3B8',
        emblemPrimary: '#F8FAFC',
        emblemAccent: '#60A5FA',
        border: '#272B36',
      };
    case 'cobalt':
      return {
        bg: accentColor || '#1E40AF',
        ink: '#FFFFFF',
        subInk: 'rgba(255,255,255,0.78)',
        emblemPrimary: '#FFFFFF',
        emblemAccent: 'rgba(255,255,255,0.72)',
        border: 'transparent',
      };
    case 'alabaster':
      return {
        bg: '#FAF8F3',
        ink: primaryColor,
        subInk: '#64748B',
        emblemPrimary: primaryColor,
        emblemAccent: accentColor,
        border: '#E5E0D5',
      };
    case 'white':
    default:
      return {
        bg: '#FFFFFF',
        ink: primaryColor,
        subInk: '#64748B',
        emblemPrimary: primaryColor,
        emblemAccent: accentColor,
        border: '#E5E7EB',
      };
  }
}

export const LogoArtboard: React.FC<LogoArtboardProps> = ({
  brand,
  logo,
  visibility = DEFAULT_TEXT_VISIBILITY,
  svgRef,
  compact = false,
}) => {
  const fonts = getFontSet(brand.fontPairing);
  const colors = getLogoSurfaceColors(logo.surface, brand.primaryColor, brand.accentColor);
  const company = visibility.companyName ? brand.companyName.trim() || 'YOUR BRAND' : '';
  const tagline = visibility.tagline ? brand.tagline.trim() : '';

  const nameLen = company.length;
  const baseFontSize =
    logo.lockup === 'horizontal'
      ? nameLen > 20
        ? 24
        : nameLen > 14
          ? 29
          : 34
      : nameLen > 20
        ? 26
        : nameLen > 14
          ? 31
          : 36;

  const viewWidth = 800;
  const viewHeight = 480;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      className="w-full h-auto block select-none"
      role="img"
      aria-label={`${company || 'Brand'} logo preview`}
    >
      <rect width={viewWidth} height={viewHeight} fill={colors.bg} />

      {!compact && (
        <g stroke={colors.subInk} strokeOpacity="0.22" strokeWidth="1">
          <line x1="28" y1="28" x2="44" y2="28" />
          <line x1="28" y1="28" x2="28" y2="44" />
          <line x1={viewWidth - 28} y1="28" x2={viewWidth - 44} y2="28" />
          <line x1={viewWidth - 28} y1="28" x2={viewWidth - 28} y2="44" />
          <line x1="28" y1={viewHeight - 28} x2="44" y2={viewHeight - 28} />
          <line x1="28" y1={viewHeight - 28} x2="28" y2={viewHeight - 44} />
          <line x1={viewWidth - 28} y1={viewHeight - 28} x2={viewWidth - 44} y2={viewHeight - 28} />
          <line x1={viewWidth - 28} y1={viewHeight - 28} x2={viewWidth - 28} y2={viewHeight - 44} />
        </g>
      )}

      {logo.lockup === 'emblem' && (
        <LogoEmblemSvg
          emblemId={logo.emblemId}
          useMonogram={logo.useMonogramEmblem}
          monogram={brand.monogram}
          primaryColor={colors.emblemPrimary}
          accentColor={colors.emblemAccent}
          strokeWidth={logo.strokeWeight}
          rounded={logo.roundedCorners}
          fontFamily={fonts.displayFamily}
          x={viewWidth / 2 - 96}
          y={viewHeight / 2 - 96}
          size={192}
        />
      )}

      {logo.lockup === 'wordmark' && (() => {
        const showTag = Boolean(logo.showTagline && tagline);
        const totalH = (company ? 46 : 0) + (showTag ? (company ? 46 : 26) : 0);
        const startY = viewHeight / 2 - totalH / 2;
        return (
          <g>
            {company && (
              <text
                x={viewWidth / 2}
                y={startY + 34}
                textAnchor="middle"
                fill={colors.ink}
                fontFamily={fonts.displayFamily}
                fontWeight={fonts.displayWeight}
                fontSize={baseFontSize + 8}
                letterSpacing={`${logo.letterSpacing}em`}
              >
                {company}
              </text>
            )}
            {showTag && (
              <>
                {company && (
                  <line
                    x1={viewWidth / 2 - 120}
                    y1={startY + 52}
                    x2={viewWidth / 2 + 120}
                    y2={startY + 52}
                    stroke={colors.emblemAccent}
                    strokeWidth="1.2"
                    strokeOpacity="0.6"
                  />
                )}
                <text
                  x={viewWidth / 2}
                  y={company ? startY + 78 : viewHeight / 2 + 5}
                  textAnchor="middle"
                  fill={colors.subInk}
                  fontFamily={fonts.bodyFamily}
                  fontWeight="500"
                  fontSize="13"
                  letterSpacing="0.22em"
                >
                  {tagline.toUpperCase()}
                </text>
              </>
            )}
          </g>
        );
      })()}

      {logo.lockup === 'stacked' && (() => {
        const showTag = Boolean(logo.showTagline && tagline);
        const showEst = Boolean(visibility.establishedYear && brand.establishedYear);
        const linesH =
          (company ? 42 : 0) +
          (showTag ? 34 : 0) +
          (showEst ? 30 : 0);
        const emblemSize = 116;
        const totalH = emblemSize + (linesH > 0 ? 32 + linesH : 0);
        let cy = viewHeight / 2 - totalH / 2;
        const emblemY = cy;
        cy += emblemSize + 36;

        return (
          <g>
            <LogoEmblemSvg
              emblemId={logo.emblemId}
              useMonogram={logo.useMonogramEmblem}
              monogram={brand.monogram}
              primaryColor={colors.emblemPrimary}
              accentColor={colors.emblemAccent}
              strokeWidth={logo.strokeWeight}
              rounded={logo.roundedCorners}
              fontFamily={fonts.displayFamily}
              x={viewWidth / 2 - 58}
              y={emblemY}
              size={emblemSize}
            />
            {company && (() => {
              const y = cy;
              cy += 36;
              return (
                <text
                  x={viewWidth / 2}
                  y={y}
                  textAnchor="middle"
                  fill={colors.ink}
                  fontFamily={fonts.displayFamily}
                  fontWeight={fonts.displayWeight}
                  fontSize={baseFontSize}
                  letterSpacing={`${logo.letterSpacing}em`}
                >
                  {company}
                </text>
              );
            })()}
            {showTag && (() => {
              const y = cy;
              cy += 32;
              return (
                <text
                  x={viewWidth / 2}
                  y={y}
                  textAnchor="middle"
                  fill={colors.subInk}
                  fontFamily={fonts.bodyFamily}
                  fontWeight="500"
                  fontSize="12.5"
                  letterSpacing="0.24em"
                >
                  {tagline.toUpperCase()}
                </text>
              );
            })()}
            {showEst && (
              <text
                x={viewWidth / 2}
                y={cy}
                textAnchor="middle"
                fill={colors.emblemAccent}
                fontFamily={fonts.monoFamily}
                fontWeight="500"
                fontSize="11"
                letterSpacing="0.2em"
              >
                {`EST. ${brand.establishedYear}`}
              </text>
            )}
          </g>
        );
      })()}

      {logo.lockup === 'horizontal' && (() => {
        const showTag = Boolean(logo.showTagline && tagline);
        const hasRightText = Boolean(company || showTag);
        return (
          <g>
            <LogoEmblemSvg
              emblemId={logo.emblemId}
              useMonogram={logo.useMonogramEmblem}
              monogram={brand.monogram}
              primaryColor={colors.emblemPrimary}
              accentColor={colors.emblemAccent}
              strokeWidth={logo.strokeWeight}
              rounded={logo.roundedCorners}
              fontFamily={fonts.displayFamily}
              x={hasRightText ? 130 : viewWidth / 2 - 48}
              y={viewHeight / 2 - 48}
              size={96}
            />
            {hasRightText && (
              <line
                x1="252"
                y1={viewHeight / 2 - 36}
                x2="252"
                y2={viewHeight / 2 + 36}
                stroke={colors.subInk}
                strokeOpacity="0.28"
                strokeWidth="1.2"
              />
            )}
            {company && (
              <text
                x="280"
                y={showTag ? viewHeight / 2 - 4 : viewHeight / 2 + 10}
                textAnchor="start"
                fill={colors.ink}
                fontFamily={fonts.displayFamily}
                fontWeight={fonts.displayWeight}
                fontSize={baseFontSize}
                letterSpacing={`${logo.letterSpacing}em`}
              >
                {company}
              </text>
            )}
            {showTag && (
              <text
                x="282"
                y={company ? viewHeight / 2 + 26 : viewHeight / 2 + 5}
                textAnchor="start"
                fill={colors.subInk}
                fontFamily={fonts.bodyFamily}
                fontWeight="500"
                fontSize="12.5"
                letterSpacing="0.2em"
              >
                {tagline.toUpperCase()}
              </text>
            )}
          </g>
        );
      })()}

      {logo.lockup === 'badge' && (() => {
        const showTag = Boolean(logo.showTagline && tagline);
        const showEst = Boolean(visibility.establishedYear && brand.establishedYear);
        const linesH =
          (company ? 40 : 0) +
          (showTag ? 34 : 0) +
          (showEst ? 44 : 0);
        const emblemSize = 104;
        const totalH = emblemSize + (linesH > 0 ? 30 + linesH : 0);
        let cy = viewHeight / 2 - totalH / 2;
        const emblemY = cy;
        cy += emblemSize + 34;

        return (
          <g>
            <rect
              x="160"
              y="64"
              width="480"
              height="352"
              rx={logo.roundedCorners ? 18 : 0}
              fill="none"
              stroke={colors.emblemPrimary}
              strokeWidth="2.4"
            />
            <rect
              x="170"
              y="74"
              width="460"
              height="332"
              rx={logo.roundedCorners ? 12 : 0}
              fill="none"
              stroke={colors.emblemAccent}
              strokeWidth="1"
              strokeOpacity="0.65"
            />
            <LogoEmblemSvg
              emblemId={logo.emblemId}
              useMonogram={logo.useMonogramEmblem}
              monogram={brand.monogram}
              primaryColor={colors.emblemPrimary}
              accentColor={colors.emblemAccent}
              strokeWidth={logo.strokeWeight}
              rounded={logo.roundedCorners}
              fontFamily={fonts.displayFamily}
              x={viewWidth / 2 - 52}
              y={emblemY}
              size={emblemSize}
            />
            {company && (() => {
              const y = cy;
              cy += 34;
              return (
                <text
                  x={viewWidth / 2}
                  y={y}
                  textAnchor="middle"
                  fill={colors.ink}
                  fontFamily={fonts.displayFamily}
                  fontWeight={fonts.displayWeight}
                  fontSize={baseFontSize - 2}
                  letterSpacing={`${logo.letterSpacing}em`}
                >
                  {company}
                </text>
              );
            })()}
            {showTag && (() => {
              const y = cy;
              cy += 30;
              return (
                <text
                  x={viewWidth / 2}
                  y={y}
                  textAnchor="middle"
                  fill={colors.subInk}
                  fontFamily={fonts.bodyFamily}
                  fontWeight="500"
                  fontSize="11.5"
                  letterSpacing="0.2em"
                >
                  {tagline.toUpperCase()}
                </text>
              );
            })()}
            {showEst && (
              <>
                <line
                  x1="280"
                  y1={cy - 6}
                  x2="520"
                  y2={cy - 6}
                  stroke={colors.emblemAccent}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <text
                  x={viewWidth / 2}
                  y={cy + 20}
                  textAnchor="middle"
                  fill={colors.emblemAccent}
                  fontFamily={fonts.monoFamily}
                  fontWeight="600"
                  fontSize="11"
                  letterSpacing="0.24em"
                >
                  {`ESTABLISHED ${brand.establishedYear}`}
                </text>
              </>
            )}
          </g>
        );
      })()}
    </svg>
  );
};
