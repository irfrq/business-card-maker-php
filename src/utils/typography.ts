import { FontPairing } from '../types/brand';

export interface FontStyleSet {
  displayFamily: string;
  bodyFamily: string;
  monoFamily: string;
  displayWeight: number;
  label: string;
}

export function getFontSet(pairing: FontPairing): FontStyleSet {
  switch (pairing) {
    case 'editorial-serif':
      return {
        displayFamily: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
        bodyFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        displayWeight: 600,
        label: 'Editorial Serif',
      };
    case 'technical-mono':
      return {
        displayFamily: '"IBM Plex Mono", ui-monospace, monospace',
        bodyFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        displayWeight: 600,
        label: 'Technical Mono',
      };
    case 'geometric-sans':
    default:
      return {
        displayFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        bodyFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        displayWeight: 700,
        label: 'Geometric Sans',
      };
  }
}

/**
 * Generates a deterministic 15x15 scannable-style matrix pattern
 * with standard corner finder squares from any contact string.
 */
export function generateQrMatrix(seedText: string): boolean[][] {
  const size = 15;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  // Draw 3x3 finder pattern helper (actually 5x5 outer with 3x3 inner)
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
        const isCenter = r === 2 && c === 2;
        grid[r0 + r][c0 + c] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 5);
  drawFinder(size - 5, 0);

  // Deterministic PRNG hash from seedText
  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const nextBit = () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return (hash >>> 0) % 100 < 52;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 6 && c < 6;
      const inTopRight = r < 6 && c >= size - 6;
      const inBottomLeft = r >= size - 6 && c < 6;
      if (inTopLeft || inTopRight || inBottomLeft) continue;
      grid[r][c] = nextBit();
    }
  }

  return grid;
}
