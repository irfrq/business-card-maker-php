<?php
declare(strict_types=1);
session_start();

/**
 * Pressmark Studio (PHP Edition)
 * Standalone Brand Identity & Print Stationery App
 * Generates Letterhead, Visiting Card (Front & Back), Stamp Design & Logo
 * Features: Per-text On/Off toggles, Separate Header & Footer Show/Hide with dynamic reflow
 *           (zero blank gaps), Selectable Color Themes, Multiple Designs,
 *           Approval workflow, Vector SVG, Print-Ready PDF & Editable MS Word (.doc) exports.
 */

$COLOR_THEMES = [
    'pasture-forest' => ['name' => 'Pasture Forest', 'primary' => '#143326', 'accent' => '#166534', 'stamp' => '#1E3A8A', 'stock' => 'cotton-ivory'],
    'royal-cobalt'   => ['name' => 'Royal Cobalt',   'primary' => '#0F172A', 'accent' => '#1E40AF', 'stamp' => '#1E3A8A', 'stock' => 'white'],
    'heritage-brass' => ['name' => 'Heritage Brass', 'primary' => '#1C1917', 'accent' => '#92400E', 'stamp' => '#78350F', 'stock' => 'cotton-ivory'],
    'crimson-ledger' => ['name' => 'Crimson Ledger', 'primary' => '#18181B', 'accent' => '#991B1B', 'stamp' => '#991B1B', 'stock' => 'white'],
    'emerald-meadow' => ['name' => 'Emerald Meadow', 'primary' => '#064E3B', 'accent' => '#059669', 'stamp' => '#14532D', 'stock' => 'cotton-ivory'],
    'obsidian-gold'  => ['name' => 'Obsidian Matte', 'primary' => '#111827', 'accent' => '#B45309', 'stamp' => '#18181B', 'stock' => 'obsidian'],
    'kraft-earth'    => ['name' => 'Kraft & Umber',  'primary' => '#292118', 'accent' => '#7C2D12', 'stamp' => '#7C2D12', 'stock' => 'warm-kraft'],
    'midnight-slate' => ['name' => 'Midnight Slate', 'primary' => '#0F172A', 'accent' => '#0284C7', 'stamp' => '#1E3A8A', 'stock' => 'slate-navy'],
    'plum-atelier'   => ['name' => 'Plum Atelier',   'primary' => '#1E1B4B', 'accent' => '#6D28D9', 'stamp' => '#4C1D95', 'stock' => 'white'],
    'monochrome-ink' => ['name' => 'Monochrome Ink', 'primary' => '#111111', 'accent' => '#3F3F46', 'stamp' => '#18181B', 'stock' => 'white'],
];

function getDefaultState(): array {
    return [
        'approved' => false,
        'active_tab' => 'suite',
        'theme_id' => 'pasture-forest',
        'company_name' => 'IRFAN LIVESTOCK FARM',
        'monogram' => 'ILF',
        'tagline' => 'Breeding, Dairy & Quality Livestock',
        'established_year' => '2018',
        'registration_no' => 'HAROONABAD · BWN',
        'person_name' => 'Irfan Farooq',
        'person_title' => 'Proprietor',
        'phone' => '03146067868',
        'secondary_name' => 'Abdul Rahman Farooq',
        'secondary_title' => 'Farm Operations & Business Contact',
        'secondary_phone' => '03447406461',
        'email' => 'irfanfarooq6261@gmail.com',
        'website' => 'www.irfanfarooq.com',
        'address_line1' => 'Chak 61/4.R, Haroonabad',
        'city_state' => 'Bahawalnagar, Punjab',
        'primary_color' => '#143326',
        'accent_color' => '#166534',
        'font_pairing' => 'editorial-serif',
        // Logo
        'emblem_id' => 'livestock',
        'logo_lockup' => 'horizontal',
        // Stamp (Bold business name, no owner name)
        'stamp_shape' => 'circle',
        'stamp_border' => 'double-solid',
        'stamp_top_arc' => 'IRFAN LIVESTOCK FARM',
        'stamp_bottom_arc' => 'HAROONABAD · BAHAWALNAGAR',
        'stamp_sub_label' => 'OFFICIAL FARM SEAL',
        'stamp_ink' => '#1E3A8A',
        'stamp_rotation' => -4,
        // Visiting Card
        'card_layout' => 'swiss-grid',
        'card_stock' => 'cotton-ivory',
        'card_back_style' => 'solid-accent',
        'card_livestock_bg' => true,
        // Letterhead
        'letter_layout' => 'classic-executive',
        'letter_stock' => 'white',
        'letter_livestock_bg' => true,
        'letter_watermark' => true,
        'letter_stamp_overlay' => true,
        // Separate Header Show/Hide Controls
        'show_header' => true,
        'header_show_logo' => true,
        'header_show_company' => true,
        'header_show_tagline' => true,
        'header_show_primary' => true,
        'header_show_secondary' => true,
        'header_show_address' => true,
        'header_show_digital' => true,
        // Separate Footer Show/Hide Controls
        'show_footer' => true,
        'footer_show_company' => true,
        'footer_show_address' => true,
        'footer_show_primary' => true,
        'footer_show_secondary' => true,
        'footer_show_digital' => true,
        'letter_date' => 'November 16, 2026',
        'letter_ref' => 'REF: ILF-2026-0108',
        'letter_recipient' => 'To Whom It May Concern / Business Partner',
        'letter_subject' => 'Official Business Correspondence & Livestock Supply Confirmation',
        'letter_body1' => 'This letter serves as official documentation from Irfan Livestock Farm, located at Chak 61/4.R, Haroonabad, District Bahawalnagar. All livestock, dairy stock, and breeding consignments are raised under supervised veterinary care and strict farm hygiene standards.',
        'letter_body2' => 'For supply schedules, cattle inspection visits, or commercial trade inquiries, please coordinate directly with Proprietor Irfan Farooq (03146067868) or Farm Operations & Business Contact Abdul Rahman Farooq (03447406461).',
        // Per-text On/Off visibility switches
        'vis' => [
            'company_name' => true,
            'tagline' => true,
            'established_year' => true,
            'registration_no' => true,
            'person_name' => true,
            'person_title' => true,
            'phone' => true,
            'secondary_name' => true,
            'secondary_title' => true,
            'secondary_phone' => true,
            'email' => true,
            'website' => true,
            'address' => true,
            'stamp_top_arc' => true,
            'stamp_bottom_arc' => true,
            'stamp_sub_label' => true,
            'letter_date' => true,
            'letter_ref' => true,
            'letter_recipient' => true,
            'letter_subject' => true,
            'letter_body' => true,
            'letter_signature' => true,
        ],
    ];
}

$defaults = getDefaultState();
if (!isset($_SESSION['studio_state']) || !is_array($_SESSION['studio_state'])) {
    $_SESSION['studio_state'] = $defaults;
} else {
    $_SESSION['studio_state'] = array_merge($defaults, $_SESSION['studio_state']);
    $_SESSION['studio_state']['vis'] = array_merge($defaults['vis'], $_SESSION['studio_state']['vis'] ?? []);
}

