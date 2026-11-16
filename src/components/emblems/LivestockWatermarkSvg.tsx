import React from 'react';

interface LivestockWatermarkSvgProps {
  x?: number;
  y?: number;
  width?: number;
  color: string;
  opacity?: number;
}

/**
 * Clean pastoral livestock herd & cattle silhouette artwork designed
 * for low-opacity watermarks on letterheads and visiting cards.
 */
export const LivestockWatermarkSvg: React.FC<LivestockWatermarkSvgProps> = ({
  x = 0,
  y = 0,
  width = 520,
  color,
  opacity = 0.06,
}) => {
  const scale = width / 520;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity} fill={color}>
      {/* Rolling pastoral horizon line */}
      <path
        d="M0 158 Q 130 144 260 156 T 520 152 L 520 166 L 0 166 Z"
        fillOpacity="0.45"
      />

      {/* Standing Bull / Dairy Cow silhouette (Left-Center) */}
      <path d="M132 154 L132 126 L124 128 L120 118 L126 104 L118 98 L121 94 L129 98 L136 90 L144 92 L152 86 L160 88 L156 96 L186 96 C206 96 222 92 238 96 L248 102 L252 132 L248 154 L241 154 L242 132 L233 132 L231 154 L224 154 L225 128 C210 132 186 132 170 128 L166 154 L159 154 L160 128 L148 128 L145 154 L138 154 L140 128 L132 154 Z" />

      {/* Grazing Cow silhouette (Right) */}
      <path d="M294 154 L297 132 L284 142 L276 146 L273 141 L282 128 L292 114 C304 102 324 100 344 102 L366 104 L374 114 L376 136 L372 154 L365 154 L366 134 L356 134 L353 154 L346 154 L348 130 C334 133 316 132 308 130 L304 154 L294 154 Z" />

      {/* Smaller Calf / Livestock silhouette (Far Right) */}
      <path d="M402 154 L404 134 L396 132 L392 122 L399 114 L406 116 L414 118 L438 118 L446 124 L448 140 L445 154 L440 154 L440 138 L433 138 L431 154 L426 154 L427 136 L412 136 L410 154 L402 154 Z" />

      {/* Subtle distant farm barn & trees silhouette (Far Left) */}
      <path
        d="M28 154 L28 126 L46 112 L64 126 L64 154 Z M42 154 L42 138 L50 138 L50 154 Z"
        fillOpacity="0.65"
      />
      <circle cx="84" cy="130" r="11" fillOpacity="0.55" />
      <rect x="82.5" y="138" width="3" height="16" fillOpacity="0.55" />
    </g>
  );
};
