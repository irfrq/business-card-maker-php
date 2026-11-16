import React, { useState } from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import {
  BrandIdentity,
  CardLayout,
  ColorTheme,
  FontPairing,
  LetterheadConfig,
  LetterheadLayout,
  LogoConfig,
  LogoLockup,
  LogoSurface,
  PaperStock,
  StampBorderStyle,
  StampCenterMode,
  StampConfig,
  StampShape,
  StudioState,
  TextVisibility,
  VisitingCardConfig,
  WorkspaceTab,
} from '../types/brand';
import { BRAND_PRESETS, COLOR_THEMES } from '../data/presets';
import { EMBLEM_OPTIONS } from './emblems/LogoEmblemSvg';

interface InspectorPanelProps {
  activeTab: WorkspaceTab;
  state: StudioState;
  onApplyPreset: (presetId: string) => void;
  onApplyTheme: (theme: ColorTheme) => void;
  onToggleVisibility: (key: keyof TextVisibility) => void;
  onSetAllVisibility: (visible: boolean) => void;
  onUpdateBrand: (patch: Partial<BrandIdentity>) => void;
  onUpdateLogo: (patch: Partial<LogoConfig>) => void;
  onUpdateStamp: (patch: Partial<StampConfig>) => void;
  onUpdateCard: (patch: Partial<VisitingCardConfig>) => void;
  onUpdateLetterhead: (patch: Partial<LetterheadConfig>) => void;
  onResetStudio: () => void;
}

