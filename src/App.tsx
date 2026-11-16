import React, { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, Download, FileText, ZoomIn, ZoomOut } from 'lucide-react';
import phpAppSource from '../php-app/index.php?raw';
import {
  BRAND_PRESETS,
  DEFAULT_LETTERHEAD_ZONES,
  DEFAULT_TEXT_VISIBILITY,
  INITIAL_STUDIO_STATE,
} from './data/presets';
import {
  BrandIdentity,
  ColorTheme,
  LetterheadConfig,
  LogoConfig,
  StampConfig,
  StudioState,
  TextVisibility,
  VisitingCardConfig,
  WorkspaceTab,
} from './types/brand';
import {
  downloadLetterheadDocx,
  downloadLetterheadPdf,
  downloadLogoDocx,
  downloadLogoPdf,
  downloadStampDocx,
  downloadStampPdf,
  downloadSvgAsPng,
  downloadSvgElement,
  downloadVisitingCardDocx,
  downloadVisitingCardPdf,
  slugifyFilename,
} from './utils/exportAsset';
import { InspectorPanel } from './components/InspectorPanel';
import { ExportArtifactType, ExportFileFormat, SuiteOverview } from './components/SuiteOverview';
import { LogoArtboard } from './components/artifacts/LogoArtboard';
import { StampArtboard } from './components/artifacts/StampArtboard';
import { VisitingCardFaceSvg } from './components/artifacts/VisitingCardArtboard';
import { LetterheadArtboard } from './components/artifacts/LetterheadArtboard';

const STORAGE_KEY = 'pressmark_studio_state_v3';

