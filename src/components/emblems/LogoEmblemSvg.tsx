import React from 'react';
import { EmblemId } from '../../types/brand';

export const EMBLEM_OPTIONS: { id: EmblemId; name: string }[] = [
  { id: 'livestock', name: 'Livestock' },
  { id: 'barn', name: 'Farm Barn' },
  { id: 'wheat', name: 'Pasture' },
  { id: 'arch', name: 'Arch' },
  { id: 'prism', name: 'Prism' },
  { id: 'compass', name: 'Compass' },
  { id: 'crest', name: 'Crest' },
  { id: 'hexgrid', name: 'Hex Grid' },
  { id: 'botanical', name: 'Botanical' },
  { id: 'scales', name: 'Scales' },
  { id: 'pillar', name: 'Pillar' },
  { id: 'orbit', name: 'Orbit' },
  { id: 'shield', name: 'Shield' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'meridian', name: 'Meridian' },
];

interface LogoEmblemSvgProps {
  emblemId: EmblemId;
  useMonogram?: boolean;
  monogram?: string;
  primaryColor: string;
  accentColor: string;
  strokeWidth?: number;
  rounded?: boolean;
  x?: number;
  y?: number;
  size?: number;
  fontFamily?: string;
}

export const LogoEmblemSvg: React.FC<LogoEmblemSvgProps> = ({
  emblemId,
  useMonogram = false,
  monogram = 'PM',
  primaryColor,
  accentColor,
  strokeWidth = 2.2,
  rounded = false,
  x = 0,
  y = 0,
  size = 64,
  fontFamily = '"Cormorant Garamond", Georgia, serif',
}) => {
  const scale = size / 64;
  const lineCap = rounded ? 'round' : 'square';
  const lineJoin = rounded ? 'round' : 'miter';
  const cleanMono = (monogram || 'PM').slice(0, 3).toUpperCase();

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {useMonogram ? (
        <g>
          <rect
            x="6"
            y="6"
            width="52"
            height="52"
            rx={rounded ? 12 : 0}
            fill="none"
            stroke={primaryColor}
            strokeWidth={strokeWidth}
          />
          <rect
            x="11"
            y="11"
            width="42"
            height="42"
            rx={rounded ? 8 : 0}
            fill="none"
            stroke={accentColor}
            strokeWidth={Math.max(1, strokeWidth * 0.55)}
          />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fill={primaryColor}
            fontFamily={fontFamily}
            fontWeight="700"
            fontSize={cleanMono.length > 2 ? '18' : '22'}
            letterSpacing="1.5"
          >
            {cleanMono}
          </text>
        </g>
      ) : (
        <g fill="none" strokeLinecap={lineCap} strokeLinejoin={lineJoin}>
          {emblemId === 'livestock' && (
            <>
              {/* Outer agricultural crest ring */}
              <circle
                cx="32"
                cy="32"
                r="25"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 1.05}
              />
              {/* Pastoral ground arc */}
              <path
                d="M11 42C18 39 25 38 32 38C39 38 46 39 53 42"
                stroke={accentColor}
                strokeWidth={strokeWidth * 0.85}
              />
              {/* Heraldic Cattle / Bull Head & Horns silhouette */}
              <path
                d="M16 17C16 22 20 24 23 24L22 33C22 37 26 40 32 40C38 40 42 37 42 33L41 24C44 24 48 22 48 17C46 19.5 43 20.5 39 20.5L32 21.5L25 20.5C21 20.5 18 19.5 16 17Z"
                fill={primaryColor}
                fillOpacity="0.12"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 0.95}
              />
              {/* Ears */}
              <path d="M22 24L17 26" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M42 24L47 26" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
              {/* Wheat / Pasture accents below */}
              <path d="M23 48L32 45L41 48" stroke={accentColor} strokeWidth={strokeWidth * 0.8} />
            </>
          )}

          {emblemId === 'barn' && (
            <>
              <path
                d="M10 52V30L20 18L32 10L44 18L54 30V52H10Z"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 1.1}
              />
              <rect
                x="23"
                y="34"
                width="18"
                height="18"
                stroke={accentColor}
                strokeWidth={strokeWidth * 0.95}
              />
              <line x1="23" y1="34" x2="41" y2="52" stroke={accentColor} strokeWidth={strokeWidth * 0.7} />
              <line x1="41" y1="34" x2="23" y2="52" stroke={accentColor} strokeWidth={strokeWidth * 0.7} />
              <circle cx="32" cy="23" r="3.5" stroke={primaryColor} strokeWidth={strokeWidth * 0.8} />
            </>
          )}

          {emblemId === 'wheat' && (
            <>
              <circle cx="32" cy="32" r="24" stroke={primaryColor} strokeWidth={strokeWidth} />
              <line x1="32" y1="12" x2="32" y2="52" stroke={accentColor} strokeWidth={strokeWidth} />
              <path d="M32 22C25 22 22 17 22 14C26 14 31 17 32 22Z" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M32 22C39 22 42 17 42 14C38 14 33 17 32 22Z" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M32 32C24 32 20 27 20 23C25 23 31 26 32 32Z" stroke={accentColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M32 32C40 32 44 27 44 23C39 23 33 26 32 32Z" stroke={accentColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M32 42C25 42 21 37 21 33C26 33 31 36 32 42Z" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M32 42C39 42 43 37 43 33C38 33 33 36 32 42Z" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
            </>
          )}

          {emblemId === 'arch' && (
            <>
              <path
                d="M12 54V28C12 16.954 20.954 8 32 8C43.046 8 52 16.954 52 28V54"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 1.15}
              />
              <path
                d="M21 54V30C21 23.925 25.925 19 32 19C38.075 19 43 23.925 43 30V54"
                stroke={accentColor}
                strokeWidth={strokeWidth}
              />
              <line x1="8" y1="54" x2="56" y2="54" stroke={primaryColor} strokeWidth={strokeWidth} />
              <line x1="32" y1="19" x2="32" y2="54" stroke={primaryColor} strokeWidth={strokeWidth * 0.8} />
            </>
          )}

          {emblemId === 'prism' && (
            <>
              <polygon
                points="32,7 56,50 8,50"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 1.1}
              />
              <polygon
                points="32,20 45,45 19,45"
                stroke={accentColor}
                strokeWidth={strokeWidth * 0.9}
              />
              <line x1="32" y1="7" x2="32" y2="45" stroke={primaryColor} strokeWidth={strokeWidth * 0.8} />
              <line x1="32" y1="35" x2="56" y2="50" stroke={accentColor} strokeWidth={strokeWidth * 0.8} />
            </>
          )}

          {emblemId === 'compass' && (
            <>
              <circle cx="32" cy="32" r="24" stroke={primaryColor} strokeWidth={strokeWidth} />
              <circle
                cx="32"
                cy="32"
                r="18"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 0.5}
                strokeDasharray="3 3"
              />
              <polygon
                points="32,12 37,32 32,52 27,32"
                stroke={accentColor}
                strokeWidth={strokeWidth}
                fill={accentColor}
                fillOpacity="0.14"
              />
              <circle cx="32" cy="32" r="3" fill={primaryColor} stroke="none" />
            </>
          )}

          {emblemId === 'crest' && (
            <>
              <circle cx="32" cy="32" r="24" stroke={primaryColor} strokeWidth={strokeWidth * 1.1} />
              <path
                d="M18 22L32 14L46 22V36C46 44 32 51 32 51C32 51 18 44 18 36V22Z"
                stroke={accentColor}
                strokeWidth={strokeWidth}
              />
              <line x1="32" y1="14" x2="32" y2="51" stroke={primaryColor} strokeWidth={strokeWidth * 0.75} />
              <line x1="18" y1="30" x2="46" y2="30" stroke={primaryColor} strokeWidth={strokeWidth * 0.75} />
            </>
          )}

          {emblemId === 'hexgrid' && (
            <>
              <polygon
                points="32,6 54,19 54,45 32,58 10,45 10,19"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 1.1}
              />
              <polygon
                points="32,16 45,23.5 45,40.5 32,48 19,40.5 19,23.5"
                stroke={accentColor}
                strokeWidth={strokeWidth * 0.9}
              />
              <line x1="32" y1="6" x2="32" y2="16" stroke={primaryColor} strokeWidth={strokeWidth * 0.8} />
              <line x1="54" y1="45" x2="45" y2="40.5" stroke={primaryColor} strokeWidth={strokeWidth * 0.8} />
              <line x1="10" y1="45" x2="19" y2="40.5" stroke={primaryColor} strokeWidth={strokeWidth * 0.8} />
            </>
          )}

          {emblemId === 'botanical' && (
            <>
              <path
                d="M32 54C32 54 14 42 14 25C14 14 23 8 32 8C41 8 50 14 50 25C50 42 32 54 32 54Z"
                stroke={primaryColor}
                strokeWidth={strokeWidth}
              />
              <line x1="32" y1="10" x2="32" y2="56" stroke={accentColor} strokeWidth={strokeWidth} />
              <path d="M32 24L43 17" stroke={accentColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M32 34L45 26" stroke={accentColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M32 24L21 17" stroke={accentColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M32 34L19 26" stroke={accentColor} strokeWidth={strokeWidth * 0.85} />
            </>
          )}

          {emblemId === 'scales' && (
            <>
              <line x1="32" y1="10" x2="32" y2="52" stroke={primaryColor} strokeWidth={strokeWidth * 1.1} />
              <line x1="18" y1="52" x2="46" y2="52" stroke={primaryColor} strokeWidth={strokeWidth * 1.1} />
              <line x1="12" y1="18" x2="52" y2="18" stroke={accentColor} strokeWidth={strokeWidth} />
              <path d="M12 18L7 32H17L12 18Z" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M7 32C7 36 17 36 17 32" stroke={accentColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M52 18L47 32H57L52 18Z" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
              <path d="M47 32C47 36 57 36 57 32" stroke={accentColor} strokeWidth={strokeWidth * 0.85} />
            </>
          )}

          {emblemId === 'pillar' && (
            <>
              <line x1="12" y1="12" x2="52" y2="12" stroke={primaryColor} strokeWidth={strokeWidth * 1.2} />
              <line x1="16" y1="18" x2="48" y2="18" stroke={accentColor} strokeWidth={strokeWidth * 0.9} />
              <line x1="22" y1="18" x2="22" y2="48" stroke={primaryColor} strokeWidth={strokeWidth} />
              <line x1="32" y1="18" x2="32" y2="48" stroke={accentColor} strokeWidth={strokeWidth} />
              <line x1="42" y1="18" x2="42" y2="48" stroke={primaryColor} strokeWidth={strokeWidth} />
              <line x1="14" y1="48" x2="50" y2="48" stroke={primaryColor} strokeWidth={strokeWidth} />
              <line x1="10" y1="54" x2="54" y2="54" stroke={primaryColor} strokeWidth={strokeWidth * 1.2} />
            </>
          )}

          {emblemId === 'orbit' && (
            <>
              <circle cx="32" cy="32" r="8" stroke={accentColor} strokeWidth={strokeWidth * 1.1} />
              <ellipse
                cx="32"
                cy="32"
                rx="25"
                ry="11"
                transform="rotate(-28 32 32)"
                stroke={primaryColor}
                strokeWidth={strokeWidth}
              />
              <ellipse
                cx="32"
                cy="32"
                rx="25"
                ry="11"
                transform="rotate(28 32 32)"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 0.85}
              />
              <circle cx="51" cy="21" r="2.5" fill={accentColor} stroke="none" />
            </>
          )}

          {emblemId === 'shield' && (
            <>
              <path
                d="M13 14H51V31C51 44 32 55 32 55C32 55 13 44 13 31V14Z"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 1.1}
              />
              <path
                d="M20 21H44V31C44 39.5 32 47 32 47C32 47 20 39.5 20 31V21Z"
                stroke={accentColor}
                strokeWidth={strokeWidth * 0.85}
              />
              <polyline points="25,31 30,36 39,26" stroke={primaryColor} strokeWidth={strokeWidth} />
            </>
          )}

          {emblemId === 'diamond' && (
            <>
              <polygon
                points="32,7 57,32 32,57 7,32"
                stroke={primaryColor}
                strokeWidth={strokeWidth * 1.1}
              />
              <polygon
                points="32,17 47,32 32,47 17,32"
                stroke={accentColor}
                strokeWidth={strokeWidth * 0.9}
              />
              <rect x="27" y="27" width="10" height="10" fill={accentColor} stroke="none" />
            </>
          )}

          {emblemId === 'meridian' && (
            <>
              <circle cx="32" cy="32" r="23" stroke={primaryColor} strokeWidth={strokeWidth * 1.1} />
              <ellipse cx="32" cy="32" rx="11" ry="23" stroke={accentColor} strokeWidth={strokeWidth * 0.9} />
              <line x1="9" y1="32" x2="55" y2="32" stroke={primaryColor} strokeWidth={strokeWidth * 0.85} />
              <line x1="13" y1="20" x2="51" y2="20" stroke={primaryColor} strokeWidth={strokeWidth * 0.65} />
              <line x1="13" y1="44" x2="51" y2="44" stroke={primaryColor} strokeWidth={strokeWidth * 0.65} />
            </>
          )}
        </g>
      )}
    </g>
  );
};