$state = $_SESSION['studio_state'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'save';

    if ($action === 'reset') {
        $state = getDefaultState();
    } elseif ($action === 'toggle_approve') {
        $state['approved'] = !$state['approved'];
    } elseif ($action === 'vis_all_on') {
        foreach (array_keys($state['vis']) as $vk) {
            $state['vis'][$vk] = true;
        }
    } elseif ($action === 'vis_all_off') {
        foreach (array_keys($state['vis']) as $vk) {
            $state['vis'][$vk] = false;
        }
    } elseif ($action === 'apply_theme') {
        $tid = $_POST['theme_id'] ?? 'pasture-forest';
        if (isset($COLOR_THEMES[$tid])) {
            $t = $COLOR_THEMES[$tid];
            $state['theme_id'] = $tid;
            $state['primary_color'] = $t['primary'];
            $state['accent_color'] = $t['accent'];
            $state['stamp_ink'] = $t['stamp'];
            $state['card_stock'] = $t['stock'];
        }
    } else {
        $textKeys = [
            'active_tab', 'company_name', 'monogram', 'tagline', 'established_year',
            'registration_no', 'person_name', 'person_title', 'phone',
            'secondary_name', 'secondary_title', 'secondary_phone',
            'email', 'website', 'address_line1', 'city_state',
            'primary_color', 'accent_color', 'font_pairing',
            'emblem_id', 'logo_lockup',
            'stamp_shape', 'stamp_border', 'stamp_top_arc', 'stamp_bottom_arc', 'stamp_sub_label', 'stamp_ink',
            'card_layout', 'card_stock', 'card_back_style',
            'letter_layout', 'letter_stock', 'letter_date', 'letter_ref', 'letter_recipient', 'letter_subject',
            'letter_body1', 'letter_body2',
        ];
        foreach ($textKeys as $k) {
            if (isset($_POST[$k])) {
                $state[$k] = trim((string)$_POST[$k]);
            }
        }
        $state['stamp_rotation'] = (int)($_POST['stamp_rotation'] ?? $state['stamp_rotation']);
        $boolKeys = [
            'card_livestock_bg', 'letter_livestock_bg', 'letter_watermark', 'letter_stamp_overlay',
            'show_header', 'header_show_logo', 'header_show_company', 'header_show_tagline',
            'header_show_primary', 'header_show_secondary', 'header_show_address', 'header_show_digital',
            'show_footer', 'footer_show_company', 'footer_show_address',
            'footer_show_primary', 'footer_show_secondary', 'footer_show_digital',
        ];
        foreach ($boolKeys as $bk) {
            $state[$bk] = isset($_POST[$bk]);
        }

        foreach (array_keys($state['vis']) as $vk) {
            $state['vis'][$vk] = isset($_POST['vis_' . $vk]);
        }
        if (isset($_POST['theme_id']) && isset($COLOR_THEMES[$_POST['theme_id']]) && $_POST['theme_id'] !== $state['theme_id']) {
            $t = $COLOR_THEMES[$_POST['theme_id']];
            $state['theme_id'] = $_POST['theme_id'];
            $state['primary_color'] = $t['primary'];
            $state['accent_color'] = $t['accent'];
            $state['stamp_ink'] = $t['stamp'];
        }
    }

    $_SESSION['studio_state'] = $state;
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

if (isset($_GET['tab'])) {
    $state['active_tab'] = $_GET['tab'];
    $_SESSION['studio_state'] = $state;
}

function esc(string $v): string {
    return htmlspecialchars($v, ENT_QUOTES | ENT_XML1, 'UTF-8');
}

function getFontFamily(string $pairing): array {
    return match ($pairing) {
        'editorial-serif' => ['display' => 'Georgia, "Times New Roman", serif', 'body' => 'Arial, Helvetica, sans-serif'],
        'technical-mono'  => ['display' => '"Courier New", monospace', 'body' => 'Arial, Helvetica, sans-serif'],
        default           => ['display' => 'Arial, Helvetica, sans-serif', 'body' => 'Arial, Helvetica, sans-serif'],
    };
}

function renderEmblemGroup(string $emblemId, string $primary, string $accent, float $x, float $y, float $size): string {
    $scale = $size / 64.0;
    $inner = match ($emblemId) {
        'barn' => '<path d="M10 52V30L20 18L32 10L44 18L54 30V52H10Z" stroke="' . $primary . '" stroke-width="2.2"/><rect x="23" y="34" width="18" height="18" stroke="' . $accent . '" stroke-width="2"/><circle cx="32" cy="23" r="3.5" stroke="' . $primary . '" stroke-width="1.6"/>',
        'wheat' => '<circle cx="32" cy="32" r="24" stroke="' . $primary . '" stroke-width="2"/><line x1="32" y1="12" x2="32" y2="52" stroke="' . $accent . '" stroke-width="2"/><path d="M32 22C25 22 22 17 22 14C26 14 31 17 32 22ZM32 22C39 22 42 17 42 14C38 14 33 17 32 22ZM32 34C24 34 20 29 20 25C25 25 31 28 32 34ZM32 34C40 34 44 29 44 25C39 25 33 28 32 34Z" stroke="' . $primary . '" stroke-width="1.7"/>',
        'shield' => '<path d="M13 14H51V31C51 44 32 55 32 55C32 55 13 44 13 31V14Z" stroke="' . $primary . '" stroke-width="2.2"/><path d="M20 21H44V31C44 39.5 32 47 32 47C32 47 20 39.5 20 31V21Z" stroke="' . $accent . '" stroke-width="1.7"/>',
        default => '<circle cx="32" cy="32" r="25" stroke="' . $primary . '" stroke-width="2.1"/><path d="M11 42C18 39 25 38 32 38C39 38 46 39 53 42" stroke="' . $accent . '" stroke-width="1.7"/><path d="M16 17C16 22 20 24 23 24L22 33C22 37 26 40 32 40C38 40 42 37 42 33L41 24C44 24 48 22 48 17C46 19.5 43 20.5 39 20.5L32 21.5L25 20.5C21 20.5 18 19.5 16 17Z" fill="' . $primary . '" fill-opacity="0.12" stroke="' . $primary . '" stroke-width="2"/><path d="M23 48L32 45L41 48" stroke="' . $accent . '" stroke-width="1.6"/>',
    };
    return '<g transform="translate(' . $x . ',' . $y . ') scale(' . $scale . ')" fill="none" stroke-linecap="round" stroke-linejoin="round">' . $inner . '</g>';
}

function renderLivestockHerd(float $x, float $y, float $width, string $color, float $opacity = 0.06): string {
    $scale = $width / 520.0;
    return '<g transform="translate(' . $x . ',' . $y . ') scale(' . $scale . ')" opacity="' . $opacity . '" fill="' . $color . '">'
        . '<path d="M0 158 Q 130 144 260 156 T 520 152 L 520 166 L 0 166 Z" fill-opacity="0.45"/>'
        . '<path d="M132 154 L132 126 L124 128 L120 118 L126 104 L118 98 L121 94 L129 98 L136 90 L144 92 L152 86 L160 88 L156 96 L186 96 C206 96 222 92 238 96 L248 102 L252 132 L248 154 L241 154 L242 132 L233 132 L231 154 L224 154 L225 128 C210 132 186 132 170 128 L166 154 L159 154 L160 128 L148 128 L145 154 L138 154 L140 128 L132 154 Z"/>'
        . '<path d="M294 154 L297 132 L284 142 L276 146 L273 141 L282 128 L292 114 C304 102 324 100 344 102 L366 104 L374 114 L376 136 L372 154 L365 154 L366 134 L356 134 L353 154 L346 154 L348 130 C334 133 316 132 308 130 L304 154 L294 154 Z"/>'
        . '<path d="M402 154 L404 134 L396 132 L392 122 L399 114 L406 116 L414 118 L438 118 L446 124 L448 140 L445 154 L440 154 L440 138 L433 138 L431 154 L426 154 L427 136 L412 136 L410 154 L402 154 Z"/>'
        . '</g>';
}

function renderLogoSvg(array $s): string {
    $fonts = getFontFamily($s['font_pairing']);
    $p = esc($s['primary_color']);
    $a = esc($s['accent_color']);
    $vis = $s['vis'];
    $comp = $vis['company_name'] ? esc($s['company_name']) : '';
    $tag = $vis['tagline'] ? esc(strtoupper($s['tagline'])) : '';
    $est = $vis['established_year'] && $s['established_year'] !== '' ? 'EST. ' . esc($s['established_year']) : '';

    $inner = '';
    if ($s['logo_lockup'] === 'stacked') {
        $textH = ($comp ? 42 : 0) + ($tag ? 28 : 0) + ($est ? 26 : 0);
        $totalH = 116 + ($textH > 0 ? 22 + $textH : 0);
        $cy = 240 - $totalH / 2;
        $inner .= renderEmblemGroup($s['emblem_id'], $p, $a, 342, $cy, 116);
        $cy += 116;
        if ($comp) {
            $cy += 42;
            $inner .= '<text x="400" y="' . $cy . '" text-anchor="middle" fill="' . $p . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="32" letter-spacing="4">' . $comp . '</text>';
        }
        if ($tag) {
            $cy += ($comp ? 32 : 38);
            $inner .= '<text x="400" y="' . $cy . '" text-anchor="middle" fill="#64748B" font-family="' . $fonts['body'] . '" font-size="13" letter-spacing="3">' . $tag . '</text>';
        }
        if ($est) {
            $cy += ($comp || $tag ? 30 : 38);
            $inner .= '<text x="400" y="' . $cy . '" text-anchor="middle" fill="' . $a . '" font-family="monospace" font-size="12" letter-spacing="3">' . $est . '</text>';
        }
    } elseif ($s['logo_lockup'] === 'badge') {
        $inner .= '<rect x="160" y="64" width="480" height="352" rx="14" fill="none" stroke="' . $p . '" stroke-width="2.5"/>';
        $inner .= '<rect x="170" y="74" width="460" height="332" rx="10" fill="none" stroke="' . $a . '" stroke-width="1"/>';
        $textH = ($comp ? 42 : 0) + ($tag ? 28 : 0) + ($est ? 32 : 0);
        $totalH = 104 + ($textH > 0 ? 18 + $textH : 0);
        $cy = 240 - $totalH / 2;
        $inner .= renderEmblemGroup($s['emblem_id'], $p, $a, 348, $cy, 104);
        $cy += 104;
        if ($comp) {
            $cy += 40;
            $inner .= '<text x="400" y="' . $cy . '" text-anchor="middle" fill="' . $p . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="30" letter-spacing="3">' . $comp . '</text>';
        }
        if ($tag) {
            $cy += ($comp ? 30 : 38);
            $inner .= '<text x="400" y="' . $cy . '" text-anchor="middle" fill="#64748B" font-family="' . $fonts['body'] . '" font-size="12" letter-spacing="2.5">' . $tag . '</text>';
        }
        if ($est) {
            $cy += ($comp || $tag ? 34 : 38);
            $inner .= '<text x="400" y="' . $cy . '" text-anchor="middle" fill="' . $a . '" font-family="monospace" font-size="12" letter-spacing="3">' . $est . '</text>';
        }
    } elseif ($s['logo_lockup'] === 'emblem') {
        $inner .= renderEmblemGroup($s['emblem_id'], $p, $a, 304, 144, 192);
    } elseif ($s['logo_lockup'] === 'wordmark') {
        if ($comp && $tag) {
            $inner .= '<text x="400" y="232" text-anchor="middle" fill="' . $p . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="38" letter-spacing="4">' . $comp . '</text>';
            $inner .= '<text x="400" y="274" text-anchor="middle" fill="#64748B" font-family="' . $fonts['body'] . '" font-size="13" letter-spacing="3">' . $tag . '</text>';
        } elseif ($comp) {
            $inner .= '<text x="400" y="252" text-anchor="middle" fill="' . $p . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="38" letter-spacing="4">' . $comp . '</text>';
        } elseif ($tag) {
            $inner .= '<text x="400" y="245" text-anchor="middle" fill="#64748B" font-family="' . $fonts['body'] . '" font-size="15" letter-spacing="3">' . $tag . '</text>';
        }
    } else {
        if (!$comp && !$tag) {
            $inner .= renderEmblemGroup($s['emblem_id'], $p, $a, 342, 182, 116);
        } else {
            $inner .= renderEmblemGroup($s['emblem_id'], $p, $a, 120, 192, 96);
            $inner .= '<line x1="242" y1="202" x2="242" y2="278" stroke="#CBD5E1" stroke-width="1.5"/>';
            if ($comp && $tag) {
                $inner .= '<text x="270" y="236" fill="' . $p . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="30" letter-spacing="3">' . $comp . '</text>';
                $inner .= '<text x="272" y="268" fill="#64748B" font-family="' . $fonts['body'] . '" font-size="12.5" letter-spacing="2.5">' . $tag . '</text>';
            } elseif ($comp) {
                $inner .= '<text x="270" y="250" fill="' . $p . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="30" letter-spacing="3">' . $comp . '</text>';
            } else {
                $inner .= '<text x="270" y="245" fill="#64748B" font-family="' . $fonts['body'] . '" font-size="14" letter-spacing="2.5">' . $tag . '</text>';
            }
        }
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="800" height="480"><rect width="800" height="480" fill="#FFFFFF"/>' . $inner . '</svg>';
}

function renderStampSvg(array $s, bool $transparent = true): string {
    $ink = esc($s['stamp_ink']);
    $vis = $s['vis'];
    $top = $vis['stamp_top_arc'] ? esc(strtoupper($s['stamp_top_arc'])) : '';
    $bot = $vis['stamp_bottom_arc'] ? esc(strtoupper($s['stamp_bottom_arc'])) : '';
    $sub = $vis['stamp_sub_label'] ? esc(strtoupper($s['stamp_sub_label'])) : '';
    $uid = substr(md5($top . $bot . $s['stamp_shape']), 0, 8);
    $rot = (int)$s['stamp_rotation'];
    $bg = $transparent ? '' : '<rect width="480" height="480" fill="#FFFFFF"/>';
    $dash = $s['stamp_border'] === 'dashed-inner' ? 'stroke-dasharray="6 4"' : '';

    $defs = '<defs>'
        . '<path id="t-' . $uid . '" d="M 94,240 A 146,146 0 1,1 386,240"/>'
        . '<path id="b-' . $uid . '" d="M 80,246 A 160,160 0 0,0 400,246"/>'
        . '</defs>';

    $body = '';
    if ($s['stamp_shape'] === 'rectangle') {
        $body .= '<rect x="38" y="114" width="404" height="252" rx="4" fill="none" stroke="' . $ink . '" stroke-width="4.5"/>'
            . '<rect x="49" y="125" width="382" height="230" fill="none" stroke="' . $ink . '" stroke-width="1.5" ' . $dash . '/>';
        if ($top) {
            $body .= '<text x="240" y="162" text-anchor="middle" fill="' . $ink . '" font-family="Arial, sans-serif" font-weight="800" font-size="17" letter-spacing="2.5">' . $top . '</text>'
                . '<line x1="68" y1="178" x2="412" y2="178" stroke="' . $ink . '" stroke-width="1.8"/>';
        }
        if ($bot) {
            $body .= '<line x1="68" y1="304" x2="412" y2="304" stroke="' . $ink . '" stroke-width="1.8"/>'
                . '<text x="240" y="334" text-anchor="middle" fill="' . $ink . '" font-family="monospace" font-weight="700" font-size="13.5" letter-spacing="2">' . $bot . '</text>';
        }
    } elseif ($s['stamp_shape'] === 'shield') {
        $body .= '<path d="M68 72 H412 V248 C412 344 240 422 240 422 C240 422 68 344 68 248 V72 Z" fill="none" stroke="' . $ink . '" stroke-width="4.5"/>'
            . '<path d="M82 86 H398 V244 C398 331 240 404 240 404 C240 404 82 331 82 244 V86 Z" fill="none" stroke="' . $ink . '" stroke-width="1.5" ' . $dash . '/>';
        if ($top) {
            $body .= '<text x="240" y="128" text-anchor="middle" fill="' . $ink . '" font-family="Arial, sans-serif" font-weight="800" font-size="16" letter-spacing="2">' . $top . '</text>'
                . '<line x1="96" y1="144" x2="384" y2="144" stroke="' . $ink . '" stroke-width="1.8"/>';
        }
        if ($bot) $body .= '<text x="240" y="340" text-anchor="middle" fill="' . $ink . '" font-family="monospace" font-weight="700" font-size="11.5" letter-spacing="1.5">' . $bot . '</text>';
    } else {
        $ry1 = $s['stamp_shape'] === 'oval' ? 140 : 196;
        $rx1 = $s['stamp_shape'] === 'oval' ? 212 : 196;
        $ry2 = $s['stamp_shape'] === 'oval' ? 82 : 120;
        $rx2 = $s['stamp_shape'] === 'oval' ? 144 : 120;
        $body .= '<ellipse cx="240" cy="240" rx="' . $rx1 . '" ry="' . $ry1 . '" fill="none" stroke="' . $ink . '" stroke-width="4.5"/>'
            . '<ellipse cx="240" cy="240" rx="' . ($rx1 - 10) . '" ry="' . ($ry1 - 10) . '" fill="none" stroke="' . $ink . '" stroke-width="1.4"/>'
            . '<ellipse cx="240" cy="240" rx="' . $rx2 . '" ry="' . $ry2 . '" fill="none" stroke="' . $ink . '" stroke-width="2.4" ' . $dash . '/>';
        if ($top) $body .= '<text fill="' . $ink . '" font-family="Arial, sans-serif" font-weight="800" font-size="18.5" letter-spacing="2.5"><textPath href="#t-' . $uid . '" startOffset="50%" text-anchor="middle">' . $top . '</textPath></text>';
        if ($bot) $body .= '<text fill="' . $ink . '" font-family="Arial, sans-serif" font-weight="700" font-size="15.5" letter-spacing="2"><textPath href="#b-' . $uid . '" startOffset="50%" text-anchor="middle">' . $bot . '</textPath></text>';
    }

    $emblemY = $sub ? 186 : 198;
    $body .= renderEmblemGroup($s['emblem_id'], $ink, $ink, 198, $emblemY, 84);
    if ($sub) {
        $body .= '<text x="240" y="296" text-anchor="middle" fill="' . $ink . '" font-family="monospace" font-weight="700" font-size="12" letter-spacing="2">' . $sub . '</text>';
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480">' . $defs . $bg . '<g transform="rotate(' . $rot . ',240,240)">' . $body . '</g></svg>';
}

function renderVisitingCardSvg(array $s, string $side = 'front'): string {
    $fonts = getFontFamily($s['font_pairing']);
    $vis = $s['vis'];
    $p = esc($s['primary_color']);
    $a = esc($s['accent_color']);
    $bgMap = ['cotton-ivory' => '#FAF8F3', 'warm-kraft' => '#EAE2D3', 'obsidian' => '#14161B', 'slate-navy' => '#0F172A', 'white' => '#FFFFFF'];
    $bg = $bgMap[$s['card_stock']] ?? '#FFFFFF';
    $isDark = in_array($s['card_stock'], ['obsidian', 'slate-navy'], true);
    $ink = $isDark ? '#F8FAFC' : $p;
    $muted = $isDark ? '#94A3B8' : '#52525B';
    $rule = $isDark ? '#2A2E39' : '#E2E8F0';
    $accent = $isDark ? '#60A5FA' : $a;

    $comp = $vis['company_name'] ? esc($s['company_name']) : '';
    $tag = $vis['tagline'] ? esc(strtoupper($s['tagline'])) : '';
    $reg = $vis['registration_no'] ? esc($s['registration_no']) : '';
    $pname = $vis['person_name'] ? esc($s['person_name']) : '';
    $ptitle = $vis['person_title'] ? esc(strtoupper($s['person_title'])) : '';
    $phone = $vis['phone'] ? esc($s['phone']) : '';
    $sname = $vis['secondary_name'] ? esc($s['secondary_name']) : '';
    $stitle = $vis['secondary_title'] ? esc(strtoupper($s['secondary_title'])) : '';
    $sphone = $vis['secondary_phone'] ? esc($s['secondary_phone']) : '';
    $email = $vis['email'] ? esc($s['email']) : '';
    $web = $vis['website'] ? esc($s['website']) : '';
    $addr1 = $vis['address'] ? esc($s['address_line1']) : '';
    $city = $vis['address'] ? esc($s['city_state']) : '';
    $fullAddr = trim($addr1 . ($addr1 && $city ? ', ' : '') . $city);

    $pMeta = trim($ptitle . ($ptitle && $phone ? ' · ' : '') . $phone);
    $sMeta = trim($stitle . ($stitle && $sphone ? ' · ' : '') . $sphone);

    if ($side === 'back') {
        $solid = $s['card_back_style'] === 'solid-accent';
        $bBg = $solid ? $p : $bg;
        $bInk = $solid ? '#FFFFFF' : $ink;
        $bMuted = $solid ? 'rgba(255,255,255,0.75)' : $muted;
        $herd = $s['card_livestock_bg'] ? renderLivestockHerd(165, 385, 720, $bInk, $solid ? 0.08 : 0.055) : '';
        $showEmb = $s['card_back_style'] !== 'minimal-wordmark';
        $textH = ($comp ? 38 : 0) + ($tag ? 26 : 0);
        $centerH = ($showEmb ? 128 : 0) + ($showEmb && $textH > 0 ? 28 : 0) + $textH;
        $cy = ($fullAddr ? 268 : 300) - $centerH / 2;
        $txt = '';
        if ($showEmb) {
            $txt .= renderEmblemGroup($s['emblem_id'], $bInk, $solid ? '#FFFFFF' : $accent, 461, $cy, 128);
            $cy += 128;
        }
        if ($comp) {
            $cy += ($showEmb ? 42 : 24);
            $txt .= '<text x="525" y="' . $cy . '" text-anchor="middle" fill="' . $bInk . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="28" letter-spacing="4">' . $comp . '</text>';
        }
        if ($tag) {
            $cy += ($comp ? 32 : ($showEmb ? 38 : 16));
            $txt .= '<text x="525" y="' . $cy . '" text-anchor="middle" fill="' . $bMuted . '" font-family="' . $fonts['body'] . '" font-size="13" letter-spacing="3">' . $tag . '</text>';
        }
        if ($fullAddr) {
            $txt .= '<text x="525" y="554" text-anchor="middle" fill="' . $bMuted . '" font-family="monospace" font-size="14">' . $fullAddr . '</text>';
        }
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 600" width="1050" height="600"><rect width="1050" height="600" fill="' . $bBg . '"/>' . $herd . $txt . '</svg>';
    }

    $herd = $s['card_livestock_bg'] ? renderLivestockHerd(460, 405, 560, $ink, $isDark ? 0.08 : 0.055) : '';
    $content = '';

    if ($s['card_layout'] === 'editorial-split' || $s['card_layout'] === 'diagonal-ribbon') {
        $shape = $s['card_layout'] === 'diagonal-ribbon'
            ? '<polygon points="0,0 462,0 294,600 0,600" fill="' . $p . '"/>'
            : '<rect x="0" y="0" width="368" height="600" fill="' . $p . '"/>';
        $leftCenterX = $s['card_layout'] === 'diagonal-ribbon' ? 168 : 184;
        $leftHasText = ($comp !== '' || $tag !== '');
        $embY = $leftHasText ? 120 : 252;
        $content .= $shape . renderEmblemGroup($s['emblem_id'], '#FFFFFF', '#FFFFFF', $leftCenterX - 48, $embY, 96);
        $lY = $embY + 136;
        if ($comp) {
            $content .= '<text x="' . $leftCenterX . '" y="' . $lY . '" text-anchor="middle" fill="#FFFFFF" font-family="' . $fonts['display'] . '" font-weight="700" font-size="20" letter-spacing="2">' . $comp . '</text>';
            $lY += 28;
        }
        if ($tag) {
            $content .= '<text x="' . $leftCenterX . '" y="' . $lY . '" text-anchor="middle" fill="#CBD5E1" font-family="' . $fonts['body'] . '" font-size="11">' . $tag . '</text>';
        }

        // Dynamic Right Stack
        $ry = 110;
        if ($pname || $pMeta) {
            if ($pname) {
                $content .= '<text x="424" y="' . $ry . '" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="32">' . $pname . '</text>';
                $ry += 30;
            }
            if ($pMeta) {
                $content .= '<text x="424" y="' . $ry . '" fill="' . $accent . '" font-family="' . $fonts['body'] . '" font-weight="700" font-size="13.5">' . $pMeta . '</text>';
                $ry += 28;
            }
            $ry += 22;
        }
        if ($sname || $sMeta) {
            if ($sname) {
                $content .= '<text x="424" y="' . $ry . '" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="24">' . $sname . '</text>';
                $ry += 26;
            }
            if ($sMeta) {
                $content .= '<text x="424" y="' . $ry . '" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-weight="600" font-size="12">' . $sMeta . '</text>';
                $ry += 24;
            }
        }
        $hasContactBlock = ($pname || $pMeta || $sname || $sMeta);
        $hasDigital = ($email !== '' || $web !== '');
        if ($hasContactBlock && ($hasDigital || $fullAddr)) {
            $ry += 12;
            $content .= '<line x1="424" y1="' . $ry . '" x2="986" y2="' . $ry . '" stroke="' . $rule . '" stroke-width="1.5"/>';
            $ry += 38;
        }
        if ($email) {
            $content .= '<text x="424" y="' . $ry . '" fill="' . $ink . '" font-family="' . $fonts['body'] . '" font-size="15.5">' . $email . '</text>';
            $ry += 30;
        }
        if ($web) {
            $content .= '<text x="424" y="' . $ry . '" fill="' . $accent . '" font-family="' . $fonts['body'] . '" font-size="15.5">' . $web . '</text>';
        }
        if ($fullAddr) {
            $content .= '<text x="424" y="534" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="14.5">' . $fullAddr . '</text>';
        }
    } elseif ($s['card_layout'] === 'pastoral-horizon') {
        $content .= '<rect x="0" y="0" width="1050" height="198" fill="' . $p . '"/>'
            . '<rect x="0" y="198" width="1050" height="7" fill="' . $accent . '"/>'
            . renderEmblemGroup($s['emblem_id'], '#FFFFFF', '#FFFFFF', 56, 52, 92);
        if ($comp && $tag) {
            $content .= '<text x="168" y="94" fill="#FFFFFF" font-family="' . $fonts['display'] . '" font-weight="700" font-size="30" letter-spacing="3">' . $comp . '</text>'
                . '<text x="168" y="128" fill="#CBD5E1" font-family="' . $fonts['body'] . '" font-size="12" letter-spacing="2.2">' . $tag . '</text>';
        } elseif ($comp) {
            $content .= '<text x="168" y="108" fill="#FFFFFF" font-family="' . $fonts['display'] . '" font-weight="700" font-size="30" letter-spacing="3">' . $comp . '</text>';
        } elseif ($tag) {
            $content .= '<text x="168" y="104" fill="#CBD5E1" font-family="' . $fonts['body'] . '" font-size="13" letter-spacing="2.2">' . $tag . '</text>';
        }
        if ($reg) $content .= '<text x="986" y="104" text-anchor="end" fill="#E2E8F0" font-family="monospace" font-size="12.5">' . $reg . '</text>';

        $ly = 274;
        if ($pname || $pMeta) {
            if ($pname) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="28">' . $pname . '</text>';
                $ly += 28;
            }
            if ($pMeta) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $accent . '" font-family="' . $fonts['body'] . '" font-weight="700" font-size="13.5">' . $pMeta . '</text>';
                $ly += 24;
            }
            $ly += 26;
        }
        if ($sname || $sMeta) {
            if ($sname) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="22">' . $sname . '</text>';
                $ly += 25;
            }
            if ($sMeta) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-weight="600" font-size="12">' . $sMeta . '</text>';
            }
        }
        $dy = 278;
        if ($email) {
            $content .= '<text x="986" y="' . $dy . '" text-anchor="end" fill="' . $ink . '" font-family="' . $fonts['body'] . '" font-size="15">' . $email . '</text>';
            $dy += 30;
        }
        if ($web) {
            $content .= '<text x="986" y="' . $dy . '" text-anchor="end" fill="' . $accent . '" font-family="monospace" font-size="14">' . $web . '</text>';
        }
        if ($fullAddr) $content .= '<text x="64" y="544" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="14">' . $fullAddr . '</text>';
    } elseif ($s['card_layout'] === 'monogram-crest' || $s['card_layout'] === 'architectural-frame') {
        $content .= '<rect x="28" y="28" width="994" height="544" fill="none" stroke="' . $accent . '" stroke-width="' . ($s['card_layout'] === 'architectural-frame' ? '2.5' : '1.2') . '"/>'
            . '<rect x="38" y="38" width="974" height="524" fill="none" stroke="' . $rule . '" stroke-width="1"/>';
        $cy = 62;
        $content .= renderEmblemGroup($s['emblem_id'], $ink, $accent, 480, $cy, 88);
        $cy += 98;
        if ($comp) {
            $cy += 24;
            $content .= '<text x="525" y="' . $cy . '" text-anchor="middle" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="26" letter-spacing="3">' . $comp . '</text>';
        }
        if ($tag) {
            $cy += 26;
            $content .= '<text x="525" y="' . $cy . '" text-anchor="middle" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="11.5" letter-spacing="2">' . $tag . '</text>';
        }
        $hasContact = ($pname || $pMeta || $sname || $sMeta || $email || $web);
        if ($hasContact) {
            $cy += 22;
            $content .= '<line x1="220" y1="' . $cy . '" x2="830" y2="' . $cy . '" stroke="' . $rule . '" stroke-width="1.2"/>';
            $cy += 42;
        }
        if ($pname) {
            $content .= '<text x="525" y="' . $cy . '" text-anchor="middle" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="28">' . $pname . '</text>';
            $cy += 30;
        }
        if ($pMeta) {
            $content .= '<text x="525" y="' . $cy . '" text-anchor="middle" fill="' . $accent . '" font-family="' . $fonts['body'] . '" font-weight="700" font-size="13.5">' . $pMeta . '</text>';
            $cy += 34;
        }
        $secFull = trim($sname . ($stitle ? ($sname ? ' (' . $stitle . ')' : $stitle) : '') . ($sphone ? ' · ' . $sphone : ''));
        if ($secFull) {
            $content .= '<text x="525" y="' . $cy . '" text-anchor="middle" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="13">' . $secFull . '</text>';
            $cy += 42;
        }
        if ($email || $web) {
            $content .= '<text x="525" y="' . $cy . '" text-anchor="middle" fill="' . $ink . '" font-family="monospace" font-size="13.5">' . trim($email . ($email && $web ? '   |   ' : '') . $web) . '</text>';
        }
        if ($fullAddr) $content .= '<text x="525" y="520" text-anchor="middle" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="13.5">' . $fullAddr . '</text>';
    } elseif ($s['card_layout'] === 'executive-minimal') {
        $content .= renderEmblemGroup($s['emblem_id'], $ink, $accent, 74, 70, 72);
        if ($comp && $tag) {
            $content .= '<text x="164" y="102" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="22" letter-spacing="3">' . $comp . '</text>';
            $content .= '<text x="164" y="128" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="11" letter-spacing="2">' . $tag . '</text>';
        } elseif ($comp) {
            $content .= '<text x="164" y="114" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="22" letter-spacing="3">' . $comp . '</text>';
        } elseif ($tag) {
            $content .= '<text x="164" y="112" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="12" letter-spacing="2">' . $tag . '</text>';
        }
        $my = 278;
        if ($pname) {
            $content .= '<text x="74" y="' . $my . '" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="34">' . $pname . '</text>';
            $my += 34;
        }
        if ($pMeta) {
            $content .= '<text x="74" y="' . $my . '" fill="' . $accent . '" font-family="' . $fonts['body'] . '" font-weight="700" font-size="14">' . $pMeta . '</text>';
            $my += 34;
        }
        $secSummary = trim($sname . ($stitle ? ' · ' . $stitle : '') . ($sphone ? ' · ' . $sphone : ''));
        if ($secSummary) {
            $content .= '<text x="74" y="' . $my . '" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="13.5">' . $secSummary . '</text>';
        }
        $by = 524;
        if ($web) {
            $content .= '<text x="74" y="' . $by . '" fill="' . $accent . '" font-family="monospace" font-size="13">' . $web . '</text>';
            $by -= 26;
        }
        if ($email) {
            $content .= '<text x="74" y="' . $by . '" fill="' . $ink . '" font-family="monospace" font-size="13">' . $email . '</text>';
        }
        if ($fullAddr) $content .= '<text x="976" y="524" text-anchor="end" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="13">' . $fullAddr . '</text>';
    } else {
        // Swiss Grid (dynamic right rows & dynamic left column)
        $content .= '<rect x="0" y="0" width="1050" height="10" fill="' . $accent . '"/>';
        $content .= renderEmblemGroup($s['emblem_id'], $ink, $accent, 64, 50, 62);
        if ($comp && $tag) {
            $content .= '<text x="144" y="79" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="24" letter-spacing="3">' . $comp . '</text>';
            $content .= '<text x="144" y="104" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="11.5" letter-spacing="2">' . $tag . '</text>';
        } elseif ($comp) {
            $content .= '<text x="144" y="88" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="24" letter-spacing="3">' . $comp . '</text>';
        } elseif ($tag) {
            $content .= '<text x="144" y="86" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="12" letter-spacing="2">' . $tag . '</text>';
        }
        if ($reg) $content .= '<text x="986" y="82" text-anchor="end" fill="' . $muted . '" font-family="monospace" font-size="12.5">' . $reg . '</text>';

        $rRows = [];
        if ($phone) $rRows[] = ['label' => 'MOBILE', 'val' => $phone, 'color' => $ink, 'mono' => true, 'sub' => ''];
        if ($email) $rRows[] = ['label' => 'EMAIL', 'val' => $email, 'color' => $ink, 'mono' => false, 'sub' => ''];
        if ($web) $rRows[] = ['label' => 'WEB', 'val' => $web, 'color' => $accent, 'mono' => true, 'sub' => ''];
        if ($fullAddr) $rRows[] = ['label' => 'FARM', 'val' => $addr1 ?: $city, 'color' => $ink, 'mono' => false, 'sub' => ($addr1 && $city ? $city : '')];

        $content .= '<line x1="64" y1="148" x2="986" y2="148" stroke="' . $rule . '" stroke-width="1.5"/>';
        if (count($rRows) > 0) {
            $content .= '<line x1="514" y1="148" x2="514" y2="554" stroke="' . $rule . '" stroke-width="1.5"/>';
        }

        $ly = 202;
        $hasPrimary = ($pname !== '' || $ptitle !== '' || $phone !== '');
        if ($hasPrimary) {
            if ($pname) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="28">' . $pname . '</text>';
                $ly += 26;
            }
            if ($ptitle) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $accent . '" font-family="' . $fonts['body'] . '" font-weight="700" font-size="13">' . $ptitle . '</text>';
                $ly += 24;
            }
            if ($phone) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $ink . '" font-family="monospace" font-size="14">' . $phone . '</text>';
                $ly += 22;
            }
        }
        $hasSecondary = ($sname !== '' || $stitle !== '' || $sphone !== '');
        if ($hasSecondary) {
            if ($hasPrimary) {
                $ly += 12;
                $content .= '<line x1="64" y1="' . $ly . '" x2="480" y2="' . $ly . '" stroke="' . $rule . '" stroke-width="1"/>';
                $ly += 36;
            }
            if ($sname) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $ink . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="23">' . $sname . '</text>';
                $ly += 24;
            }
            if ($stitle) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-weight="600" font-size="11.5">' . $stitle . '</text>';
                $ly += 22;
            }
            if ($sphone) {
                $content .= '<text x="64" y="' . $ly . '" fill="' . $ink . '" font-family="monospace" font-size="14">' . $sphone . '</text>';
            }
        }
        if ($fullAddr) $content .= '<text x="64" y="540" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="13.5">' . $fullAddr . '</text>';

        $rowStep = count($rRows) <= 2 ? 78 : (count($rRows) === 3 ? 68 : 62);
        $ry = 208;
        foreach ($rRows as $idx => $rw) {
            $fontStr = $rw['mono'] ? 'monospace' : $fonts['body'];
            $content .= '<text x="548" y="' . $ry . '" fill="' . $muted . '" font-family="monospace" font-size="11.5">' . $rw['label'] . '</text>';
            $content .= '<text x="620" y="' . $ry . '" fill="' . $rw['color'] . '" font-family="' . $fontStr . '" font-size="14.2">' . $rw['val'] . '</text>';
            if ($rw['sub']) {
                $content .= '<text x="620" y="' . ($ry + 22) . '" fill="' . $muted . '" font-family="' . $fonts['body'] . '" font-size="13.5">' . $rw['sub'] . '</text>';
            }
            if ($idx < count($rRows) - 1) {
                $lineY = $ry + 24;
                $content .= '<line x1="548" y1="' . $lineY . '" x2="986" y2="' . $lineY . '" stroke="' . $rule . '" stroke-width="1"/>';
            }
            $ry += $rowStep;
        }
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 600" width="1050" height="600"><rect width="1050" height="600" fill="' . $bg . '"/>' . $herd . $content . '</svg>';
}