const NAV_TABS: { id: WorkspaceTab; label: string }[] = [
  { id: 'suite', label: 'Brand Suite' },
  { id: 'logo', label: 'Logo' },
  { id: 'stamp', label: 'Stamp' },
  { id: 'card', label: 'Visiting Card' },
  { id: 'letterhead', label: 'Letterhead' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('suite');
  const [zoom, setZoom] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [state, setState] = useState<StudioState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<StudioState>;
        if (parsed.brand && parsed.logo && parsed.stamp && parsed.card && parsed.letterhead) {
          return {
            ...INITIAL_STUDIO_STATE,
            ...parsed,
            visibility: { ...DEFAULT_TEXT_VISIBILITY, ...(parsed.visibility || {}) },
            brand: { ...INITIAL_STUDIO_STATE.brand, ...parsed.brand },
            card: { ...INITIAL_STUDIO_STATE.card, ...parsed.card },
            letterhead: {
              ...INITIAL_STUDIO_STATE.letterhead,
              ...DEFAULT_LETTERHEAD_ZONES,
              ...parsed.letterhead,
            },
          } as StudioState;
        }
      }
    } catch {
      // Fall back to initial state
    }
    return INITIAL_STUDIO_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [state]);

  const logoSvgRef = useRef<SVGSVGElement | null>(null);
  const stampSvgRef = useRef<SVGSVGElement | null>(null);
  const cardFrontSvgRef = useRef<SVGSVGElement | null>(null);
  const cardBackSvgRef = useRef<SVGSVGElement | null>(null);
  const letterheadSvgRef = useRef<SVGSVGElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const handleApplyPreset = (presetId: string) => {
    const found = BRAND_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setState({
      activePresetId: found.id,
      approved: false,
      visibility: { ...DEFAULT_TEXT_VISIBILITY },
      brand: { ...found.brand },
      logo: { ...found.logo },
      stamp: { ...found.stamp },
      card: { ...found.card },
      letterhead: { ...found.letterhead },
    });
    showToast(`Loaded ${found.label} brand preset`);
  };

  const handleApplyTheme = (theme: ColorTheme) => {
    setState((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        themeId: theme.id,
        primaryColor: theme.primaryColor,
        accentColor: theme.accentColor,
      },
      stamp: {
        ...prev.stamp,
        inkColor: theme.stampInkColor,
      },
      card: {
        ...prev.card,
        paperStock: theme.recommendedStock,
      },
    }));
    showToast(`Applied ${theme.name} color theme`);
  };

  const handleToggleVisibility = (key: keyof TextVisibility) => {
    setState((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: !prev.visibility[key],
      },
    }));
  };

  const handleSetAllVisibility = (visible: boolean) => {
    setState((prev) => {
      const updated = { ...prev.visibility };
      (Object.keys(updated) as (keyof TextVisibility)[]).forEach((k) => {
        updated[k] = visible;
      });
      return { ...prev, visibility: updated };
    });
    showToast(visible ? 'All text fields turned On' : 'All text fields turned Off');
  };

  const handleResetStudio = () => {
    handleApplyPreset(BRAND_PRESETS[0].id);
  };

  const toggleApprove = () => {
    setState((prev) => {
      const nextApproved = !prev.approved;
      showToast(
        nextApproved
          ? 'Designs approved — ready to export separate PDFs & MS Word files'
          : 'Approval cleared — continue editing'
      );
      return { ...prev, approved: nextApproved };
    });
  };

  const updateBrand = (patch: Partial<BrandIdentity>) =>
    setState((prev) => ({ ...prev, brand: { ...prev.brand, ...patch } }));

  const updateLogo = (patch: Partial<LogoConfig>) =>
    setState((prev) => ({ ...prev, logo: { ...prev.logo, ...patch } }));

  const updateStamp = (patch: Partial<StampConfig>) =>
    setState((prev) => ({ ...prev, stamp: { ...prev.stamp, ...patch } }));

  const updateCard = (patch: Partial<VisitingCardConfig>) =>
    setState((prev) => ({ ...prev, card: { ...prev.card, ...patch } }));

  const updateLetterhead = (patch: Partial<LetterheadConfig>) =>
    setState((prev) => ({ ...prev, letterhead: { ...prev.letterhead, ...patch } }));

  const handleDownloadPhpApp = () => {
    const blob = new Blob([phpAppSource], { type: 'application/x-httpd-php;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'index.php';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Downloaded standalone PHP app (index.php)');
  };

  const handleDownloadAsset = async (type: ExportArtifactType, format: ExportFileFormat) => {
    const slug = slugifyFilename(state.brand.companyName);
    setIsExporting(true);

    try {
      if (format === 'pdf') {
        if (type === 'letterhead') {
          const ok = await downloadLetterheadPdf(letterheadSvgRef.current, state);
          if (ok) showToast('Downloaded Letterhead PDF');
        } else if (type === 'card' || type === 'card-front' || type === 'card-back') {
          const ok = await downloadVisitingCardPdf(
            cardFrontSvgRef.current,
            cardBackSvgRef.current,
            state
          );
          if (ok) showToast('Downloaded 2-Page Visiting Card PDF');
        } else if (type === 'stamp') {
          const ok = await downloadStampPdf(stampSvgRef.current, state);
          if (ok) showToast('Downloaded Stamp Design PDF');
        } else if (type === 'logo') {
          const ok = await downloadLogoPdf(logoSvgRef.current, state);
          if (ok) showToast('Downloaded Logo PDF');
        }
        return;
      }

      if (format === 'docx') {
        if (type === 'letterhead') {
          const ok = await downloadLetterheadDocx(
            logoSvgRef.current,
            stampSvgRef.current,
            state
          );
          if (ok) showToast('Downloaded Editable Letterhead Word (.docx)');
        } else if (type === 'card' || type === 'card-front' || type === 'card-back') {
          const ok = await downloadVisitingCardDocx(
            cardFrontSvgRef.current,
            cardBackSvgRef.current,
            state
          );
          if (ok) showToast('Downloaded Editable Visiting Card Word (.docx)');
        } else if (type === 'stamp') {
          const ok = await downloadStampDocx(stampSvgRef.current, state);
          if (ok) showToast('Downloaded Editable Stamp Word (.docx)');
        } else if (type === 'logo') {
          const ok = await downloadLogoDocx(logoSvgRef.current, state);
          if (ok) showToast('Downloaded Editable Logo Word (.docx)');
        }
        return;
      }

      if (type === 'logo') {
        const name = `${slug}-logo`;
        if (format === 'svg') {
          if (downloadSvgElement(logoSvgRef.current, name)) showToast('Downloaded Logo SVG');
        } else {
          const ok = await downloadSvgAsPng(logoSvgRef.current, name, 2400, 1440);
          if (ok) showToast('Downloaded Logo PNG (2400 × 1440)');
        }
        return;
      }

      if (type === 'stamp') {
        const name = `${slug}-stamp`;
        if (format === 'svg') {
          if (downloadSvgElement(stampSvgRef.current, name)) showToast('Downloaded Stamp SVG');
        } else {
          const ok = await downloadSvgAsPng(stampSvgRef.current, name, 1440, 1440);
          if (ok) showToast('Downloaded Transparent Stamp PNG (1440 × 1440)');
        }
        return;
      }

      if (type === 'card-front' || type === 'card-back') {
        const isFront = type === 'card-front';
        const ref = isFront ? cardFrontSvgRef.current : cardBackSvgRef.current;
        const name = `${slug}-visiting-card-${isFront ? 'front' : 'back'}`;
        const w = state.card.standard === 'iso' ? 2008 : 2100;
        const h = state.card.standard === 'iso' ? 1300 : 1200;
        if (format === 'svg') {
          if (downloadSvgElement(ref, name)) {
            showToast(`Downloaded Visiting Card ${isFront ? 'Front' : 'Back'} SVG`);
          }
        } else {
          const ok = await downloadSvgAsPng(ref, name, w, h);
          if (ok) {
            showToast(`Downloaded Visiting Card ${isFront ? 'Front' : 'Back'} PNG (600 DPI)`);
          }
        }
        return;
      }

      if (type === 'letterhead') {
        const name = `${slug}-letterhead-${state.letterhead.paperSize}`;
        const w = state.letterhead.paperSize === 'a4' ? 1588 : 1632;
        const h = state.letterhead.paperSize === 'a4' ? 2246 : 2112;
        if (format === 'svg') {
          if (downloadSvgElement(letterheadSvgRef.current, name)) {
            showToast('Downloaded Letterhead Vector SVG');
          }
        } else {
          const ok = await downloadSvgAsPng(letterheadSvgRef.current, name, w, h);
          if (ok) showToast('Downloaded High-Res Letterhead PNG');
        }
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAllPdfs = async () => {
    setIsExporting(true);
    try {
      await downloadLetterheadPdf(letterheadSvgRef.current, state);
      await downloadVisitingCardPdf(cardFrontSvgRef.current, cardBackSvgRef.current, state);
      await downloadStampPdf(stampSvgRef.current, state);
      await downloadLogoPdf(logoSvgRef.current, state);
      showToast('Downloaded all 4 separate print-ready PDFs');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAllDocx = async () => {
    setIsExporting(true);
    try {
      await downloadLetterheadDocx(logoSvgRef.current, stampSvgRef.current, state);
      await downloadVisitingCardDocx(cardFrontSvgRef.current, cardBackSvgRef.current, state);
      await downloadStampDocx(stampSvgRef.current, state);
      await downloadLogoDocx(logoSvgRef.current, state);
      showToast('Downloaded all 4 editable MS Word (.docx) files');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrimaryHeaderAction = async () => {
    if (activeTab === 'suite') {
      if (!state.approved) {
        toggleApprove();
      } else {
        await handleDownloadAllPdfs();
      }
      return;
    }
    if (activeTab === 'logo') await handleDownloadAsset('logo', 'pdf');
    if (activeTab === 'stamp') await handleDownloadAsset('stamp', 'pdf');
    if (activeTab === 'card') await handleDownloadAsset('card', 'pdf');
    if (activeTab === 'letterhead') await handleDownloadAsset('letterhead', 'pdf');
  };

  const primaryCtaLabel =
    activeTab === 'suite'
      ? state.approved
        ? 'Download 4 PDFs'
        : 'Approve Designs'
      : 'Download PDF';

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F7] text-[#111318]">
      {/* 3-Zone Top Bar */}
      <header className="no-print h-[57px] bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 sticky top-0 z-30">
        <a
          href="#suite"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('suite');
          }}
          className="text-base font-bold tracking-tight text-[#111318] whitespace-nowrap shrink-0"
        >
          Pressmark Studio
        </a>

        <nav className="flex items-center gap-6 overflow-x-auto" aria-label="Stationery modules">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setZoom(100);
                }}
                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#1E40AF] text-[#111318]'
                    : 'border-transparent text-slate-500 hover:text-[#111318]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            disabled={isExporting}
            onClick={handlePrimaryHeaderAction}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E40AF] rounded-md hover:bg-[#1E3A8A] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {activeTab === 'suite' && !state.approved ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {primaryCtaLabel}
          </button>
        </div>
      </header>

      {/* Main Studio Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <InspectorPanel
          activeTab={activeTab}
          state={state}
          onApplyPreset={handleApplyPreset}
          onApplyTheme={handleApplyTheme}
          onToggleVisibility={handleToggleVisibility}
          onSetAllVisibility={handleSetAllVisibility}
          onUpdateBrand={updateBrand}
          onUpdateLogo={updateLogo}
          onUpdateStamp={updateStamp}
          onUpdateCard={updateCard}
          onUpdateLetterhead={updateLetterhead}
          onResetStudio={handleResetStudio}
        />

        {/* Drafting Mat Viewport */}
        <main className="flex-1 min-w-0 drafting-mat lg:h-[calc(100vh-57px)] overflow-y-auto studio-scroll">
          {activeTab === 'suite' && (
            <SuiteOverview
              state={state}
              isExporting={isExporting}
              onToggleApprove={toggleApprove}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setZoom(100);
              }}
              logoSvgRef={logoSvgRef}
              stampSvgRef={stampSvgRef}
              cardFrontSvgRef={cardFrontSvgRef}
              cardBackSvgRef={cardBackSvgRef}
              letterheadSvgRef={letterheadSvgRef}
              onDownloadAsset={handleDownloadAsset}
              onDownloadAllPdfs={handleDownloadAllPdfs}
              onDownloadAllDocx={handleDownloadAllDocx}
              onDownloadPhpApp={handleDownloadPhpApp}
            />
          )}

          {activeTab !== 'suite' && (
            <div className="min-h-full flex flex-col">
              <div className="no-print bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
                <div className="flex items-baseline gap-3 text-xs">
                  <span className="font-semibold text-[#111318]">
                    {activeTab === 'logo' && 'Logo Vector Artboard'}
                    {activeTab === 'stamp' && 'Official Rubber Stamp Seal'}
                    {activeTab === 'card' && 'Visiting Card Proof'}
                    {activeTab === 'letterhead' && 'Letterhead Print Sheet'}
                  </span>
                  <span className="font-studio-mono text-slate-500">
                    {activeTab === 'logo' && `${state.logo.lockup} · Vector`}
                    {activeTab === 'stamp' && `${state.stamp.shape} · Bold Business Seal`}
                    {activeTab === 'card' &&
                      (state.card.standard === 'iso'
                        ? 'ISO 85 × 55 mm · 2-Page PDF'
                        : 'US 3.5 × 2.0 in · 2-Page PDF')}
                    {activeTab === 'letterhead' &&
                      (state.letterhead.paperSize === 'a4'
                        ? 'A4 · 210 × 297 mm'
                        : 'US Letter · 8.5 × 11 in')}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center gap-1 border border-slate-200 bg-white rounded-md px-1.5 py-1">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(60, z - 15))}
                      className="p-1 text-slate-600 hover:text-[#111318] cursor-pointer"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-studio-mono text-xs text-slate-700 w-10 text-center">
                      {zoom}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(140, z + 15))}
                      className="p-1 text-slate-600 hover:text-[#111318] cursor-pointer"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {activeTab === 'card' && (
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
                      {(['both', 'front', 'back'] as const).map((sideMode) => (
                        <button
                          key={sideMode}
                          type="button"
                          onClick={() => updateCard({ activeSide: sideMode })}
                          className={`px-2.5 py-1 text-xs font-medium rounded-sm capitalize transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            state.card.activeSide === sideMode
                              ? 'bg-white text-[#111318] shadow-xs'
                              : 'text-slate-600 hover:text-[#111318]'
                          }`}
                        >
                          {sideMode}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeTab === 'logo' && (
                    <>
                      <button
                        type="button"
                        disabled={isExporting}
                        onClick={() => handleDownloadAsset('logo', 'docx')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Word (.docx)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAsset('logo', 'svg')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        SVG
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAsset('logo', 'png')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        PNG
                      </button>
                    </>
                  )}

                  {activeTab === 'stamp' && (
                    <>
                      <button
                        type="button"
                        disabled={isExporting}
                        onClick={() => handleDownloadAsset('stamp', 'docx')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Word (.docx)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAsset('stamp', 'svg')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        SVG
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAsset('stamp', 'png')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Transparent PNG
                      </button>
                    </>
                  )}

                  {activeTab === 'card' && (
                    <>
                      <button
                        type="button"
                        disabled={isExporting}
                        onClick={() => handleDownloadAsset('card', 'docx')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Word (.docx)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAsset('card-front', 'png')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Front PNG
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAsset('card-back', 'png')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Back PNG
                      </button>
                    </>
                  )}

                  {activeTab === 'letterhead' && (
                    <>
                      <button
                        type="button"
                        disabled={isExporting}
                        onClick={() => handleDownloadAsset('letterhead', 'docx')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Editable Word (.docx)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAsset('letterhead', 'svg')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        SVG
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAsset('letterhead', 'png')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111318] bg-white border border-slate-200 rounded-md hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        PNG
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                {activeTab === 'logo' && (
                  <div
                    className="w-full max-w-[780px] border border-slate-200 shadow-lg bg-white transition-transform duration-150"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
                  >
                    <LogoArtboard
                      brand={state.brand}
                      logo={state.logo}
                      visibility={state.visibility}
                      svgRef={logoSvgRef}
                    />
                  </div>
                )}

                {activeTab === 'stamp' && (
                  <div
                    className="w-full max-w-[460px] border border-slate-200 shadow-lg bg-[#FAF8F3] transition-transform duration-150"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
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
                )}

                {activeTab === 'card' && (
                  <div
                    className={`w-full transition-transform duration-150 ${
                      state.card.activeSide === 'both'
                        ? 'max-w-[960px] grid grid-cols-1 md:grid-cols-2 gap-8'
                        : 'max-w-[540px]'
                    }`}
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
                  >
                    <div className={state.card.activeSide === 'back' ? 'hidden' : 'space-y-2'}>
                      <div className="flex items-center justify-between text-xs font-studio-mono text-slate-500">
                        <span>FRONT FACE</span>
                        <span>{state.card.layout}</span>
                      </div>
                      <div className="border border-slate-200 shadow-lg bg-white">
                        <VisitingCardFaceSvg
                          brand={state.brand}
                          logo={state.logo}
                          card={state.card}
                          visibility={state.visibility}
                          side="front"
                          svgRef={cardFrontSvgRef}
                        />
                      </div>
                    </div>
                    <div className={state.card.activeSide === 'front' ? 'hidden' : 'space-y-2'}>
                      <div className="flex items-center justify-between text-xs font-studio-mono text-slate-500">
                        <span>BACK FACE</span>
                        <span>{state.card.backStyle}</span>
                      </div>
                      <div className="border border-slate-200 shadow-lg bg-white">
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
                  </div>
                )}

                {activeTab === 'letterhead' && (
                  <div
                    className="w-full max-w-[680px] border border-slate-200 shadow-xl bg-white transition-transform duration-150 print-only-sheet"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
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
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Offscreen SVG refs so Word (.docx) embeds Logo & Stamp from any tab */}
      {activeTab !== 'suite' && (
        <div
          aria-hidden="true"
          className="no-print fixed -left-[9999px] top-0 w-[800px] opacity-0 pointer-events-none"
        >
          {activeTab !== 'logo' && (
            <LogoArtboard
              brand={state.brand}
              logo={state.logo}
              visibility={state.visibility}
              svgRef={logoSvgRef}
              compact
            />
          )}
          {activeTab !== 'stamp' && (
            <StampArtboard
              brand={state.brand}
              logo={state.logo}
              stamp={state.stamp}
              visibility={state.visibility}
              svgRef={stampSvgRef}
              transparentBg
            />
          )}
        </div>
      )}

      {/* Subtle Export Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-[#111318] text-white px-4 py-2.5 rounded-md shadow-lg text-xs font-medium"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
