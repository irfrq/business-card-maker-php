export type WorkspaceTab = 'suite' | 'logo' | 'stamp' | 'card' | 'letterhead';

export type EmblemId =
  | 'livestock'
  | 'barn'
  | 'wheat'
  | 'arch'
  | 'prism'
  | 'compass'
  | 'crest'
  | 'hexgrid'
  | 'botanical'
  | 'scales'
  | 'pillar'
  | 'orbit'
  | 'shield'
  | 'diamond'
  | 'meridian';

export type FontPairing = 'editorial-serif' | 'geometric-sans' | 'technical-mono';

export type LogoLockup = 'horizontal' | 'stacked' | 'emblem' | 'wordmark' | 'badge';
export type LogoSurface = 'white' | 'alabaster' | 'obsidian' | 'cobalt';

export type StampShape = 'circle' | 'oval' | 'rectangle' | 'shield';
export type StampBorderStyle = 'double-solid' | 'dashed-inner' | 'notched-seal' | 'single-heavy';
export type StampCenterMode = 'emblem' | 'monogram' | 'status' | 'date-line';

export type CardStandard = 'us' | 'iso';
export type CardLayout =
  | 'swiss-grid'
  | 'executive-minimal'
  | 'editorial-split'
  | 'monogram-crest'
  | 'architectural-frame'
  | 'diagonal-ribbon'
  | 'pastoral-horizon';
export type PaperStock = 'white' | 'cotton-ivory' | 'obsidian' | 'slate-navy' | 'warm-kraft';

export type LetterheadSize = 'a4' | 'letter';
export type LetterheadLayout =
  | 'classic-executive'
  | 'left-rail'
  | 'minimal-rule'
  | 'institutional-crest'
  | 'modern-asymmetric'
  | 'double-ledger'
  | 'pastoral-band';

export interface ColorTheme {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  stampInkColor: string;
  recommendedStock: PaperStock;
}

export interface TextVisibility {
  companyName: boolean;
  tagline: boolean;
  establishedYear: boolean;
  registrationNo: boolean;
  personName: boolean;
  personTitle: boolean;
  phone: boolean;
  secondaryPersonName: boolean;
  secondaryPersonTitle: boolean;
  secondaryPhone: boolean;
  email: boolean;
  website: boolean;
  address: boolean;
  stampTopArc: boolean;
  stampBottomArc: boolean;
  stampCenterLabel: boolean;
  stampSubLabel: boolean;
  letterDate: boolean;
  letterRef: boolean;
  letterRecipient: boolean;
  letterSubject: boolean;
  letterBody: boolean;
  letterSignature: boolean;
}

export interface BrandIdentity {
  companyName: string;
  monogram: string;
  tagline: string;
  establishedYear: string;
  registrationNo: string;
  personName: string;
  personTitle: string;
  phone: string;
  secondaryPersonName: string;
  secondaryPersonTitle: string;
  secondaryPhone: string;
  email: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  cityState: string;
  themeId: string;
  primaryColor: string;
  accentColor: string;
  fontPairing: FontPairing;
}

export interface LogoConfig {
  emblemId: EmblemId;
  useMonogramEmblem: boolean;
  lockup: LogoLockup;
  surface: LogoSurface;
  strokeWeight: number;
  roundedCorners: boolean;
  letterSpacing: number;
  showTagline: boolean;
}

export interface StampConfig {
  shape: StampShape;
  borderStyle: StampBorderStyle;
  centerMode: StampCenterMode;
  topArcText: string;
  bottomArcText: string;
  centerLabel: string;
  subLabel: string;
  inkColor: string;
  distressedInk: boolean;
  rotation: number;
  showStars: boolean;
}

export interface VisitingCardConfig {
  standard: CardStandard;
  layout: CardLayout;
  paperStock: PaperStock;
  showBleedMarks: boolean;
  showQrMatrix: boolean;
  showLivestockWatermark: boolean;
  backStyle: 'emblem-centered' | 'solid-accent' | 'minimal-wordmark';
  activeSide: 'both' | 'front' | 'back';
}

export interface LetterheadConfig {
  paperSize: LetterheadSize;
  layout: LetterheadLayout;
  paperStock: 'white' | 'cotton-ivory';
  showWatermark: boolean;
  showLivestockBackdrop: boolean;
  watermarkOpacity: number;
  showStampOverlay: boolean;
  showHeader: boolean;
  headerShowLogo: boolean;
  headerShowCompany: boolean;
  headerShowTagline: boolean;
  headerShowPrimaryContact: boolean;
  headerShowSecondaryContact: boolean;
  headerShowAddress: boolean;
  headerShowDigital: boolean;
  showFooterRule: boolean;
  footerShowCompany: boolean;
  footerShowAddress: boolean;
  footerShowPrimaryContact: boolean;
  footerShowSecondaryContact: boolean;
  footerShowDigital: boolean;
  showSampleContent: boolean;
  dateText: string;
  refNumber: string;
  recipientName: string;
  recipientAddress: string;
  subjectLine: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  closingText: string;
}

export interface StudioState {
  activePresetId: string;
  approved: boolean;
  visibility: TextVisibility;
  brand: BrandIdentity;
  logo: LogoConfig;
  stamp: StampConfig;
  card: VisitingCardConfig;
  letterhead: LetterheadConfig;
}

export interface BrandPreset {
  id: string;
  label: string;
  industry: string;
  brand: BrandIdentity;
  logo: LogoConfig;
  stamp: StampConfig;
  card: VisitingCardConfig;
  letterhead: LetterheadConfig;
}