const STAMP_INK_SWATCHES = [
  { label: 'Cobalt', hex: '#1E3A8A' },
  { label: 'Crimson', hex: '#991B1B' },
  { label: 'Charcoal', hex: '#18181B' },
  { label: 'Forest', hex: '#14532D' },
  { label: 'Violet', hex: '#4C1D95' },
];

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  activeTab,
  state,
  onApplyPreset,
  onApplyTheme,
  onToggleVisibility,
  onSetAllVisibility,
  onUpdateBrand,
  onUpdateLogo,
  onUpdateStamp,
  onUpdateCard,
  onUpdateLetterhead,
  onResetStudio,
}) => {
  const [section, setSection] = useState<'brand' | 'artifact'>(
    activeTab === 'suite' ? 'brand' : 'artifact'
  );

  React.useEffect(() => {
    if (activeTab === 'suite') {
      setSection('brand');
    } else {
      setSection('artifact');
    }
  }, [activeTab]);

  const inputClass =
    'w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-[#111318] placeholder:text-slate-400 focus:outline-none focus:border-[#1E40AF] transition-colors';
  const labelClass = 'text-xs font-medium text-slate-600';

  const renderVisToggle = (visKey: keyof TextVisibility, title = 'Toggle text on/off') => {
    const isOn = state.visibility[visKey];
    return (
      <button
        type="button"
        onClick={() => onToggleVisibility(visKey)}
        title={title}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
          isOn
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-slate-200 bg-slate-100 text-slate-500'
        }`}
      >
        {isOn ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        {isOn ? 'On' : 'Off'}
      </button>
    );
  };

  return (
    <aside className="no-print w-full lg:w-[356px] shrink-0 bg-white border-r border-slate-200 flex flex-col lg:h-[calc(100vh-57px)]">
      {/* Preset Bar */}
      <div className="p-4 border-b border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#111318]">Business Profile Preset</span>
          <button
            type="button"
            onClick={onResetStudio}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#111318] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Reset all fields to Irfan Livestock Farm defaults"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {BRAND_PRESETS.map((preset) => {
            const active = state.activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className={`px-2.5 py-2 text-left rounded-md border text-xs transition-colors cursor-pointer truncate ${
                  active
                    ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Switcher */}
      {activeTab !== 'suite' && (
        <div className="px-4 pt-3 pb-2 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSection('artifact')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                section === 'artifact'
                  ? 'bg-white text-[#111318] shadow-xs'
                  : 'text-slate-600 hover:text-[#111318]'
              }`}
            >
              {activeTab === 'logo' && 'Logo Designs'}
              {activeTab === 'stamp' && 'Stamp Designs'}
              {activeTab === 'card' && 'Card Designs'}
              {activeTab === 'letterhead' && 'Letterhead Designs'}
            </button>
            <button
              type="button"
              onClick={() => setSection('brand')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                section === 'brand'
                  ? 'bg-white text-[#111318] shadow-xs'
                  : 'text-slate-600 hover:text-[#111318]'
              }`}
            >
              Text & Themes
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto studio-scroll p-4 space-y-5">
        {(section === 'brand' || activeTab === 'suite') && (
          <div className="space-y-4">
            {/* Selectable Color Themes */}
            <div>
              <h3 className="text-xs font-semibold text-[#111318] mb-2.5">
                Selectable Color Themes
              </h3>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {COLOR_THEMES.map((theme) => {
                  const active = state.brand.themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => onApplyTheme(theme)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
                        active
                          ? 'border-[#1E40AF] bg-[#1E40AF]/5 font-semibold text-[#1E40AF]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="flex shrink-0">
                        <span
                          className="w-3 h-3 rounded-l-xs"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span
                          className="w-3 h-3 rounded-r-xs"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </span>
                      <span className="truncate text-[11px]">{theme.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Custom Primary
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2 py-1">
                    <input
                      type="color"
                      value={state.brand.primaryColor}
                      onChange={(e) =>
                        onUpdateBrand({ themeId: 'custom', primaryColor: e.target.value })
                      }
                      className="w-5 h-5 border-0 p-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-[11px] font-studio-mono text-slate-600 uppercase">
                      {state.brand.primaryColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Custom Accent
                  </label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2 py-1">
                    <input
                      type="color"
                      value={state.brand.accentColor}
                      onChange={(e) =>
                        onUpdateBrand({ themeId: 'custom', accentColor: e.target.value })
                      }
                      className="w-5 h-5 border-0 p-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-[11px] font-studio-mono text-slate-600 uppercase">
                      {state.brand.accentColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Identity & Per-Text On/Off */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#111318]">
                  Business Text & On/Off Toggles
                </h3>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => onSetAllVisibility(true)}
                    className="text-[#1E40AF] hover:underline cursor-pointer"
                  >
                    All On
                  </button>
                  <span className="text-slate-300">/</span>
                  <button
                    type="button"
                    onClick={() => onSetAllVisibility(false)}
                    className="text-slate-500 hover:underline cursor-pointer"
                  >
                    All Off
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Business Name</label>
                  {renderVisToggle('companyName')}
                </div>
                <input
                  type="text"
                  value={state.brand.companyName}
                  onChange={(e) => onUpdateBrand({ companyName: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Tagline / Focus</label>
                  {renderVisToggle('tagline')}
                </div>
                <input
                  type="text"
                  value={state.brand.tagline}
                  onChange={(e) => onUpdateBrand({ tagline: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Monogram</label>
                  </div>
                  <input
                    type="text"
                    maxLength={3}
                    value={state.brand.monogram}
                    onChange={(e) => onUpdateBrand({ monogram: e.target.value.toUpperCase() })}
                    className={`${inputClass} font-studio-mono uppercase`}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Est. Year</label>
                    {renderVisToggle('establishedYear')}
                  </div>
                  <input
                    type="text"
                    value={state.brand.establishedYear}
                    onChange={(e) => onUpdateBrand({ establishedYear: e.target.value })}
                    className={`${inputClass} font-studio-mono`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Location / Registry Badge</label>
                  {renderVisToggle('registrationNo')}
                </div>
                <input
                  type="text"
                  value={state.brand.registrationNo}
                  onChange={(e) => onUpdateBrand({ registrationNo: e.target.value })}
                  className={`${inputClass} font-studio-mono`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Font Pairing
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'geometric-sans', label: 'Sans' },
                      { id: 'editorial-serif', label: 'Serif' },
                      { id: 'technical-mono', label: 'Mono' },
                    ] as { id: FontPairing; label: string }[]
                  ).map((fp) => (
                    <button
                      key={fp.id}
                      type="button"
                      onClick={() => onUpdateBrand({ fontPairing: fp.id })}
                      className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                        state.brand.fontPairing === fp.id
                          ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {fp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary Contact */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-[#111318]">
                Primary Contact (Proprietor)
              </h3>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Name</label>
                  {renderVisToggle('personName')}
                </div>
                <input
                  type="text"
                  value={state.brand.personName}
                  onChange={(e) => onUpdateBrand({ personName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Role / Title</label>
                  {renderVisToggle('personTitle')}
                </div>
                <input
                  type="text"
                  value={state.brand.personTitle}
                  onChange={(e) => onUpdateBrand({ personTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Mobile</label>
                  {renderVisToggle('phone')}
                </div>
                <input
                  type="text"
                  value={state.brand.phone}
                  onChange={(e) => onUpdateBrand({ phone: e.target.value })}
                  className={`${inputClass} font-studio-mono`}
                />
              </div>
            </div>

            {/* Secondary Contact */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-[#111318]">
                Secondary Contact (Caretaker / Operations)
              </h3>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Name</label>
                  {renderVisToggle('secondaryPersonName')}
                </div>
                <input
                  type="text"
                  value={state.brand.secondaryPersonName}
                  onChange={(e) => onUpdateBrand({ secondaryPersonName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Role / Title</label>
                  {renderVisToggle('secondaryPersonTitle')}
                </div>
                <input
                  type="text"
                  value={state.brand.secondaryPersonTitle}
                  onChange={(e) => onUpdateBrand({ secondaryPersonTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Mobile</label>
                  {renderVisToggle('secondaryPhone')}
                </div>
                <input
                  type="text"
                  value={state.brand.secondaryPhone}
                  onChange={(e) => onUpdateBrand({ secondaryPhone: e.target.value })}
                  className={`${inputClass} font-studio-mono`}
                />
              </div>
            </div>

            {/* Digital & Address */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-[#111318]">
                Email, Website & Address
              </h3>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Email Address</label>
                  {renderVisToggle('email')}
                </div>
                <input
                  type="email"
                  value={state.brand.email}
                  onChange={(e) => onUpdateBrand({ email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Website</label>
                  {renderVisToggle('website')}
                </div>
                <input
                  type="text"
                  value={state.brand.website}
                  onChange={(e) => onUpdateBrand({ website: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Farm / Street Address</label>
                  {renderVisToggle('address')}
                </div>
                <input
                  type="text"
                  value={state.brand.addressLine1}
                  onChange={(e) => onUpdateBrand({ addressLine1: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  District / City / State
                </label>
                <input
                  type="text"
                  value={state.brand.cityState}
                  onChange={(e) => onUpdateBrand({ cityState: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* LOGO ARTIFACT CONTROLS */}
        {section === 'artifact' && activeTab === 'logo' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#111318]">Emblem Mark</label>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.logo.useMonogramEmblem}
                    onChange={(e) => onUpdateLogo({ useMonogramEmblem: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Use Monogram Seal
                </label>
              </div>
              {!state.logo.useMonogramEmblem && (
                <div className="grid grid-cols-3 gap-1.5">
                  {EMBLEM_OPTIONS.map((em) => (
                    <button
                      key={em.id}
                      type="button"
                      onClick={() => onUpdateLogo({ emblemId: em.id })}
                      className={`px-2 py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                        state.logo.emblemId === em.id
                          ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {em.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Lockup Design (5 Styles)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'horizontal', label: 'Horizontal' },
                    { id: 'stacked', label: 'Stacked Crest' },
                    { id: 'badge', label: 'Heritage Badge' },
                    { id: 'emblem', label: 'Emblem Only' },
                    { id: 'wordmark', label: 'Wordmark Only' },
                  ] as { id: LogoLockup; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUpdateLogo({ lockup: item.id })}
                    className={`px-3 py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.logo.lockup === item.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Presentation Surface
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'white', label: 'White' },
                    { id: 'alabaster', label: 'Ivory' },
                    { id: 'obsidian', label: 'Dark' },
                    { id: 'cobalt', label: 'Accent' },
                  ] as { id: LogoSurface; label: string }[]
                ).map((surf) => (
                  <button
                    key={surf.id}
                    type="button"
                    onClick={() => onUpdateLogo({ surface: surf.id })}
                    className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.logo.surface === surf.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {surf.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Emblem Stroke Weight</span>
                  <span className="font-studio-mono text-slate-500">
                    {state.logo.strokeWeight.toFixed(1)}px
                  </span>
                </div>
                <input
                  type="range"
                  min={1.2}
                  max={3.4}
                  step={0.2}
                  value={state.logo.strokeWeight}
                  onChange={(e) => onUpdateLogo({ strokeWeight: parseFloat(e.target.value) })}
                  className="w-full accent-[#1E40AF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Wordmark Tracking</span>
                  <span className="font-studio-mono text-slate-500">
                    {state.logo.letterSpacing.toFixed(2)}em
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.26}
                  step={0.02}
                  value={state.logo.letterSpacing}
                  onChange={(e) => onUpdateLogo({ letterSpacing: parseFloat(e.target.value) })}
                  className="w-full accent-[#1E40AF]"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.logo.showTagline}
                    onChange={(e) => onUpdateLogo({ showTagline: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Show Tagline Under Wordmark
                </label>
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.logo.roundedCorners}
                    onChange={(e) => onUpdateLogo({ roundedCorners: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Rounded Line Joins & Caps
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STAMP ARTIFACT CONTROLS */}
        {section === 'artifact' && activeTab === 'stamp' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Stamp Geometry (4 Shapes)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'circle', label: 'Circle Seal' },
                    { id: 'oval', label: 'Oval Notary' },
                    { id: 'rectangle', label: 'Rectangle Block' },
                    { id: 'shield', label: 'Heritage Shield' },
                  ] as { id: StampShape; label: string }[]
                ).map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => onUpdateStamp({ shape: sh.id })}
                    className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.stamp.shape === sh.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {sh.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Ring & Border Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'double-solid', label: 'Double Seal' },
                    { id: 'dashed-inner', label: 'Dashed Inner' },
                    { id: 'notched-seal', label: 'Notched Outer' },
                    { id: 'single-heavy', label: 'Heavy Single' },
                  ] as { id: StampBorderStyle; label: string }[]
                ).map((bs) => (
                  <button
                    key={bs.id}
                    type="button"
                    onClick={() => onUpdateStamp({ borderStyle: bs.id })}
                    className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.stamp.borderStyle === bs.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {bs.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Centerpiece Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'emblem', label: 'Brand Emblem' },
                    { id: 'monogram', label: 'Monogram' },
                    { id: 'status', label: 'Status Box' },
                    { id: 'date-line', label: 'Date Line' },
                  ] as { id: StampCenterMode; label: string }[]
                ).map((cm) => (
                  <button
                    key={cm.id}
                    type="button"
                    onClick={() => onUpdateStamp({ centerMode: cm.id })}
                    className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.stamp.centerMode === cm.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {cm.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Top Bold Ring (Business Name)</label>
                  {renderVisToggle('stampTopArc')}
                </div>
                <input
                  type="text"
                  value={state.stamp.topArcText}
                  onChange={(e) => onUpdateStamp({ topArcText: e.target.value })}
                  className={`${inputClass} uppercase font-semibold`}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Bottom Ring Text</label>
                  {renderVisToggle('stampBottomArc')}
                </div>
                <input
                  type="text"
                  value={state.stamp.bottomArcText}
                  onChange={(e) => onUpdateStamp({ bottomArcText: e.target.value })}
                  className={`${inputClass} uppercase`}
                />
              </div>
              {(state.stamp.centerMode === 'status' || state.stamp.centerMode === 'date-line') && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Center Stamp Word</label>
                    {renderVisToggle('stampCenterLabel')}
                  </div>
                  <input
                    type="text"
                    value={state.stamp.centerLabel}
                    onChange={(e) => onUpdateStamp({ centerLabel: e.target.value })}
                    className={`${inputClass} uppercase`}
                  />
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Inner Seal Sub-Label</label>
                  {renderVisToggle('stampSubLabel')}
                </div>
                <input
                  type="text"
                  value={state.stamp.subLabel}
                  onChange={(e) => onUpdateStamp({ subLabel: e.target.value })}
                  className={`${inputClass} font-studio-mono uppercase`}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-xs font-medium text-slate-600">Ink Pad Color</label>
              <div className="flex items-center gap-2">
                {STAMP_INK_SWATCHES.map((sw) => (
                  <button
                    key={sw.label}
                    type="button"
                    onClick={() => onUpdateStamp({ inkColor: sw.hex })}
                    className={`w-7 h-7 rounded-md border-2 transition-transform cursor-pointer ${
                      state.stamp.inkColor.toLowerCase() === sw.hex.toLowerCase()
                        ? 'border-[#111318] scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: sw.hex }}
                    title={sw.label}
                  />
                ))}
                <input
                  type="color"
                  value={state.stamp.inkColor}
                  onChange={(e) => onUpdateStamp({ inkColor: e.target.value })}
                  className="w-7 h-7 border border-slate-200 rounded-md p-0.5 cursor-pointer"
                  title="Custom ink color"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Impression Tilt</span>
                  <span className="font-studio-mono text-slate-500">
                    {state.stamp.rotation > 0 ? `+${state.stamp.rotation}°` : `${state.stamp.rotation}°`}
                  </span>
                </div>
                <input
                  type="range"
                  min={-15}
                  max={15}
                  step={1}
                  value={state.stamp.rotation}
                  onChange={(e) => onUpdateStamp({ rotation: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#1E40AF]"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.stamp.distressedInk}
                    onChange={(e) => onUpdateStamp({ distressedInk: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Realistic Rubber Ink Texture
                </label>
                {(state.stamp.shape === 'circle' || state.stamp.shape === 'oval') && (
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.stamp.showStars}
                      onChange={(e) => onUpdateStamp({ showStars: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Show Side Divider Stars
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VISITING CARD CONTROLS */}
        {section === 'artifact' && activeTab === 'card' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Print Standard
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateCard({ standard: 'us' })}
                  className={`py-2 px-2.5 text-xs rounded-md border transition-colors cursor-pointer ${
                    state.card.standard === 'us'
                      ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  US (3.5 × 2.0 in)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateCard({ standard: 'iso' })}
                  className={`py-2 px-2.5 text-xs rounded-md border transition-colors cursor-pointer ${
                    state.card.standard === 'iso'
                      ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  ISO (85 × 55 mm)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Front Card Designs (7 Layouts)
              </label>
              <div className="space-y-1.5">
                {(
                  [
                    { id: 'swiss-grid', label: 'Swiss Modular Grid' },
                    { id: 'executive-minimal', label: 'Executive Minimal' },
                    { id: 'editorial-split', label: 'Editorial Color Split' },
                    { id: 'diagonal-ribbon', label: 'Diagonal Ribbon Sash' },
                    { id: 'pastoral-horizon', label: 'Pastoral Header Band' },
                    { id: 'monogram-crest', label: 'Centered Monogram Crest' },
                    { id: 'architectural-frame', label: 'Architectural Double Frame' },
                  ] as { id: CardLayout; label: string }[]
                ).map((lay) => (
                  <button
                    key={lay.id}
                    type="button"
                    onClick={() => onUpdateCard({ layout: lay.id })}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.card.layout === lay.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {lay.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Card Paper Stock
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'white', label: 'Stark White' },
                    { id: 'cotton-ivory', label: 'Cotton Ivory' },
                    { id: 'warm-kraft', label: 'Warm Kraft' },
                    { id: 'obsidian', label: 'Obsidian Matte' },
                    { id: 'slate-navy', label: 'Midnight Navy' },
                  ] as { id: PaperStock; label: string }[]
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onUpdateCard({ paperStock: st.id })}
                    className={`px-3 py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.card.paperStock === st.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-xs font-medium text-slate-600">Back Face Style</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'solid-accent', label: 'Solid Color' },
                    { id: 'emblem-centered', label: 'Emblem' },
                    { id: 'minimal-wordmark', label: 'Wordmark' },
                  ] as {
                    id: VisitingCardConfig['backStyle'];
                    label: string;
                  }[]
                ).map((bs) => (
                  <button
                    key={bs.id}
                    type="button"
                    onClick={() => onUpdateCard({ backStyle: bs.id })}
                    className={`py-2 px-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.card.backStyle === bs.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {bs.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.card.showLivestockWatermark}
                    onChange={(e) => onUpdateCard({ showLivestockWatermark: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Low-Opacity Livestock Silhouette
                </label>
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.card.showQrMatrix}
                    onChange={(e) => onUpdateCard({ showQrMatrix: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Include vCard Matrix on Back
                </label>
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.card.showBleedMarks}
                    onChange={(e) => onUpdateCard({ showBleedMarks: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Show Print Trim & Bleed Marks
                </label>
              </div>
            </div>
          </div>
        )}

        {/* LETTERHEAD CONTROLS */}
        {section === 'artifact' && activeTab === 'letterhead' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Paper Format & Stock
              </label>
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                <button
                  type="button"
                  onClick={() => onUpdateLetterhead({ paperSize: 'a4' })}
                  className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                    state.letterhead.paperSize === 'a4'
                      ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  A4 (210 × 297 mm)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLetterhead({ paperSize: 'letter' })}
                  className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                    state.letterhead.paperSize === 'letter'
                      ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  US Letter (8.5 × 11 in)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateLetterhead({ paperStock: 'white' })}
                  className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                    state.letterhead.paperStock === 'white'
                      ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Bright Bond White
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLetterhead({ paperStock: 'cotton-ivory' })}
                  className={`py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                    state.letterhead.paperStock === 'cotton-ivory'
                      ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Cotton Archival Ivory
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Letterhead Designs (7 Layouts)
              </label>
              <div className="space-y-1.5">
                {(
                  [
                    { id: 'classic-executive', label: 'Classic Executive' },
                    { id: 'left-rail', label: 'Architectural Left Rail' },
                    { id: 'minimal-rule', label: 'Minimalist Top Rule' },
                    { id: 'institutional-crest', label: 'Institutional Centered Crest' },
                    { id: 'modern-asymmetric', label: 'Full-Bleed Header Band' },
                    { id: 'double-ledger', label: 'Double Border Ledger' },
                    { id: 'pastoral-band', label: 'Pastoral Footer Band' },
                  ] as { id: LetterheadLayout; label: string }[]
                ).map((lay) => (
                  <button
                    key={lay.id}
                    type="button"
                    onClick={() => onUpdateLetterhead({ layout: lay.id })}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                      state.letterhead.layout === lay.id
                        ? 'border-[#1E40AF] bg-[#1E40AF]/5 text-[#1E40AF] font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {lay.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5">
              <label className="text-xs font-semibold text-[#111318] block">
                Sheet Layers & Low-Opacity Artwork
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={state.letterhead.showLivestockBackdrop}
                  onChange={(e) => onUpdateLetterhead({ showLivestockBackdrop: e.target.checked })}
                  className="accent-[#1E40AF]"
                />
                Low-Opacity Livestock Herd Silhouette
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={state.letterhead.showWatermark}
                  onChange={(e) => onUpdateLetterhead({ showWatermark: e.target.checked })}
                  className="accent-[#1E40AF]"
                />
                Center Emblem Watermark
              </label>
              <div className="pt-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Watermark Opacity</span>
                  <span className="font-studio-mono text-slate-500">
                    {Math.round(state.letterhead.watermarkOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.02}
                  max={0.14}
                  step={0.01}
                  value={state.letterhead.watermarkOpacity}
                  onChange={(e) =>
                    onUpdateLetterhead({ watermarkOpacity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#1E40AF]"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={state.letterhead.showStampOverlay}
                  onChange={(e) => onUpdateLetterhead({ showStampOverlay: e.target.checked })}
                  className="accent-[#1E40AF]"
                />
                Apply Official Stamp Next to Signature
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={state.letterhead.showSampleContent}
                  onChange={(e) => onUpdateLetterhead({ showSampleContent: e.target.checked })}
                  className="accent-[#1E40AF]"
                />
                Show Sample Correspondence Text
              </label>
            </div>

            {/* SEPARATE HEADER SHOW / HIDE */}
            <div className="border-t border-slate-100 pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#111318] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.letterhead.showHeader}
                    onChange={(e) => onUpdateLetterhead({ showHeader: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Header Show / Hide
                </label>
                {state.letterhead.showHeader && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateLetterhead({
                          headerShowLogo: true,
                          headerShowCompany: true,
                          headerShowTagline: true,
                          headerShowPrimaryContact: true,
                          headerShowSecondaryContact: true,
                          headerShowAddress: true,
                          headerShowDigital: true,
                        })
                      }
                      className="text-[#1E40AF] hover:underline cursor-pointer"
                    >
                      All On
                    </button>
                    <span className="text-slate-300">/</span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateLetterhead({
                          headerShowLogo: false,
                          headerShowCompany: false,
                          headerShowTagline: false,
                          headerShowPrimaryContact: false,
                          headerShowSecondaryContact: false,
                          headerShowAddress: false,
                          headerShowDigital: false,
                        })
                      }
                      className="text-slate-500 hover:underline cursor-pointer"
                    >
                      All Off
                    </button>
                  </div>
                )}
              </div>
              {state.letterhead.showHeader && (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pl-4 pt-0.5">
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.headerShowLogo}
                      onChange={(e) => onUpdateLetterhead({ headerShowLogo: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Logo / Emblem
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.headerShowCompany}
                      onChange={(e) => onUpdateLetterhead({ headerShowCompany: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Business Name
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.headerShowTagline}
                      onChange={(e) => onUpdateLetterhead({ headerShowTagline: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Tagline
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.headerShowPrimaryContact}
                      onChange={(e) =>
                        onUpdateLetterhead({ headerShowPrimaryContact: e.target.checked })
                      }
                      className="accent-[#1E40AF]"
                    />
                    1st Contact
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.headerShowSecondaryContact}
                      onChange={(e) =>
                        onUpdateLetterhead({ headerShowSecondaryContact: e.target.checked })
                      }
                      className="accent-[#1E40AF]"
                    />
                    2nd Contact
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.headerShowAddress}
                      onChange={(e) => onUpdateLetterhead({ headerShowAddress: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Farm Address
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer col-span-2">
                    <input
                      type="checkbox"
                      checked={state.letterhead.headerShowDigital}
                      onChange={(e) => onUpdateLetterhead({ headerShowDigital: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Email & Website
                  </label>
                </div>
              )}
            </div>

            {/* SEPARATE FOOTER SHOW / HIDE */}
            <div className="border-t border-slate-100 pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#111318] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.letterhead.showFooterRule}
                    onChange={(e) => onUpdateLetterhead({ showFooterRule: e.target.checked })}
                    className="accent-[#1E40AF]"
                  />
                  Footer Show / Hide
                </label>
                {state.letterhead.showFooterRule && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateLetterhead({
                          footerShowCompany: true,
                          footerShowAddress: true,
                          footerShowPrimaryContact: true,
                          footerShowSecondaryContact: true,
                          footerShowDigital: true,
                        })
                      }
                      className="text-[#1E40AF] hover:underline cursor-pointer"
                    >
                      All On
                    </button>
                    <span className="text-slate-300">/</span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateLetterhead({
                          footerShowCompany: false,
                          footerShowAddress: false,
                          footerShowPrimaryContact: false,
                          footerShowSecondaryContact: false,
                          footerShowDigital: false,
                        })
                      }
                      className="text-slate-500 hover:underline cursor-pointer"
                    >
                      All Off
                    </button>
                  </div>
                )}
              </div>
              {state.letterhead.showFooterRule && (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pl-4 pt-0.5">
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.footerShowCompany}
                      onChange={(e) => onUpdateLetterhead({ footerShowCompany: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Business Name
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.footerShowAddress}
                      onChange={(e) => onUpdateLetterhead({ footerShowAddress: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Farm Address
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.footerShowPrimaryContact}
                      onChange={(e) =>
                        onUpdateLetterhead({ footerShowPrimaryContact: e.target.checked })
                      }
                      className="accent-[#1E40AF]"
                    />
                    1st Contact
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.letterhead.footerShowSecondaryContact}
                      onChange={(e) =>
                        onUpdateLetterhead({ footerShowSecondaryContact: e.target.checked })
                      }
                      className="accent-[#1E40AF]"
                    />
                    2nd Contact
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 cursor-pointer col-span-2">
                    <input
                      type="checkbox"
                      checked={state.letterhead.footerShowDigital}
                      onChange={(e) => onUpdateLetterhead({ footerShowDigital: e.target.checked })}
                      className="accent-[#1E40AF]"
                    />
                    Email & Website
                  </label>
                </div>
              )}
            </div>

            {state.letterhead.showSampleContent && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-[#111318]">
                    Correspondence Copy (On/Off)
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">Signatory</span>
                    {renderVisToggle('letterSignature')}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={labelClass}>Date</label>
                      {renderVisToggle('letterDate')}
                    </div>
                    <input
                      type="text"
                      value={state.letterhead.dateText}
                      onChange={(e) => onUpdateLetterhead({ dateText: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={labelClass}>Ref No.</label>
                      {renderVisToggle('letterRef')}
                    </div>
                    <input
                      type="text"
                      value={state.letterhead.refNumber}
                      onChange={(e) => onUpdateLetterhead({ refNumber: e.target.value })}
                      className={`${inputClass} font-studio-mono`}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Recipient</label>
                    {renderVisToggle('letterRecipient')}
                  </div>
                  <input
                    type="text"
                    value={state.letterhead.recipientName}
                    onChange={(e) => onUpdateLetterhead({ recipientName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Subject Line</label>
                    {renderVisToggle('letterSubject')}
                  </div>
                  <input
                    type="text"
                    value={state.letterhead.subjectLine}
                    onChange={(e) => onUpdateLetterhead({ subjectLine: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={labelClass}>Body Paragraphs</label>
                    {renderVisToggle('letterBody')}
                  </div>
                  <textarea
                    rows={3}
                    value={state.letterhead.bodyParagraph1}
                    onChange={(e) => onUpdateLetterhead({ bodyParagraph1: e.target.value })}
                    className={`${inputClass} mb-2`}
                  />
                  <textarea
                    rows={3}
                    value={state.letterhead.bodyParagraph2}
                    onChange={(e) => onUpdateLetterhead({ bodyParagraph2: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
