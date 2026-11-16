import React, { useId } from 'react';
import { BrandIdentity, LogoConfig, StampConfig, TextVisibility } from '../../types/brand';
import { DEFAULT_TEXT_VISIBILITY } from '../../data/presets';
import { getFontSet } from '../../utils/typography';
import { LogoEmblemSvg } from '../emblems/LogoEmblemSvg';

interface StampArtboardProps {
  brand: BrandIdentity;
  logo: LogoConfig;
  stamp: StampConfig;
  visibility?: TextVisibility;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  transparentBg?: boolean;
}

export const StampArtboard: React.FC<StampArtboardProps> = ({
  brand,
  logo,
  stamp,
  visibility = DEFAULT_TEXT_VISIBILITY,
  svgRef,
  transparentBg = false,
}) => {
  const uid = useId().replace(/:/g, '');
  const fonts = getFontSet(brand.fontPairing);

  const topArcId = `stamp-top-arc-${uid}`;
  const bottomArcId = `stamp-bottom-arc-${uid}`;
  const distressFilterId = `stamp-distress-${uid}`;

  const ink = stamp.inkColor || '#1E3A8A';
  const topText = visibility.stampTopArc
    ? (stamp.topArcText || brand.companyName || 'OFFICIAL SEAL').toUpperCase()
    : '';
  const bottomText = visibility.stampBottomArc
    ? (stamp.bottomArcText || brand.registrationNo || 'AUTHORIZED').toUpperCase()
    : '';
  const centerLabel = visibility.stampCenterLabel
    ? (stamp.centerLabel || 'APPROVED').toUpperCase()
    : '';
  const subLabel = visibility.stampSubLabel
    ? (stamp.subLabel || `EST. ${brand.establishedYear || '2026'}`).toUpperCase()
    : '';

  const viewSize = 480;
  const cx = viewSize / 2;
  const cy = viewSize / 2;

  const isDashed = stamp.borderStyle === 'dashed-inner';
  const isDouble = stamp.borderStyle === 'double-solid';
  const isNotched = stamp.borderStyle === 'notched-seal';

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      className="w-full h-auto block select-none"
      role="img"
      aria-label={`${brand.companyName} official stamp`}
    >
      <defs>
        <filter id={distressFilterId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.09"
            numOctaves="3"
            seed="14"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 9 -3.6"
            result="inkMask"
          />
          <feComposite in="displaced" in2="inkMask" operator="in" />
        </filter>

        {stamp.shape === 'circle' && (
          <>
            <path
              id={topArcId}
              d={`M ${cx - 146}, ${cy} A 146,146 0 1,1 ${cx + 146},${cy}`}
            />
            <path
              id={bottomArcId}
              d={`M ${cx - 160}, ${cy + 6} A 160,160 0 0,0 ${cx + 160},${cy + 6}`}
            />
          </>
        )}

        {stamp.shape === 'oval' && (
          <>
            <path
              id={topArcId}
              d={`M ${cx - 178}, ${cy + 6} A 178,108 0 1,1 ${cx + 178},${cy + 6}`}
            />
            <path
              id={bottomArcId}
              d={`M ${cx - 188}, ${cy + 12} A 188,118 0 0,0 ${cx + 188},${cy + 12}`}
            />
          </>
        )}
      </defs>

      {!transparentBg && <rect width={viewSize} height={viewSize} fill="#FAF8F3" />}

      <g
        transform={`rotate(${stamp.rotation}, ${cx}, ${cy})`}
        filter={stamp.distressedInk ? `url(#${distressFilterId})` : undefined}
        opacity={stamp.distressedInk ? 0.92 : 1}
      >
        {/* CIRCLE STAMP */}
        {stamp.shape === 'circle' && (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={196}
              fill="none"
              stroke={ink}
              strokeWidth={stamp.borderStyle === 'single-heavy' ? 6 : 4.5}
              strokeDasharray={isNotched ? '12 5' : undefined}
            />
            {(isDouble || isNotched) && (
              <circle cx={cx} cy={cy} r={186} fill="none" stroke={ink} strokeWidth="1.5" />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={120}
              fill="none"
              stroke={ink}
              strokeWidth={isDashed ? 2.2 : 2.8}
              strokeDasharray={isDashed ? '6 4' : undefined}
            />
            {isDouble && (
              <circle cx={cx} cy={cy} r={113} fill="none" stroke={ink} strokeWidth="1.2" />
            )}

            {topText && (
              <text
                fill={ink}
                fontFamily={fonts.bodyFamily}
                fontWeight="800"
                fontSize={topText.length > 26 ? '16' : '19.5'}
                letterSpacing="0.16em"
              >
                <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
                  {topText}
                </textPath>
              </text>
            )}

            {bottomText && (
              <text
                fill={ink}
                fontFamily={fonts.bodyFamily}
                fontWeight="700"
                fontSize={bottomText.length > 26 ? '14' : '16'}
                letterSpacing="0.15em"
              >
                <textPath href={`#${bottomArcId}`} startOffset="50%" textAnchor="middle">
                  {bottomText}
                </textPath>
              </text>
            )}

            {stamp.showStars && (
              <g fill={ink} fontSize="18" fontFamily="serif">
                <text x={cx - 153} y={cy + 6} textAnchor="middle">
                  ★
                </text>
                <text x={cx + 153} y={cy + 6} textAnchor="middle">
                  ★
                </text>
              </g>
            )}
          </g>
        )}

        {/* OVAL STAMP */}
        {stamp.shape === 'oval' && (
          <g>
            <ellipse
              cx={cx}
              cy={cy}
              rx={212}
              ry={140}
              fill="none"
              stroke={ink}
              strokeWidth={stamp.borderStyle === 'single-heavy' ? 6 : 4.5}
              strokeDasharray={isNotched ? '12 5' : undefined}
            />
            {(isDouble || isNotched) && (
              <ellipse cx={cx} cy={cy} rx={202} ry={130} fill="none" stroke={ink} strokeWidth="1.4" />
            )}
            <ellipse
              cx={cx}
              cy={cy}
              rx={144}
              ry={82}
              fill="none"
              stroke={ink}
              strokeWidth={isDashed ? 2 : 2.5}
              strokeDasharray={isDashed ? '6 4' : undefined}
            />

            {topText && (
              <text
                fill={ink}
                fontFamily={fonts.bodyFamily}
                fontWeight="800"
                fontSize={topText.length > 24 ? '15.5' : '18'}
                letterSpacing="0.16em"
              >
                <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
                  {topText}
                </textPath>
              </text>
            )}

            {bottomText && (
              <text
                fill={ink}
                fontFamily={fonts.bodyFamily}
                fontWeight="700"
                fontSize={bottomText.length > 24 ? '14' : '16'}
                letterSpacing="0.14em"
              >
                <textPath href={`#${bottomArcId}`} startOffset="50%" textAnchor="middle">
                  {bottomText}
                </textPath>
              </text>
            )}

            {stamp.showStars && (
              <g fill={ink} fontSize="16">
                <text x={cx - 178} y={cy + 5} textAnchor="middle">
                  ★
                </text>
                <text x={cx + 178} y={cy + 5} textAnchor="middle">
                  ★
                </text>
              </g>
            )}
          </g>
        )}

        {/* RECTANGLE STAMP */}
        {stamp.shape === 'rectangle' && (
          <g>
            <rect
              x={38}
              y={114}
              width={404}
              height={252}
              rx={isNotched ? 14 : 4}
              fill="none"
              stroke={ink}
              strokeWidth={stamp.borderStyle === 'single-heavy' ? 6 : 4.5}
              strokeDasharray={isNotched ? '14 5' : undefined}
            />
            {(isDouble || isDashed) && (
              <rect
                x={49}
                y={125}
                width={382}
                height={230}
                rx={2}
                fill="none"
                stroke={ink}
                strokeWidth="1.6"
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            )}

            {topText && (
              <>
                <text
                  x={cx}
                  y={162}
                  textAnchor="middle"
                  fill={ink}
                  fontFamily={fonts.bodyFamily}
                  fontWeight="800"
                  fontSize="16"
                  letterSpacing="0.16em"
                >
                  {topText}
                </text>
                <line x1={68} y1={178} x2={412} y2={178} stroke={ink} strokeWidth="1.8" />
              </>
            )}

            {bottomText && (
              <>
                <line x1={68} y1={304} x2={412} y2={304} stroke={ink} strokeWidth="1.8" />
                <text
                  x={cx}
                  y={334}
                  textAnchor="middle"
                  fill={ink}
                  fontFamily={fonts.monoFamily}
                  fontWeight="600"
                  fontSize="13.5"
                  letterSpacing="0.14em"
                >
                  {bottomText}
                </text>
              </>
            )}
          </g>
        )}

        {/* SHIELD HERITAGE SEAL */}
        {stamp.shape === 'shield' && (
          <g>
            <path
              d="M68 72 H412 V248 C412 344 240 422 240 422 C240 422 68 344 68 248 V72 Z"
              fill="none"
              stroke={ink}
              strokeWidth={stamp.borderStyle === 'single-heavy' ? 6 : 4.5}
              strokeDasharray={isNotched ? '12 5' : undefined}
            />
            {(isDouble || isDashed) && (
              <path
                d="M82 86 H398 V244 C398 331 240 404 240 404 C240 404 82 331 82 244 V86 Z"
                fill="none"
                stroke={ink}
                strokeWidth="1.6"
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            )}
            {topText && (
              <>
                <text
                  x={cx}
                  y={128}
                  textAnchor="middle"
                  fill={ink}
                  fontFamily={fonts.bodyFamily}
                  fontWeight="800"
                  fontSize={topText.length > 22 ? '14.5' : '16.5'}
                  letterSpacing="0.14em"
                >
                  {topText}
                </text>
                <line x1={96} y1={144} x2={384} y2={144} stroke={ink} strokeWidth="1.8" />
              </>
            )}
            {bottomText && (
              <text
                x={cx}
                y={340}
                textAnchor="middle"
                fill={ink}
                fontFamily={fonts.monoFamily}
                fontWeight="700"
                fontSize="11.5"
                letterSpacing="0.12em"
              >
                {bottomText}
              </text>
            )}
          </g>
        )}

        {/* CENTER CONTENT (Adjusts vertical centering cleanly when subLabel/centerLabel hidden) */}
        {stamp.centerMode === 'emblem' && (
          <g>
            <LogoEmblemSvg
              emblemId={logo.emblemId}
              useMonogram={logo.useMonogramEmblem}
              monogram={brand.monogram}
              primaryColor={ink}
              accentColor={ink}
              strokeWidth={2.3}
              rounded={logo.roundedCorners}
              fontFamily={fonts.displayFamily}
              x={cx - 42}
              y={subLabel ? cy - 54 : cy - 42}
              size={84}
            />
            {subLabel && (
              <text
                x={cx}
                y={cy + 56}
                textAnchor="middle"
                fill={ink}
                fontFamily={fonts.monoFamily}
                fontWeight="600"
                fontSize="12"
                letterSpacing="0.18em"
              >
                {subLabel}
              </text>
            )}
          </g>
        )}

        {stamp.centerMode === 'monogram' && (
          <g>
            <text
              x={cx}
              y={subLabel ? cy + 14 : cy + 22}
              textAnchor="middle"
              fill={ink}
              fontFamily={fonts.displayFamily}
              fontWeight="700"
              fontSize="66"
              letterSpacing="0.08em"
            >
              {(brand.monogram || 'PM').slice(0, 3).toUpperCase()}
            </text>
            {subLabel && (
              <>
                <line x1={cx - 58} y1={cy + 30} x2={cx + 58} y2={cy + 30} stroke={ink} strokeWidth="1.5" />
                <text
                  x={cx}
                  y={cy + 50}
                  textAnchor="middle"
                  fill={ink}
                  fontFamily={fonts.monoFamily}
                  fontWeight="600"
                  fontSize="11.5"
                  letterSpacing="0.18em"
                >
                  {subLabel}
                </text>
              </>
            )}
          </g>
        )}

        {stamp.centerMode === 'status' && (
          <g>
            {centerLabel && (
              <>
                <rect
                  x={cx - 94}
                  y={subLabel ? cy - 26 : cy - 23}
                  width={188}
                  height={46}
                  fill="none"
                  stroke={ink}
                  strokeWidth="2.5"
                />
                <text
                  x={cx}
                  y={subLabel ? cy + 7 : cy + 10}
                  textAnchor="middle"
                  fill={ink}
                  fontFamily={fonts.bodyFamily}
                  fontWeight="700"
                  fontSize={centerLabel.length > 10 ? '20' : '25'}
                  letterSpacing="0.18em"
                >
                  {centerLabel}
                </text>
              </>
            )}
            {subLabel && (
              <text
                x={cx}
                y={centerLabel ? cy + 44 : cy + 5}
                textAnchor="middle"
                fill={ink}
                fontFamily={fonts.monoFamily}
                fontWeight="600"
                fontSize="12"
                letterSpacing="0.15em"
              >
                {subLabel}
              </text>
            )}
          </g>
        )}

        {stamp.centerMode === 'date-line' && (
          <g>
            {centerLabel && (
              <text
                x={cx}
                y={subLabel ? cy - 18 : cy - 8}
                textAnchor="middle"
                fill={ink}
                fontFamily={fonts.bodyFamily}
                fontWeight="700"
                fontSize="24"
                letterSpacing="0.2em"
              >
                {centerLabel}
              </text>
            )}
            <line
              x1={cx - 90}
              y1={centerLabel && subLabel ? cy + 14 : centerLabel ? cy + 18 : cy}
              x2={cx + 90}
              y2={centerLabel && subLabel ? cy + 14 : centerLabel ? cy + 18 : cy}
              stroke={ink}
              strokeWidth="1.8"
            />
            {subLabel && (
              <text
                x={cx}
                y={centerLabel ? cy + 38 : cy + 26}
                textAnchor="middle"
                fill={ink}
                fontFamily={fonts.monoFamily}
                fontWeight="600"
                fontSize="13"
                letterSpacing="0.12em"
              >
                {subLabel}
              </text>
            )}
          </g>
        )}
      </g>
    </svg>
  );
};
