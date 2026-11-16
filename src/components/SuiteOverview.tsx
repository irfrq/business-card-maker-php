import React from 'react';
import { ArrowUpRight, CheckCircle2, Code2, Download, FileText } from 'lucide-react';
import { StudioState, WorkspaceTab } from '../types/brand';
import { LogoArtboard } from './artifacts/LogoArtboard';
import { StampArtboard } from './artifacts/StampArtboard';
import { VisitingCardFaceSvg } from './artifacts/VisitingCardArtboard';
import { LetterheadArtboard } from './artifacts/LetterheadArtboard';

export type ExportArtifactType = 'logo' | 'stamp' | 'card' | 'card-front' | 'card-back' | 'letterhead';
export type ExportFileFormat = 'pdf' | 'docx' | 'svg' | 'png';

interface SuiteOverviewProps {
  state: StudioState;
  isExporting: boolean;
  onToggleApprove: () => void;
  onSelectTab: (tab: WorkspaceTab) => void;
  logoSvgRef: React.RefObject<SVGSVGElement | null>;
  stampSvgRef: React.RefObject<SVGSVGElement | null>;
  cardFrontSvgRef: React.RefObject<SVGSVGElement | null>;
  cardBackSvgRef: React.RefObject<SVGSVGElement | null>;
  letterheadSvgRef: React.RefObject<SVGSVGElement | null>;
  onDownloadAsset: (type: ExportArtifactType, format: ExportFileFormat) => void;
  onDownloadAllPdfs: () => void;
  onDownloadAllDocx: () => void;
  onDownloadPhpApp: () => void;
}