function renderLetterheadSvg(array $s): string {
    $fonts = getFontFamily($s['font_pairing']);
    $vis = $s['vis'];
    $p = esc($s['primary_color']);
    $a = esc($s['accent_color']);
    $paperBg = $s['letter_stock'] === 'cotton-ivory' ? '#FAF8F3' : '#FFFFFF';

    $rawComp = $vis['company_name'] ? esc($s['company_name']) : '';
    $rawTag = $vis['tagline'] ? esc(strtoupper($s['tagline'])) : '';
    $rawEst = $vis['established_year'] && $s['established_year'] !== '' ? 'EST. ' . esc($s['established_year']) : '';
    $rawPname = $vis['person_name'] ? esc($s['person_name']) : '';
    $rawPtitle = $vis['person_title'] ? esc($s['person_title']) : '';
    $rawPhone = $vis['phone'] ? esc($s['phone']) : '';
    $rawSname = $vis['secondary_name'] ? esc($s['secondary_name']) : '';
    $rawStitle = $vis['secondary_title'] ? esc($s['secondary_title']) : '';
    $rawSphone = $vis['secondary_phone'] ? esc($s['secondary_phone']) : '';
    $rawEmail = $vis['email'] ? esc($s['email']) : '';
    $rawWeb = $vis['website'] ? esc($s['website']) : '';
    $rawAddr1 = $vis['address'] ? esc($s['address_line1']) : '';
    $rawCity = $vis['address'] ? esc($s['city_state']) : '';
    $rawFullAddr = trim($rawAddr1 . ($rawAddr1 && $rawCity ? ', ' : '') . $rawCity);

    $rawPLine = trim(($rawPtitle && $rawPname ? "$rawPtitle: $rawPname" : "$rawPname$rawPtitle") . ($rawPhone ? " ($rawPhone)" : ''));
    $rawSLine = trim(($rawStitle && $rawSname ? "$rawStitle: $rawSname" : "$rawSname$rawStitle") . ($rawSphone ? " ($rawSphone)" : ''));

    // Separate Header Values
    $showHdr = !empty($s['show_header']);
    $hLogo = $showHdr && !empty($s['header_show_logo']);
    $hComp = $showHdr && !empty($s['header_show_company']) ? $rawComp : '';
    $hTag = $showHdr && !empty($s['header_show_tagline']) ? $rawTag : '';
    $hPLine = $showHdr && !empty($s['header_show_primary']) ? $rawPLine : '';
    $hSLine = $showHdr && !empty($s['header_show_secondary']) ? $rawSLine : '';
    $hFullAddr = $showHdr && !empty($s['header_show_address']) ? $rawFullAddr : '';
    $hAddr1 = $showHdr && !empty($s['header_show_address']) ? $rawAddr1 : '';
    $hCity = $showHdr && !empty($s['header_show_address']) ? $rawCity : '';
    $hEmail = $showHdr && !empty($s['header_show_digital']) ? $rawEmail : '';
    $hWeb = $showHdr && !empty($s['header_show_digital']) ? $rawWeb : '';
    $hDigital = trim($hEmail . ($hEmail && $hWeb ? ' · ' : '') . $hWeb);

    // Separate Footer Values
    $showFtr = !empty($s['show_footer']);
    $fComp = $showFtr && !empty($s['footer_show_company']) ? $rawComp : '';
    $fAddr = $showFtr && !empty($s['footer_show_address']) ? $rawFullAddr : '';
    $fPLine = $showFtr && !empty($s['footer_show_primary']) ? $rawPLine : '';
    $fSLine = $showFtr && !empty($s['footer_show_secondary']) ? $rawSLine : '';
    $fEmail = $showFtr && !empty($s['footer_show_digital']) ? $rawEmail : '';
    $fWeb = $showFtr && !empty($s['footer_show_digital']) ? $rawWeb : '';

    $layout = $s['letter_layout'] ?? 'classic-executive';
    $isLeftRail = ($layout === 'left-rail') && $showHdr;
    $leftX = $isLeftRail ? 238 : 72;
    $wrapCols = $isLeftRail ? 60 : 78;

    $wm = $s['letter_watermark'] ? '<g opacity="0.055">' . renderEmblemGroup($s['emblem_id'], $p, $a, ($isLeftRail ? 330 : 247), 391, 300) . '</g>' : '';
    $herd = $s['letter_livestock_bg'] ? renderLivestockHerd($leftX - 12, 848, 734 - $leftX, $p, 0.065) : '';

    $header = '';
    $headerBottomY = 64;

    if (!$showHdr) {
        if ($layout !== 'minimal-rule') {
            $header .= '<rect x="0" y="0" width="794" height="6" fill="' . $a . '"/>';
        }
        $headerBottomY = 48;
    } elseif ($layout === 'left-rail') {
        $header .= '<rect x="0" y="0" width="196" height="1123" fill="' . $p . '"/>'
            . '<rect x="196" y="0" width="5" height="1123" fill="' . $a . '"/>';
        $ry = 52;
        if ($hLogo) {
            $header .= renderEmblemGroup($s['emblem_id'], '#FFFFFF', '#FFFFFF', 56, $ry, 84);
            $ry += 108;
        }
        if ($hComp) {
            $header .= '<text x="98" y="' . $ry . '" text-anchor="middle" fill="#FFFFFF" font-family="' . $fonts['display'] . '" font-weight="700" font-size="13.5" letter-spacing="1.4">' . $hComp . '</text>';
            $ry += 22;
        }
        if ($hTag) {
            $header .= '<text x="98" y="' . $ry . '" text-anchor="middle" fill="#CBD5E1" font-family="' . $fonts['body'] . '" font-size="8.5">' . $hTag . '</text>';
            $ry += 18;
        }
        if ($rawEst && $hComp) {
            $header .= '<text x="98" y="' . $ry . '" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="9.5">' . $rawEst . '</text>';
            $ry += 18;
        }
        if ($hPLine || $hSLine || $hEmail || $hWeb) {
            $ry += 18;
            $header .= '<line x1="24" y1="' . $ry . '" x2="172" y2="' . $ry . '" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>';
            $ry += 26;
        }
        if ($hPLine) {
            $header .= '<text x="24" y="' . $ry . '" fill="#FFFFFF" font-family="' . $fonts['body'] . '" font-weight="700" font-size="9.5">' . ($rawPname ?: $rawPtitle) . '</text>';
            $ry += 16;
            if ($rawPhone) {
                $header .= '<text x="24" y="' . $ry . '" fill="#CBD5E1" font-family="monospace" font-size="9">' . $rawPhone . '</text>';
                $ry += 16;
            }
            $ry += 14;
        }
        if ($hSLine) {
            $header .= '<text x="24" y="' . $ry . '" fill="#FFFFFF" font-family="' . $fonts['body'] . '" font-weight="700" font-size="9.5">' . ($rawSname ?: $rawStitle) . '</text>';
            $ry += 16;
            if ($rawSphone) {
                $header .= '<text x="24" y="' . $ry . '" fill="#CBD5E1" font-family="monospace" font-size="9">' . $rawSphone . '</text>';
                $ry += 16;
            }
            $ry += 14;
        }
        if ($hEmail) {
            $header .= '<text x="24" y="' . $ry . '" fill="#E2E8F0" font-family="' . $fonts['body'] . '" font-size="8.5">' . $hEmail . '</text>';
            $ry += 16;
        }
        if ($hWeb) {
            $header .= '<text x="24" y="' . $ry . '" fill="#E2E8F0" font-family="monospace" font-size="8.5">' . $hWeb . '</text>';
        }
        if ($hFullAddr) {
            $ay = 1044;
            if ($hAddr1) {
                $header .= '<text x="24" y="' . $ay . '" fill="#CBD5E1" font-family="' . $fonts['body'] . '" font-size="9">' . $hAddr1 . '</text>';
                $ay += 15;
            }
            if ($hCity) {
                $header .= '<text x="24" y="' . $ay . '" fill="#CBD5E1" font-family="' . $fonts['body'] . '" font-size="9">' . $hCity . '</text>';
            }
        }
        $headerBottomY = 42;
    } elseif ($layout === 'institutional-crest' || $layout === 'double-ledger') {
        $header .= '<rect x="0" y="0" width="794" height="7" fill="' . $p . '"/>';
        $cy = 28;
        if ($hLogo) {
            $header .= renderEmblemGroup($s['emblem_id'], $p, $a, 365, $cy, 62);
            $cy += 84;
        } else {
            $cy += 24;
        }
        if ($hComp) {
            $header .= '<text x="397" y="' . $cy . '" text-anchor="middle" fill="' . $p . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="24" letter-spacing="3">' . $hComp . '</text>';
            $cy += 21;
        }
        if ($hTag) {
            $header .= '<text x="397" y="' . $cy . '" text-anchor="middle" fill="#52525B" font-family="' . $fonts['body'] . '" font-size="10.5" letter-spacing="2">' . $hTag . '</text>';
            $cy += 19;
        }
        $contactSub = trim($hPLine . ($hPLine && $hSLine ? '   |   ' : '') . $hSLine);
        if ($contactSub) {
            $header .= '<text x="397" y="' . $cy . '" text-anchor="middle" fill="' . $p . '" font-family="' . $fonts['body'] . '" font-weight="600" font-size="9.5">' . $contactSub . '</text>';
            $cy += 18;
        }
        $metaSub = trim($hFullAddr . ($hFullAddr && $hDigital ? '  |  ' : '') . $hDigital);
        if ($metaSub) {
            $header .= '<text x="397" y="' . $cy . '" text-anchor="middle" fill="#52525B" font-family="' . $fonts['body'] . '" font-size="9.5">' . $metaSub . '</text>';
            $cy += 14;
        }
        if ($hLogo || $hComp || $hTag || $contactSub || $metaSub) {
            $ruleY = max($cy + 6, 78);
            $header .= '<line x1="72" y1="' . $ruleY . '" x2="722" y2="' . $ruleY . '" stroke="' . $p . '" stroke-width="1.8"/><line x1="72" y1="' . ($ruleY + 5) . '" x2="722" y2="' . ($ruleY + 5) . '" stroke="' . $a . '" stroke-width="1"/>';
            $headerBottomY = $ruleY + 12;
        } else {
            $headerBottomY = 48;
        }
    } else {
        // Horizontal Split Header (classic-executive, minimal-rule, modern-asymmetric, pastoral-band)
        $isDarkBand = ($layout === 'pastoral-band');
        $rightLines = [];
        if ($hPLine) $rightLines[] = ['text' => $hPLine, 'color' => $isDarkBand ? '#FFFFFF' : $p, 'weight' => '700', 'font' => $fonts['body']];
        if ($hSLine) $rightLines[] = ['text' => $hSLine, 'color' => $isDarkBand ? '#E2E8F0' : $p, 'weight' => '600', 'font' => $fonts['body']];
        if ($hFullAddr) $rightLines[] = ['text' => $hFullAddr, 'color' => $isDarkBand ? '#CBD5E1' : '#52525B', 'weight' => '400', 'font' => $fonts['body']];
        if ($hDigital) $rightLines[] = ['text' => $hDigital, 'color' => $isDarkBand ? '#CBD5E1' : '#52525B', 'weight' => '400', 'font' => 'monospace'];

        $rightStep = count($rightLines) <= 2 ? 18 : 16.5;
        $rightH = count($rightLines) > 0 ? count($rightLines) * $rightStep : 0;
        $leftH = max($hLogo ? 64 : 0, ($hComp ? 26 : 0) + ($hTag ? 18 : 0));
        $blockH = max($leftH, $rightH);

        if ($blockH === 0) {
            if ($layout !== 'minimal-rule') {
                $header .= '<rect x="0" y="0" width="794" height="6" fill="' . $a . '"/>';
            }
            $headerBottomY = 48;
        } else {
            $topPad = $isDarkBand ? 34 : 44;
            $bandH = $topPad + $blockH + ($isDarkBand ? 28 : 22);
            if ($isDarkBand) {
                $header .= '<rect x="0" y="0" width="794" height="' . $bandH . '" fill="' . $p . '"/>'
                    . '<rect x="0" y="' . $bandH . '" width="794" height="6" fill="' . $a . '"/>';
            } elseif ($layout !== 'minimal-rule') {
                $header .= '<rect x="0" y="0" width="794" height="6" fill="' . $a . '"/>';
            }

            // Left Side (Logo floats out cleanly if hidden)
            $brandX = 72;
            if ($layout === 'modern-asymmetric') {
                if ($hLogo) $header .= renderEmblemGroup($s['emblem_id'], $p, $a, 654, $topPad, 64);
            } else {
                if ($hLogo) {
                    $header .= renderEmblemGroup(
                        $s['emblem_id'],
                        $isDarkBand ? '#FFFFFF' : $p,
                        $isDarkBand ? '#FFFFFF' : $a,
                        72,
                        $topPad + ($blockH - 64) / 2,
                        64
                    );
                    $brandX = 152;
                }
            }

            $brandTextH = ($hComp ? 24 : 0) + ($hTag ? 18 : 0);
            $by = $topPad + ($blockH - $brandTextH) / 2 + 19;
            if ($hComp) {
                $header .= '<text x="' . $brandX . '" y="' . $by . '" fill="' . ($isDarkBand ? '#FFFFFF' : $p) . '" font-family="' . $fonts['display'] . '" font-weight="700" font-size="23" letter-spacing="2.5">' . $hComp . '</text>';
                $by += 22;
            }
            if ($hTag) {
                $header .= '<text x="' . $brandX . '" y="' . $by . '" fill="' . ($isDarkBand ? '#CBD5E1' : '#52525B') . '" font-family="' . $fonts['body'] . '" font-size="10.5" letter-spacing="2">' . $hTag . '</text>';
            }

            // Right Side Contact Stack (except modern-asymmetric where logo occupies right unless logo hidden)
            $rightAnchorX = ($layout === 'modern-asymmetric' && $hLogo) ? 632 : 722;
            $ry = $topPad + ($blockH - $rightH) / 2 + 12;
            foreach ($rightLines as $rl) {
                $header .= '<text x="' . $rightAnchorX . '" y="' . $ry . '" text-anchor="end" fill="' . $rl['color'] . '" font-family="' . $rl['font'] . '" font-weight="' . $rl['weight'] . '" font-size="9.8">' . $rl['text'] . '</text>';
                $ry += $rightStep;
            }

            if (!$isDarkBand) {
                $header .= '<line x1="72" y1="' . $bandH . '" x2="722" y2="' . $bandH . '" stroke="' . $p . '" stroke-width="1.5"/>';
                if ($layout !== 'minimal-rule') {
                    $header .= '<line x1="72" y1="' . ($bandH + 5) . '" x2="722" y2="' . ($bandH + 5) . '" stroke="#E2E8F0" stroke-width="1"/>';
                }
            }
            $headerBottomY = $bandH + ($isDarkBand ? 14 : 10);
        }
    }

    // Dynamic Body Reflow
    $hasFooterContent = $showFtr && ($fComp || $fAddr || $fPLine || $fSLine || $fEmail || $fWeb);
    $bodyLineH = (!$showHdr || !$hasFooterContent) ? 23.5 : 22.0;

    $cursorY = $headerBottomY + 42;
    $body = '';

    $hasDate = $vis['letter_date'] && trim($s['letter_date']) !== '';
    $hasRef = $vis['letter_ref'] && trim($s['letter_ref']) !== '';
    if ($hasDate || $hasRef) {
        if ($hasDate) {
            $body .= '<text x="' . $leftX . '" y="' . $cursorY . '" fill="#18181B" font-family="' . $fonts['body'] . '" font-size="12">' . esc($s['letter_date']) . '</text>';
        }
        if ($hasRef) {
            $refAnchor = (!$hasDate) ? 'start' : 'end';
            $refX = (!$hasDate) ? $leftX : 722;
            $body .= '<text x="' . $refX . '" y="' . $cursorY . '" text-anchor="' . $refAnchor . '" fill="#52525B" font-family="monospace" font-size="11">' . esc($s['letter_ref']) . '</text>';
        }
        $cursorY += 40;
    }

    if ($vis['letter_recipient'] && trim($s['letter_recipient']) !== '') {
        $body .= '<text x="' . $leftX . '" y="' . $cursorY . '" fill="#18181B" font-family="' . $fonts['body'] . '" font-weight="700" font-size="12.5">' . esc($s['letter_recipient']) . '</text>';
        $cursorY += 44;
    }

    if ($vis['letter_subject'] && trim($s['letter_subject']) !== '') {
        $body .= '<text x="' . $leftX . '" y="' . $cursorY . '" fill="' . $p . '" font-family="' . $fonts['body'] . '" font-weight="700" font-size="13">' . esc($s['letter_subject']) . '</text>'
            . '<line x1="' . $leftX . '" y1="' . ($cursorY + 12) . '" x2="722" y2="' . ($cursorY + 12) . '" stroke="#E2E8F0" stroke-width="1"/>';
        $cursorY += 48;
    }

    if ($vis['letter_body']) {
        $lines1 = explode("\n", wordwrap($s['letter_body1'], $wrapCols, "\n"));
        $lines2 = explode("\n", wordwrap($s['letter_body2'], $wrapCols, "\n"));
        $body .= '<text x="' . $leftX . '" y="' . $cursorY . '" fill="#18181B" font-family="' . $fonts['body'] . '" font-weight="600" font-size="12">Dear Sir / Madam,</text>';
        $cursorY += 28;
        foreach ($lines1 as $ln) {
            $body .= '<text x="' . $leftX . '" y="' . $cursorY . '" fill="#27272A" font-family="' . $fonts['body'] . '" font-size="12">' . esc($ln) . '</text>';
            $cursorY += $bodyLineH;
        }
        $cursorY += 14;
        foreach ($lines2 as $ln) {
            $body .= '<text x="' . $leftX . '" y="' . $cursorY . '" fill="#27272A" font-family="' . $fonts['body'] . '" font-size="12">' . esc($ln) . '</text>';
            $cursorY += $bodyLineH;
        }
        $cursorY += 28;
    }

    $sigStartY = $cursorY;
    if ($vis['letter_signature']) {
        $body .= '<text x="' . $leftX . '" y="' . $sigStartY . '" fill="#18181B" font-family="' . $fonts['body'] . '" font-size="12">With best regards,</text>';
        $sy = $sigStartY + 62;
        if ($rawPname) {
            $body .= '<text x="' . $leftX . '" y="' . $sy . '" fill="' . $p . '" font-family="' . $fonts['body'] . '" font-weight="700" font-size="13">' . $rawPname . '</text>';
            $sy += 18;
        }
        $sigRole = trim($rawPtitle . ($rawPtitle && $rawComp ? ' · ' : '') . $rawComp);
        if ($sigRole) {
            $body .= '<text x="' . $leftX . '" y="' . $sy . '" fill="#52525B" font-family="' . $fonts['body'] . '" font-size="11.5">' . $sigRole . '</text>';
        }
    }

    if ($s['letter_stamp_overlay']) {
        $stampX = $vis['letter_signature'] ? ($leftX + 240) : $leftX;
        $stampInner = renderStampSvg($s, true);
        $body .= '<g transform="translate(' . $stampX . ',' . ($sigStartY - 14) . ') scale(0.33)" opacity="0.88">' . preg_replace('/<\/?svg[^>]*>/', '', $stampInner) . '</g>';
    }

    // Dynamic Footer Zone (Independent of Header!)
    $footer = '';
    $fLeft1 = trim($fComp . ($fComp && $fAddr ? ' · ' : '') . $fAddr);
    $fLeft2 = trim($fPLine . ($fPLine && $fSLine ? '  |  ' : '') . $fSLine);
    $fLeftLines = array_values(array_filter([$fLeft1, $fLeft2]));
    $fRightLines = array_values(array_filter([$fWeb, $fEmail]));

    if (count($fLeftLines) > 0 || count($fRightLines) > 0) {
        $footerTopY = 1044;
        $footer .= '<line x1="' . $leftX . '" y1="' . $footerTopY . '" x2="722" y2="' . $footerTopY . '" stroke="#E2E8F0" stroke-width="1.2"/>';
        if (count($fLeftLines) === 1) {
            $footer .= '<text x="' . $leftX . '" y="1077" fill="' . $p . '" font-family="' . $fonts['body'] . '" font-weight="600" font-size="10">' . $fLeftLines[0] . '</text>';
        } elseif (count($fLeftLines) === 2) {
            $footer .= '<text x="' . $leftX . '" y="1068" fill="' . $p . '" font-family="' . $fonts['body'] . '" font-weight="700" font-size="10">' . $fLeftLines[0] . '</text>';
            $footer .= '<text x="' . $leftX . '" y="1086" fill="#52525B" font-family="monospace" font-size="9.5">' . $fLeftLines[1] . '</text>';
        }
        if (count($fRightLines) === 1) {
            $footer .= '<text x="722" y="1077" text-anchor="end" fill="' . $a . '" font-family="monospace" font-size="9.5">' . $fRightLines[0] . '</text>';
        } elseif (count($fRightLines) === 2) {
            $footer .= '<text x="722" y="1068" text-anchor="end" fill="' . $a . '" font-family="monospace" font-size="9.5">' . $fRightLines[0] . '</text>';
            $footer .= '<text x="722" y="1086" text-anchor="end" fill="#52525B" font-family="monospace" font-size="9">' . $fRightLines[1] . '</text>';
        }
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 794 1123" width="794" height="1123"><rect width="794" height="1123" fill="' . $paperBg . '"/>' . $wm . $herd . $header . $body . $footer . '</svg>';
}

// Direct SVG or Editable Word (.doc) Download Endpoints
if (isset($_GET['download'])) {
    $fmt = $_GET['download'];
    $asset = $_GET['asset'] ?? 'letterhead';
    $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $state['company_name']) ?: 'brand');
    $vis = $state['vis'];

    if ($fmt === 'svg') {
        $svg = match ($asset) {
            'logo' => renderLogoSvg($state),
            'stamp' => renderStampSvg($state, true),
            'card_front' => renderVisitingCardSvg($state, 'front'),
            'card_back' => renderVisitingCardSvg($state, 'back'),
            default => renderLetterheadSvg($state),
        };
        header('Content-Type: image/svg+xml; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $slug . '-' . $asset . '.svg"');
        echo $svg;
        exit;
    }

    if ($fmt === 'word') {
        header('Content-Type: application/msword; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $slug . '-' . $asset . '.doc"');
        $logoUri = 'data:image/svg+xml;base64,' . base64_encode(renderLogoSvg($state));
        $stampUri = 'data:image/svg+xml;base64,' . base64_encode(renderStampSvg($state, true));
        $comp = $vis['company_name'] ? esc($state['company_name']) : '';
        $tag = $vis['tagline'] ? esc($state['tagline']) : '';
        $pName = $vis['person_name'] ? esc($state['person_name']) : '';
        $pTitle = $vis['person_title'] ? esc($state['person_title']) : '';
        $phone = $vis['phone'] ? esc($state['phone']) : '';
        $sName = $vis['secondary_name'] ? esc($state['secondary_name']) : '';
        $sTitle = $vis['secondary_title'] ? esc($state['secondary_title']) : '';
        $sPhone = $vis['secondary_phone'] ? esc($state['secondary_phone']) : '';
        $email = $vis['email'] ? esc($state['email']) : '';
        $web = $vis['website'] ? esc($state['website']) : '';
        $addr = $vis['address'] ? esc(trim($state['address_line1'] . ', ' . $state['city_state'], ', ')) : '';

        $pLine = trim(($pTitle && $pName ? "$pTitle: $pName" : "$pName$pTitle") . ($phone ? " ($phone)" : ''));
        $sLine = trim(($sTitle && $sName ? "$sTitle: $sName" : "$sName$sTitle") . ($sPhone ? " ($sPhone)" : ''));

        echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' . ($comp ?: 'Brand Stationery') . '</title></head><body style="font-family:Calibri,Arial,sans-serif;color:#18181B;margin:36px;">';
        if ($asset === 'letterhead') {
            $showHdr = !empty($state['show_header']);
            $hRightParts = array_filter([
                ($showHdr && !empty($state['header_show_company']) && $comp) ? '<strong>' . $comp . '</strong>' : '',
                ($showHdr && !empty($state['header_show_tagline']) && $tag) ? '<span style="color:#52525B;">' . $tag . '</span>' : '',
                ($showHdr && !empty($state['header_show_primary']) && $pLine) ? $pLine : '',
                ($showHdr && !empty($state['header_show_secondary']) && $sLine) ? $sLine : '',
                ($showHdr) ? implode(' | ', array_filter([
                    !empty($state['header_show_address']) ? $addr : '',
                    !empty($state['header_show_digital']) ? $email : '',
                    !empty($state['header_show_digital']) ? $web : '',
                ])) : '',
            ]);
            $hLogoOn = $showHdr && !empty($state['header_show_logo']);
            if ($showHdr && ($hLogoOn || count($hRightParts) > 0)) {
                echo '<table width="100%" style="border-bottom:2px solid ' . esc($state['accent_color']) . ';padding-bottom:12px;"><tr>';
                if ($hLogoOn) {
                    echo '<td><img src="' . $logoUri . '" width="180" alt="Logo"/></td>';
                }
                if (count($hRightParts) > 0) {
                    echo '<td align="' . ($hLogoOn ? 'right' : 'left') . '" style="font-size:11pt;">' . implode('<br/>', $hRightParts) . '</td>';
                }
                echo '</tr></table>';
            }

            if ($vis['letter_date'] || $vis['letter_ref']) {
                echo '<p style="margin-top:' . ($showHdr ? '24px' : '0') . ';">' . ($vis['letter_date'] ? esc($state['letter_date']) : '') . ' &nbsp;&nbsp; ' . ($vis['letter_ref'] ? esc($state['letter_ref']) : '') . '</p>';
            }
            if ($vis['letter_recipient']) echo '<p><strong>' . esc($state['letter_recipient']) . '</strong></p>';
            if ($vis['letter_subject']) echo '<p style="font-weight:bold;color:' . esc($state['primary_color']) . ';">' . esc($state['letter_subject']) . '</p>';
            if ($vis['letter_body']) {
                echo '<p>Dear Sir / Madam,</p>'
                    . '<p style="line-height:1.6;">' . esc($state['letter_body1']) . '</p>'
                    . '<p style="line-height:1.6;">' . esc($state['letter_body2']) . '</p>';
            }
            if ($vis['letter_signature']) echo '<p style="margin-top:28px;">With best regards,</p>';
            if ($state['letter_stamp_overlay']) echo '<p><img src="' . $stampUri . '" width="120" alt="Stamp"/></p>';
            if ($vis['letter_signature']) {
                echo '<p>' . ($pName ? '<strong>' . $pName . '</strong><br/>' : '') . trim($pTitle . ($pTitle && $comp ? ', ' : '') . $comp) . '</p>';
            }

            if (!empty($state['show_footer'])) {
                $fLine1 = implode(' · ', array_filter([
                    !empty($state['footer_show_company']) ? $comp : '',
                    !empty($state['footer_show_address']) ? $addr : '',
                ]));
                $fLine2 = implode(' | ', array_filter([
                    !empty($state['footer_show_primary']) ? $pLine : '',
                    !empty($state['footer_show_secondary']) ? $sLine : '',
                    !empty($state['footer_show_digital']) ? $email : '',
                    !empty($state['footer_show_digital']) ? $web : '',
                ]));
                if ($fLine1 || $fLine2) {
                    echo '<div style="margin-top:42px;border-top:1px solid #D4D4D8;padding-top:10px;text-align:center;font-size:9.5pt;color:#52525B;">'
                        . ($fLine1 ? '<strong>' . $fLine1 . '</strong>' . ($fLine2 ? '<br/>' : '') : '')
                        . $fLine2
                        . '</div>';
                }
            }
        } elseif ($asset === 'card') {
            $cfUri = 'data:image/svg+xml;base64,' . base64_encode(renderVisitingCardSvg($state, 'front'));
            $cbUri = 'data:image/svg+xml;base64,' . base64_encode(renderVisitingCardSvg($state, 'back'));
            echo '<h2>' . ($comp ?: 'Visiting Card') . ' — Visiting Card</h2>'
                . '<p><img src="' . $cfUri . '" width="360"/></p>'
                . '<p><img src="' . $cbUri . '" width="360"/></p>'
                . '<table border="1" cellpadding="6" cellspacing="0" width="100%">';
            if ($comp) echo '<tr><td><strong>Business</strong></td><td>' . $comp . '</td></tr>';
            if ($pLine) echo '<tr><td><strong>Primary Contact</strong></td><td>' . $pLine . '</td></tr>';
            if ($sLine) echo '<tr><td><strong>Operations Contact</strong></td><td>' . $sLine . '</td></tr>';
            if ($email || $web) echo '<tr><td><strong>Email / Website</strong></td><td>' . trim($email . ($email && $web ? ' | ' : '') . $web) . '</td></tr>';
            if ($addr) echo '<tr><td><strong>Address</strong></td><td>' . $addr . '</td></tr>';
            echo '</table>';
        } elseif ($asset === 'stamp') {
            echo '<h2>' . ($comp ?: 'Official Stamp') . ' — Official Stamp Seal</h2>'
                . '<p><img src="' . $stampUri . '" width="240"/></p>';
            if ($vis['stamp_top_arc']) echo '<p><strong>Top Ring:</strong> ' . esc($state['stamp_top_arc']) . '</p>';
            if ($vis['stamp_bottom_arc']) echo '<p><strong>Bottom Ring:</strong> ' . esc($state['stamp_bottom_arc']) . '</p>';
            if ($vis['stamp_sub_label']) echo '<p><strong>Inner Label:</strong> ' . esc($state['stamp_sub_label']) . '</p>';
        } else {
            echo '<h2>' . ($comp ?: 'Brand Logo') . ' — Brand Logo</h2>'
                . '<p><img src="' . $logoUri . '" width="440"/></p>';
            if ($vis['tagline']) echo '<p><strong>Tagline:</strong> ' . esc($state['tagline']) . '</p>';
        }
        echo '</body></html>';
        exit;
    }
}

$logoSvg = renderLogoSvg($state);
$stampSvg = renderStampSvg($state, true);
$cardFrontSvg = renderVisitingCardSvg($state, 'front');
$cardBackSvg = renderVisitingCardSvg($state, 'back');
$letterSvg = renderLetterheadSvg($state);
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Pressmark Studio PHP — <?= esc($state['company_name']) ?></title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F4F5F7; color: #111318; }
    header { background: #FFF; border-bottom: 1px solid #E2E8F0; padding: 0 24px; height: 57px; display: flex; align-items: center; justify-content: space-between; gap: 24px; position: sticky; top: 0; z-index: 20; }
    .brand { font-weight: 700; font-size: 16px; white-space: nowrap; }
    nav { display: flex; gap: 20px; }
    nav a { text-decoration: none; font-size: 13.5px; font-weight: 500; color: #64748B; padding: 18px 0; border-bottom: 2px solid transparent; white-space: nowrap; }
    nav a.active { color: #111318; border-bottom-color: #1E40AF; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 12px; font-weight: 600; border-radius: 6px; border: 1px solid #CBD5E1; background: #FFF; color: #111318; cursor: pointer; text-decoration: none; white-space: nowrap; }
    .btn-primary { background: #1E40AF; border-color: #1E40AF; color: #FFF; }
    .btn-success { background: #ECFDF5; border-color: #047857; color: #065F46; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .layout { display: flex; min-height: calc(100vh - 57px); }
    aside { width: 356px; flex-shrink: 0; background: #FFF; border-right: 1px solid #E2E8F0; padding: 16px; overflow-y: auto; max-height: calc(100vh - 57px); }
    main { flex: 1; padding: 28px; overflow-y: auto; background-image: radial-gradient(#CBD5E1 1px, transparent 1px); background-size: 20px 20px; }
    .field { margin-bottom: 12px; }
    .field-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .field label { font-size: 12px; font-weight: 500; color: #475569; }
    .vis-toggle { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; color: #334155; cursor: pointer; }
    .zone-box { border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #F8FAFC; }
    .zone-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 8px; margin-top: 8px; padding-left: 4px; }
    input[type=text], input[type=email], select, textarea { width: 100%; padding: 7px 10px; font-size: 12px; border: 1px solid #CBD5E1; border-radius: 5px; background: #FFF; }
    .themes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 14px; }
    .theme-btn { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border: 1px solid #CBD5E1; border-radius: 5px; background: #FFF; font-size: 11px; cursor: pointer; text-align: left; }
    .theme-btn.active { border-color: #1E40AF; background: #EFF6FF; font-weight: 600; }
    .swatch { display: inline-flex; width: 18px; height: 12px; border-radius: 2px; overflow: hidden; flex-shrink: 0; }
    .grid { max-width: 1140px; margin: 0 auto; display: grid; grid-template-columns: 7fr 5fr; gap: 24px; align-items: start; }
    .card { background: #FFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,.05); margin-bottom: 24px; }
    .card-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-size: 12.5px; font-weight: 600; gap: 8px; flex-wrap: wrap; }
    .card-body svg { width: 100%; height: auto; display: block; }
    .approval-bar { max-width: 1140px; margin: 0 auto 24px; background: #FFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    @media (max-width: 1024px) { .layout { flex-direction: column; } aside { width: 100%; max-height: none; } .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
<header>
  <div class="brand">Pressmark Studio · PHP</div>
  <nav>
    <?php foreach (['suite' => 'Brand Suite', 'logo' => 'Logo', 'stamp' => 'Stamp', 'card' => 'Visiting Card', 'letterhead' => 'Letterhead'] as $tk => $tl): ?>
      <a href="?tab=<?= $tk ?>" class="<?= $state['active_tab'] === $tk ? 'active' : '' ?>"><?= $tl ?></a>
    <?php endforeach; ?>
  </nav>
  <form method="post" style="margin:0;">
    <input type="hidden" name="action" value="toggle_approve"/>
    <button type="submit" class="btn <?= $state['approved'] ? 'btn-success' : 'btn-primary' ?>">
      <?= $state['approved'] ? 'Design Approved' : 'Approve Designs' ?>
    </button>
  </form>
</header>

<div class="layout">
  <aside>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <strong style="font-size:12.5px;">Color Themes</strong>
      <form method="post" style="margin:0;"><input type="hidden" name="action" value="reset"/><button class="btn" style="padding:4px 8px;font-size:11px;" type="submit">Reset</button></form>
    </div>
    <div class="themes">
      <?php foreach ($COLOR_THEMES as $tid => $t): ?>
        <form method="post" style="margin:0;">
          <input type="hidden" name="action" value="apply_theme"/>
          <input type="hidden" name="theme_id" value="<?= $tid ?>"/>
          <button type="submit" class="theme-btn <?= $state['theme_id'] === $tid ? 'active' : '' ?>" style="width:100%;">
            <span class="swatch"><span style="width:9px;background:<?= $t['primary'] ?>"></span><span style="width:9px;background:<?= $t['accent'] ?>"></span></span>
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><?= esc($t['name']) ?></span>
          </button>
        </form>
      <?php endforeach; ?>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <strong style="font-size:12px;">Text Visibility</strong>
      <div style="display:flex;gap:6px;">
        <form method="post" style="margin:0;"><input type="hidden" name="action" value="vis_all_on"/><button class="btn" style="padding:3px 8px;font-size:11px;" type="submit">All On</button></form>
        <form method="post" style="margin:0;"><input type="hidden" name="action" value="vis_all_off"/><button class="btn" style="padding:3px 8px;font-size:11px;" type="submit">All Off</button></form>
      </div>
    </div>

    <form method="post">
      <input type="hidden" name="action" value="save"/>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-bottom:14px;">Apply Changes to Proofs</button>

      <!-- SEPARATE HEADER SHOW/HIDE PANEL -->
      <div class="zone-box">
        <label class="vis-toggle" style="font-weight:700;color:#111318;">
          <input type="checkbox" name="show_header" <?= !empty($state['show_header']) ? 'checked' : '' ?>/>
          Header Show / Hide
        </label>
        <div class="zone-grid">
          <label class="vis-toggle"><input type="checkbox" name="header_show_logo" <?= !empty($state['header_show_logo']) ? 'checked' : '' ?>/> Logo</label>
          <label class="vis-toggle"><input type="checkbox" name="header_show_company" <?= !empty($state['header_show_company']) ? 'checked' : '' ?>/> Business</label>
          <label class="vis-toggle"><input type="checkbox" name="header_show_tagline" <?= !empty($state['header_show_tagline']) ? 'checked' : '' ?>/> Tagline</label>
          <label class="vis-toggle"><input type="checkbox" name="header_show_primary" <?= !empty($state['header_show_primary']) ? 'checked' : '' ?>/> 1st Contact</label>
          <label class="vis-toggle"><input type="checkbox" name="header_show_secondary" <?= !empty($state['header_show_secondary']) ? 'checked' : '' ?>/> 2nd Contact</label>
          <label class="vis-toggle"><input type="checkbox" name="header_show_address" <?= !empty($state['header_show_address']) ? 'checked' : '' ?>/> Address</label>
          <label class="vis-toggle" style="grid-column:span 2;"><input type="checkbox" name="header_show_digital" <?= !empty($state['header_show_digital']) ? 'checked' : '' ?>/> Email & Website</label>
        </div>
      </div>

      <!-- SEPARATE FOOTER SHOW/HIDE PANEL -->
      <div class="zone-box">
        <label class="vis-toggle" style="font-weight:700;color:#111318;">
          <input type="checkbox" name="show_footer" <?= !empty($state['show_footer']) ? 'checked' : '' ?>/>
          Footer Show / Hide
        </label>
        <div class="zone-grid">
          <label class="vis-toggle"><input type="checkbox" name="footer_show_company" <?= !empty($state['footer_show_company']) ? 'checked' : '' ?>/> Business</label>
          <label class="vis-toggle"><input type="checkbox" name="footer_show_address" <?= !empty($state['footer_show_address']) ? 'checked' : '' ?>/> Address</label>
          <label class="vis-toggle"><input type="checkbox" name="footer_show_primary" <?= !empty($state['footer_show_primary']) ? 'checked' : '' ?>/> 1st Contact</label>
          <label class="vis-toggle"><input type="checkbox" name="footer_show_secondary" <?= !empty($state['footer_show_secondary']) ? 'checked' : '' ?>/> 2nd Contact</label>
          <label class="vis-toggle" style="grid-column:span 2;"><input type="checkbox" name="footer_show_digital" <?= !empty($state['footer_show_digital']) ? 'checked' : '' ?>/> Email & Website</label>
        </div>
      </div>

      <?php
      $renderField = function(string $name, string $label, string $visKey, string $type = 'text') use ($state) {
          $checked = !empty($state['vis'][$visKey]) ? 'checked' : '';
          echo '<div class="field"><div class="field-head"><label>' . esc($label) . '</label>'
              . '<label class="vis-toggle"><input type="checkbox" name="vis_' . $visKey . '" ' . $checked . '/> On</label></div>'
              . '<input type="' . $type . '" name="' . $name . '" value="' . esc((string)$state[$name]) . '"/></div>';
      };
      $renderField('company_name', 'Business Name', 'company_name');
      $renderField('tagline', 'Tagline', 'tagline');
      $renderField('established_year', 'Established Year', 'established_year');
      $renderField('registration_no', 'Registration / District Code', 'registration_no');
      $renderField('person_name', 'Primary Contact (Proprietor)', 'person_name');
      $renderField('person_title', 'Primary Title', 'person_title');
      $renderField('phone', 'Primary Mobile', 'phone');
      $renderField('secondary_name', 'Secondary Contact (Caretaker)', 'secondary_name');
      $renderField('secondary_title', 'Secondary Title', 'secondary_title');
      $renderField('secondary_phone', 'Secondary Mobile', 'secondary_phone');
      $renderField('email', 'Email', 'email', 'email');
      $renderField('website', 'Website', 'website');
      $renderField('address_line1', 'Street / Chak Address', 'address');
      ?>
      <div class="field">
        <div class="field-head"><label>District / City</label></div>
        <input type="text" name="city_state" value="<?= esc($state['city_state']) ?>"/>
      </div>

      <hr style="border:none;border-top:1px solid #E2E8F0;margin:14px 0;"/>
      <strong style="font-size:12px;display:block;margin-bottom:8px;">Designs & Layouts</strong>
      <div class="field"><label>Emblem</label><select name="emblem_id">
        <?php foreach (['livestock' => 'Livestock Crest', 'barn' => 'Farm Barn', 'wheat' => 'Pasture Wheat', 'shield' => 'Heritage Shield'] as $ek => $el): ?>
          <option value="<?= $ek ?>" <?= $state['emblem_id'] === $ek ? 'selected' : '' ?>><?= $el ?></option>
        <?php endforeach; ?>
      </select></div>
      <div class="field"><label>Logo Lockup</label><select name="logo_lockup">
        <?php foreach (['horizontal' => 'Horizontal', 'stacked' => 'Stacked Crest', 'badge' => 'Heritage Badge', 'emblem' => 'Emblem Only', 'wordmark' => 'Wordmark Only'] as $lk => $ll): ?>
          <option value="<?= $lk ?>" <?= $state['logo_lockup'] === $lk ? 'selected' : '' ?>><?= $ll ?></option>
        <?php endforeach; ?>
      </select></div>
      <div class="field"><label>Stamp Shape</label><select name="stamp_shape">
        <?php foreach (['circle' => 'Circle', 'oval' => 'Oval', 'rectangle' => 'Rectangle', 'shield' => 'Shield Seal'] as $sk => $sl): ?>
          <option value="<?= $sk ?>" <?= $state['stamp_shape'] === $sk ? 'selected' : '' ?>><?= $sl ?></option>
        <?php endforeach; ?>
      </select></div>
      <?php
      $renderField('stamp_top_arc', 'Stamp Top Ring (Bold Business)', 'stamp_top_arc');
      $renderField('stamp_bottom_arc', 'Stamp Bottom Ring', 'stamp_bottom_arc');
      $renderField('stamp_sub_label', 'Stamp Inner Label', 'stamp_sub_label');
      ?>
      <div class="field"><label>Visiting Card Layout</label><select name="card_layout">
        <?php foreach ([
          'swiss-grid' => 'Swiss Grid',
          'executive-minimal' => 'Executive Minimal',
          'editorial-split' => 'Editorial Split',
          'diagonal-ribbon' => 'Diagonal Ribbon',
          'pastoral-horizon' => 'Pastoral Horizon',
          'monogram-crest' => 'Monogram Crest',
          'architectural-frame' => 'Architectural Frame',
        ] as $ck => $cl): ?>
          <option value="<?= $ck ?>" <?= $state['card_layout'] === $ck ? 'selected' : '' ?>><?= $cl ?></option>
        <?php endforeach; ?>
      </select></div>
      <div class="field"><label>Card Paper Stock</label><select name="card_stock">
        <?php foreach (['cotton-ivory' => 'Cotton Ivory', 'white' => 'Stark White', 'warm-kraft' => 'Warm Kraft', 'obsidian' => 'Obsidian Matte', 'slate-navy' => 'Midnight Navy'] as $pk => $pl): ?>
          <option value="<?= $pk ?>" <?= $state['card_stock'] === $pk ? 'selected' : '' ?>><?= $pl ?></option>
        <?php endforeach; ?>
      </select></div>
      <div class="field"><label>Card Reverse Face</label><select name="card_back_style">
        <?php foreach (['solid-accent' => 'Solid Brand Ink', 'emblem-centered' => 'Emblem on Stock', 'minimal-wordmark' => 'Wordmark Only'] as $bk => $bl): ?>
          <option value="<?= $bk ?>" <?= $state['card_back_style'] === $bk ? 'selected' : '' ?>><?= $bl ?></option>
        <?php endforeach; ?>
      </select></div>
      <div class="field"><label>Letterhead Layout</label><select name="letter_layout">
        <?php foreach ([
          'classic-executive' => 'Classic Executive',
          'left-rail' => 'Left Spine Rail',
          'minimal-rule' => 'Minimal Rule',
          'institutional-crest' => 'Centered Crest',
          'modern-asymmetric' => 'Asymmetric Right',
          'double-ledger' => 'Double Ledger',
          'pastoral-band' => 'Pastoral Band',
        ] as $lk => $ll): ?>
          <option value="<?= $lk ?>" <?= $state['letter_layout'] === $lk ? 'selected' : '' ?>><?= $ll ?></option>
        <?php endforeach; ?>
      </select></div>
      <div class="field"><label>Letterhead Paper</label><select name="letter_stock">
        <?php foreach (['white' => 'Stark White', 'cotton-ivory' => 'Cotton Ivory'] as $sk => $sl): ?>
          <option value="<?= $sk ?>" <?= $state['letter_stock'] === $sk ? 'selected' : '' ?>><?= $sl ?></option>
        <?php endforeach; ?>
      </select></div>
      <label class="vis-toggle" style="margin-bottom:8px;"><input type="checkbox" name="card_livestock_bg" <?= $state['card_livestock_bg'] ? 'checked' : '' ?>/> Card Low-Opacity Livestock</label><br/>
      <label class="vis-toggle" style="margin-bottom:8px;"><input type="checkbox" name="letter_livestock_bg" <?= $state['letter_livestock_bg'] ? 'checked' : '' ?>/> Letterhead Low-Opacity Livestock</label><br/>
      <label class="vis-toggle" style="margin-bottom:8px;"><input type="checkbox" name="letter_watermark" <?= $state['letter_watermark'] ? 'checked' : '' ?>/> Center Emblem Watermark</label><br/>
      <label class="vis-toggle" style="margin-bottom:14px;"><input type="checkbox" name="letter_stamp_overlay" <?= $state['letter_stamp_overlay'] ? 'checked' : '' ?>/> Stamp Overlay on Letterhead</label>

      <?php
      $renderField('letter_date', 'Letter Date', 'letter_date');
      $renderField('letter_ref', 'Reference No.', 'letter_ref');
      $renderField('letter_recipient', 'Recipient', 'letter_recipient');
      $renderField('letter_subject', 'Subject', 'letter_subject');
      ?>
      <div class="field">
        <div class="field-head"><label>Body Text</label><label class="vis-toggle"><input type="checkbox" name="vis_letter_body" <?= $state['vis']['letter_body'] ? 'checked' : '' ?>/> On</label></div>
        <textarea name="letter_body1" rows="3"><?= esc($state['letter_body1']) ?></textarea>
      </div>
      <div class="field"><textarea name="letter_body2" rows="3"><?= esc($state['letter_body2']) ?></textarea></div>
      <label class="vis-toggle" style="margin-bottom:14px;"><input type="checkbox" name="vis_letter_signature" <?= $state['vis']['letter_signature'] ? 'checked' : '' ?>/> Signature Block On</label>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Save & Update Proofs</button>
    </form>
  </aside>

  <main>
    <div class="approval-bar">
      <div>
        <strong style="font-size:14px;display:block;"><?= $state['approved'] ? 'Approved — Separate PDFs & MS Word Files Unlocked' : 'Step 1: Review Proofs & Toggle Text Fields, Then Approve' ?></strong>
        <span style="font-size:12px;color:#64748B;">Each artifact exports independently to Print-Ready PDF, Editable MS Word (.doc), or Vector SVG.</span>
      </div>
      <?php if ($state['approved']): ?>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button type="button" class="btn btn-primary" onclick="downloadAllPdfs()">Download 4 Separate PDFs</button>
      </div>
      <?php endif; ?>
    </div>

    <div class="grid">
      <div>
        <?php if (in_array($state['active_tab'], ['suite', 'logo'], true)): ?>
        <div class="card">
          <div class="card-bar">
            <span>01. Logo</span>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn" <?= $state['approved'] ? '' : 'disabled' ?> onclick="exportPdf('logo')">PDF</button>
              <a class="btn" href="?download=word&asset=logo">Word (.doc)</a>
              <a class="btn" href="?download=svg&asset=logo">SVG</a>
            </div>
          </div>
          <div class="card-body" id="svg-logo"><?= $logoSvg ?></div>
        </div>
        <?php endif; ?>

        <?php if (in_array($state['active_tab'], ['suite', 'card'], true)): ?>
        <div class="card">
          <div class="card-bar">
            <span>02. Visiting Card (Front & Back)</span>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn" <?= $state['approved'] ? '' : 'disabled' ?> onclick="exportPdf('card')">PDF (2-Page)</button>
              <a class="btn" href="?download=word&asset=card">Word (.doc)</a>
              <a class="btn" href="?download=svg&asset=card_front">Front SVG</a>
            </div>
          </div>
          <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;">
            <div id="svg-card-front"><?= $cardFrontSvg ?></div>
            <div id="svg-card-back"><?= $cardBackSvg ?></div>
          </div>
        </div>
        <?php endif; ?>

        <?php if (in_array($state['active_tab'], ['suite', 'stamp'], true)): ?>
        <div class="card">
          <div class="card-bar">
            <span>03. Stamp Design (Bold Business Name Only)</span>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn" <?= $state['approved'] ? '' : 'disabled' ?> onclick="exportPdf('stamp')">PDF</button>
              <a class="btn" href="?download=word&asset=stamp">Word (.doc)</a>
              <a class="btn" href="?download=svg&asset=stamp">SVG</a>
            </div>
          </div>
          <div class="card-body" id="svg-stamp" style="max-width:260px;margin:0 auto;padding:16px;"><?= $stampSvg ?></div>
        </div>
        <?php endif; ?>
      </div>

      <div>
        <?php if (in_array($state['active_tab'], ['suite', 'letterhead'], true)): ?>
        <div class="card">
          <div class="card-bar">
            <span>04. Letterhead (A4)</span>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn" <?= $state['approved'] ? '' : 'disabled' ?> onclick="exportPdf('letterhead')">PDF</button>
              <a class="btn" href="?download=word&asset=letterhead">Word (.doc)</a>
              <a class="btn" href="?download=svg&asset=letterhead">SVG</a>
            </div>
          </div>
          <div class="card-body" id="svg-letterhead"><?= $letterSvg ?></div>
        </div>
        <?php endif; ?>
      </div>
    </div>
  </main>
</div>

<div style="position:fixed;left:-99999px;top:0;pointer-events:none;opacity:0;" aria-hidden="true">
  <div id="export-logo"><?= $logoSvg ?></div>
  <div id="export-card-front"><?= $cardFrontSvg ?></div>
  <div id="export-card-back"><?= $cardBackSvg ?></div>
  <div id="export-stamp"><?= $stampSvg ?></div>
  <div id="export-letterhead"><?= $letterSvg ?></div>
</div>

<script>
function svgToDataUrl(svgEl, w, h, bg) {
  return new Promise((resolve) => {
    const xml = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/png'));
    };
    img.src = url;
  });
}

async function exportPdf(type) {
  const { jsPDF } = window.jspdf;
  const slug = <?= json_encode(strtolower(preg_replace('/[^a-z0-9]+/i', '-', $state['company_name']) ?: 'brand')) ?>;
  if (type === 'letterhead') {
    const png = await svgToDataUrl(document.querySelector('#export-letterhead svg'), 1985, 2808, '#FFFFFF');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.addImage(png, 'PNG', 0, 0, 210, 297);
    pdf.save(slug + '-letterhead.pdf');
  } else if (type === 'card') {
    const f = await svgToDataUrl(document.querySelector('#export-card-front svg'), 1575, 900);
    const b = await svgToDataUrl(document.querySelector('#export-card-back svg'), 1575, 900);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [88.9, 50.8] });
    pdf.addImage(f, 'PNG', 0, 0, 88.9, 50.8);
    pdf.addPage([88.9, 50.8], 'landscape');
    pdf.addImage(b, 'PNG', 0, 0, 88.9, 50.8);
    pdf.save(slug + '-visiting-card.pdf');
  } else if (type === 'stamp') {
    const png = await svgToDataUrl(document.querySelector('#export-stamp svg'), 1440, 1440, '#FFFFFF');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [120, 120] });
    pdf.addImage(png, 'PNG', 10, 10, 100, 100);
    pdf.save(slug + '-stamp.pdf');
  } else if (type === 'logo') {
    const png = await svgToDataUrl(document.querySelector('#export-logo svg'), 2000, 1200, '#FFFFFF');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [210, 126] });
    pdf.addImage(png, 'PNG', 0, 0, 210, 126);
    pdf.save(slug + '-logo.pdf');
  }
}

async function downloadAllPdfs() {
  await exportPdf('letterhead');
  await exportPdf('card');
  await exportPdf('stamp');
  await exportPdf('logo');
}
</script>
</body>
</html>