export const SuiteOverview: React.FC<SuiteOverviewProps> = ({
  state,
  isExporting,
  onToggleApprove,
  onSelectTab,
  logoSvgRef,
  stampSvgRef,
  cardFrontSvgRef,
  cardBackSvgRef,
  letterheadSvgRef,
  onDownloadAsset,
  onDownloadAllPdfs,
  onDownloadAllDocx,
  onDownloadPhpApp,
}) => {
  const cardDim = state.card.standard === 'iso' ? '85 × 55 mm' : '3.5 × 2.0 in';
  const letterDim = state.letterhead.paperSize === 'a4' ? 'A4 · 210 × 297 mm' : 'Letter · 8.5 × 11 in';

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Suite Header & Step 1: Approve -> Step 2: Export Separate PDFs, MS Word & PHP App */}
      <div className="border-b border-slate-200 pb-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-studio-mono text-slate-500 tracking-wide">
              {state.brand.companyName} · {state.brand.addressLine1}, {state.brand.cityState}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#111318] mt-1">
              Print-Ready Stationery & Brand Proofs
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs font-studio-mono text-slate-500">
            <span>{state.brand.personName} ({state.brand.phone})</span>
            {state.brand.secondaryPhone && (
              <>
                <span aria-hidden="true">·</span>
                <span>{state.brand.secondaryPersonName} ({state.brand.secondaryPhone})</span>
              </>
            )}
          </div>
        </div>

        {/* Clean Approval & Batch Export Ribbon */}
        <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#111318]">
              {state.approved
                ? 'Designs Approved — Separate Print-Ready PDFs & Editable Word Files Ready'
                : 'Step 1: Review proofs, toggle any text On/Off or Color Theme, then Approve'}
            </div>
            <p className="text-xs text-slate-500">
              {state.approved
                ? 'Download separate PDFs, editable MS Word (.docx) files, or the standalone PHP 8 web app (index.php).'
                : 'Approving unlocks one-click generation of all 4 separate PDFs and editable MS Word (.docx) templates.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={onDownloadPhpApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111318] bg-slate-50 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Download standalone single-file PHP 8 application (index.php)"
            >
              <Code2 className="w-3.5 h-3.5" />
              Download PHP App
            </button>

            <button
              type="button"
              onClick={onToggleApprove}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                state.approved
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-[#1E40AF] bg-[#1E40AF] text-white hover:bg-[#1E3A8A]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {state.approved ? 'Design Approved' : 'Approve Designs'}
            </button>

            {state.approved && (
              <>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={onDownloadAllPdfs}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#111318] rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download 4 Separate PDFs
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={onDownloadAllDocx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111318] bg-white border border-slate-300 rounded-md hover:border-slate-400 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Download 4 Word (.docx)
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main 12-column Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Primary Logo Lockup */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-sm font-semibold text-[#111318]">01. Logo</h2>
                <span className="text-xs font-studio-mono text-slate-500">
                  {state.logo.lockup} · Vector SVG
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  disabled={!state.approved || isExporting}
                  onClick={() => onDownloadAsset('logo', 'pdf')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111318] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  type="button"
                  disabled={!state.approved || isExporting}
                  onClick={() => onDownloadAsset('logo', 'docx')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111318] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Word
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadAsset('logo', 'svg')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#111318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  SVG
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadAsset('logo', 'png')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#111318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  PNG
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('logo')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Edit
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div
              onClick={() => onSelectTab('logo')}
              className="border border-slate-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:border-slate-300 transition-colors"
            >
              <LogoArtboard
                brand={state.brand}
                logo={state.logo}
                visibility={state.visibility}
                svgRef={logoSvgRef}
                compact
              />
            </div>
          </section>

          {/* 2. Visiting Cards (Front & Back) */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-sm font-semibold text-[#111318]">02. Visiting Card</h2>
                <span className="text-xs font-studio-mono text-slate-500">
                  {cardDim} · {state.card.layout}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  disabled={!state.approved || isExporting}
                  onClick={() => onDownloadAsset('card', 'pdf')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111318] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF (2-Page)
                </button>
                <button
                  type="button"
                  disabled={!state.approved || isExporting}
                  onClick={() => onDownloadAsset('card', 'docx')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111318] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Word
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadAsset('card-front', 'png')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#111318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Front PNG
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadAsset('card-back', 'png')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#111318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Back PNG
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('card')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Edit
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => onSelectTab('card')}
                className="border border-slate-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:border-slate-300 transition-colors"
              >
                <VisitingCardFaceSvg
                  brand={state.brand}
                  logo={state.logo}
                  card={state.card}
                  visibility={state.visibility}
                  side="front"
                  svgRef={cardFrontSvgRef}
                />
              </div>
              <div
                onClick={() => onSelectTab('card')}
                className="border border-slate-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:border-slate-300 transition-colors"
              >
                <VisitingCardFaceSvg
                  brand={state.brand}
                  logo={state.logo}
                  card={state.card}
                  visibility={state.visibility}
                  side="back"
                  svgRef={cardBackSvgRef}
                />
              </div>
            </div>
          </section>

          {/* 3. Official Rubber Stamp */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-sm font-semibold text-[#111318]">03. Stamp Design</h2>
                <span className="text-xs font-studio-mono text-slate-500">
                  {state.stamp.shape} · {state.stamp.inkColor.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  disabled={!state.approved || isExporting}
                  onClick={() => onDownloadAsset('stamp', 'pdf')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111318] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  type="button"
                  disabled={!state.approved || isExporting}
                  onClick={() => onDownloadAsset('stamp', 'docx')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111318] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Word
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadAsset('stamp', 'svg')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#111318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  SVG
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadAsset('stamp', 'png')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#111318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  PNG
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('stamp')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Edit
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border border-slate-200 bg-[#FAF8F3] p-6 shadow-sm">
              <div
                onClick={() => onSelectTab('stamp')}
                className="max-w-[230px] mx-auto w-full cursor-pointer"
              >
                <StampArtboard
                  brand={state.brand}
                  logo={state.logo}
                  stamp={state.stamp}
                  visibility={state.visibility}
                  svgRef={stampSvgRef}
                  transparentBg
                />
              </div>
              <div className="space-y-2.5 text-xs text-slate-600">
                <p className="font-semibold text-sm text-[#111318]">
                  Bold Business Seal (No Owner Name)
                </p>
                <p className="leading-relaxed">
                  Engraver-ready vector seal featuring bold business lettering and location ring. Exports with transparent background for digital documents or PDF for rubber stamp makers.
                </p>
                <div className="pt-1 font-studio-mono text-[11px] text-slate-500 space-y-1">
                  <div>Top Arc: {state.visibility.stampTopArc ? state.stamp.topArcText : '(Hidden)'}</div>
                  <div>Bottom Arc: {state.visibility.stampBottomArc ? state.stamp.bottomArcText : '(Hidden)'}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (5 cols): Full Letterhead Sheet */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-3">
              <h2 className="text-sm font-semibold text-[#111318]">04. Letterhead</h2>
              <span className="text-xs font-studio-mono text-slate-500">{letterDim}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                disabled={!state.approved || isExporting}
                onClick={() => onDownloadAsset('letterhead', 'pdf')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#111318] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                PDF
              </button>
              <button
                type="button"
                disabled={!state.approved || isExporting}
                onClick={() => onDownloadAsset('letterhead', 'docx')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#111318] hover:text-[#1E40AF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Word
              </button>
              <button
                type="button"
                onClick={() => onDownloadAsset('letterhead', 'svg')}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#111318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                SVG
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('letterhead')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Edit
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div
            onClick={() => onSelectTab('letterhead')}
            className="border border-slate-200 bg-white shadow-md overflow-hidden cursor-pointer hover:border-slate-300 transition-colors"
          >
            <LetterheadArtboard
              brand={state.brand}
              logo={state.logo}
              stamp={state.stamp}
              letterhead={state.letterhead}
              visibility={state.visibility}
              svgRef={letterheadSvgRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
