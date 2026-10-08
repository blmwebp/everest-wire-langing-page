import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';

const navItems = [
  ['Products', '/products'],
  ['Industries', '/industries'],
  ['Quality & Certifications', '/quality'],
  ['About', '/about'],
  ['Insights', '/insights'],
  ['Careers', '/careers'],
  ['Contact', '/contact'],
];

const products = [
  { title: 'Wires & cables', text: 'Electrical and interconnection products for power, data and equipment applications.', badge: 'STANDARD / CATALOGUE', tags: 'UL 758 · UL 62 · SELECT STYLES', art: 'cable' },
  { title: 'Moulded power cords', text: 'Moulded cord assemblies for equipment and appliance connections.', badge: 'STANDARD / CATALOGUE', tags: 'MOULDING · CORD ASSEMBLY', art: 'cord' },
  { title: 'Connectors', text: 'Connector-related assemblies and interconnection components.', badge: 'CONFIGURATION VARIES', tags: 'ASSEMBLY · TOOL ROOM', art: 'connector' },
  { title: 'Wiring harness assemblies', text: 'Assemblies produced to customer drawings and specifications.', badge: 'MADE TO CUSTOMER DRAWING', tags: 'HARNESS ASSEMBLY · TESTING', art: 'harness' },
];
const industries = [
  ['Energy & power', 'Cable and wire requirements across power distribution and equipment.', 'Power & control cables · House wiring'],
  ['EV charging infrastructure', 'Interconnection products for charging equipment and infrastructure.', 'CHARGECORE+ · Cords · Harness assemblies'],
  ['Automotive', 'Harness and cable assemblies for vehicle systems and equipment.', 'Wiring harnesses · Appliance wiring material'],
  ['Industrial & pumps', 'Cable and connection requirements for industrial equipment and pumps.', 'Submersible cables · Equipment wires'],
  ['Consumer & appliances', 'Wires, cords and assemblies used in appliances and connected equipment.', 'Moulded cords · Flexible cords · Connectors'],
];
const certifications = [
  ['ISO 9001', 'Quality management system', 'Supports consistent, documented quality processes. Confirm current certificate scope and details with Everest.'],
  ['BIS', 'Indian product standards', 'Applicable to products within the relevant BIS scope. Everest states that it operates a BIS-recognized testing laboratory.'],
  ['UL', 'Product safety certification', 'Applies to specific listed products and constructions; examples include UL 758 and UL 62.'],
  ['C-UL / CSA', 'Canadian product approvals', 'Applies where the specific product is approved to applicable Canadian requirements.'],
  ['CE', 'European conformity marking', 'Applies to products within applicable European legislation and conformity requirements.'],
  ['RoHS', 'Restricted substances', 'Product-specific material compliance; request documentation for the selected product.'],
  ['REACH', 'Chemical substance regulation', 'Product-specific information is available on request.'],
];
const COPPER_STRANDS = `
  M0 -4C10 -4 23 -8 34 -8
  M0 -3C10 -3 23 -6 34 -6
  M0 -2C10 -2 23 -4 34 -4
  M0 -1C10 -1 23 -2 34 -2
  M0 0C10 0 23 0 34 0
  M0 1C10 1 23 2 34 2
  M0 2C10 2 23 4 34 4
  M0 3C10 3 23 6 34 6
  M0 4C10 4 23 8 34 8
`;

function Brand({ light = false, tabIndex = 0 }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} to="/" aria-label="Everest Cables & Connectors home" tabIndex={tabIndex}>
    <img src="/images/final%20logo%20Everest.svg" alt="" />
  </Link>;
}

function Header({ footerVisible }) {
  const [open, setOpen] = useState(false);
  const menuToggleRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuToggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (footerVisible && open) {
      setOpen(false);
      if (document.activeElement?.closest('.site-header')) document.activeElement.blur();
    }
  }, [footerVisible, open]);

  useEffect(() => {
    const mobileNavigation = window.matchMedia('(max-width: 1100px)');
    if (!open || !mobileNavigation.matches) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnDesktop = (event) => {
      if (!event.matches) setOpen(false);
    };

    document.body.style.overflow = 'hidden';
    mobileNavigation.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      mobileNavigation.removeEventListener('change', closeOnDesktop);
    };
  }, [open]);

  return <header
    className={`site-header ${footerVisible ? 'footer-visible' : ''}`}
    aria-hidden={footerVisible}
  >
    <div className="header-inner">
      <Brand tabIndex={footerVisible ? -1 : 0} />
      <button
        ref={menuToggleRef}
        className="menu-toggle"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="main-navigation"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        tabIndex={footerVisible ? -1 : 0}
      >
        <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path className="menu-icon-stroke menu-icon-top" d="M3 6h18" />
          <path className="menu-icon-stroke menu-icon-middle" d="M3 12h18" />
          <path className="menu-icon-stroke menu-icon-bottom" d="M3 18h18" />
        </svg>
      </button>
      <nav id="main-navigation" className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        {navItems.map(([label, href]) => <NavLink key={href} to={href} onClick={() => setOpen(false)} tabIndex={footerVisible ? -1 : 0}>{label}</NavLink>)}
        <Link className="button button-red nav-quote" to="/contact?type=quote" onClick={() => setOpen(false)} tabIndex={footerVisible ? -1 : 0}>Request a quote <span aria-hidden="true">↗</span></Link>
      </nav>
    </div>
  </header>;
}

function Eyebrow({ children, light = false }) {
  return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-dot" />{children}</div>;
}

function SectionTitle({ index, kicker, title, text, light = false }) {
  return <div className={`section-title ${light ? 'on-dark' : ''}`}>
    <div><Eyebrow light={light}>{index ? `${index} / ` : ''}{kicker}</Eyebrow><h2>{title}</h2></div>
    {text && <p>{text}</p>}
  </div>;
}

function CableDrawing() {
  return (
    <div
      className="cable-drawing"
      role="img"
      aria-label="Disconnected electrical cable with four insulated conductors and exposed stranded copper ends at each side"
    >
      <svg
        width="520"
        height="520"
        viewBox="0 0 520 520"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id="cable-copper"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#F2B36F" />
            <stop offset="50%" stopColor="#C97932" />
            <stop offset="100%" stopColor="#8E461C" />
          </linearGradient>
        </defs>

        {/* ==================================================
            EVEREST RED BACKGROUND
        ================================================== */}
        <rect
          width="520"
          height="520"
          fill="#DD2C1C"
        />

        {/* ==================================================
            LEFT / LOWER CABLE
        ================================================== */}
        <g>

          {/* DARK OUTER JACKET */}
          <path
            d="M18 415 98 335C104 329 113 329 119 335L181 397C187 403 187 412 181 418L100 500H18Z"
            fill="#202322"
          />

          {/* JACKET EDGE */}
          <path
            d="m100 335 81 81"
            stroke="#111312"
            strokeWidth="8"
          />

          {/* JACKET HIGHLIGHT */}
          <path
            d="m38 423 60-60"
            stroke="#F4F1EA"
            strokeOpacity=".32"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* ================================================
              LEFT COPPER STRANDS

              These are intentionally drawn BEFORE the
              insulated wires so part of the copper appears
              to emerge from inside the insulation.
          ================================================ */}
          <g
            fill="none"
            stroke="url(#cable-copper)"
            strokeWidth="1.65"
            strokeLinecap="round"
            opacity=".96"
          >
            <g transform="translate(135 271) rotate(-121)"><path d={COPPER_STRANDS} /></g>
            <g transform="translate(179 254) rotate(-99)"><path d={COPPER_STRANDS} /></g>
            <g transform="translate(267 329) rotate(-1)"><path d={COPPER_STRANDS} /></g>
            <g transform="translate(254 370) rotate(30)"><path d={COPPER_STRANDS} /></g>
          </g>

          {/* ================================================
              EVEREST RED ISOLATION LAYER

              This is the important fix.
              It sits behind the colored conductors and
              prevents dark/black geometry from appearing
              immediately around their curves.
          ================================================ */}
          <g
            fill="none"
            stroke="#DD2C1C"
            strokeWidth="21"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M115 350C142 323 151 298 135 271" />
            <path d="M132 368C168 335 186 299 179 254" />
            <path d="M150 384C190 348 223 330 267 329" />
            <path d="M165 399C198 367 226 354 254 370" />
          </g>

          {/* ================================================
              ACTUAL LEFT INSULATED WIRES
          ================================================ */}

          {/* YELLOW */}
          <path
            d="M115 350C142 323 151 298 135 271"
            fill="none"
            stroke="#F2C230"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* WHITE */}
          <path
            d="M132 368C168 335 186 299 179 254"
            fill="none"
            stroke="#F4F1EA"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* GREY */}
          <path
            d="M150 384C190 348 223 330 267 329"
            fill="none"
            stroke="#A7AAA8"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* YELLOW */}
          <path
            d="M165 399C198 367 226 354 254 370"
            fill="none"
            stroke="#F2C230"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ==================================================
            RIGHT / UPPER CABLE
        ================================================== */}
        <g>

          {/* DARK OUTER JACKET */}
          <path
            d="M502 18h-82l-80 80c-6 6-6 15 0 21l62 62c6 6 15 6 21 0l79-79Z"
            fill="#202322"
          />

          {/* JACKET EDGE */}
          <path
            d="m340 101 80 80"
            stroke="#111312"
            strokeWidth="8"
          />

          {/* JACKET HIGHLIGHT */}
          <path
            d="m480 91-58 58"
            stroke="#F4F1EA"
            strokeOpacity=".32"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* ================================================
              RIGHT COPPER STRANDS
          ================================================ */}
          <g
            fill="none"
            stroke="url(#cable-copper)"
            strokeWidth="1.65"
            strokeLinecap="round"
            opacity=".96"
          >
            <g transform="translate(274 142) rotate(-149)"><path d={COPPER_STRANDS} /></g>
            <g transform="translate(270 190) rotate(174)"><path d={COPPER_STRANDS} /></g>
            <g transform="translate(339 252) rotate(82)"><path d={COPPER_STRANDS} /></g>
            <g transform="translate(391 240) rotate(45)"><path d={COPPER_STRANDS} /></g>
          </g>

          {/* ================================================
              EVEREST RED ISOLATION LAYER
          ================================================ */}
          <g
            fill="none"
            stroke="#DD2C1C"
            strokeWidth="21"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M350 116C325 143 301 158 274 142" />
            <path d="M368 133C336 165 309 186 270 190" />
            <path d="M385 150C353 183 334 216 339 252" />
            <path d="M402 166C375 194 371 220 391 240" />
          </g>

          {/* ================================================
              ACTUAL RIGHT INSULATED WIRES
          ================================================ */}

          {/* YELLOW */}
          <path
            d="M350 116C325 143 301 158 274 142"
            fill="none"
            stroke="#F2C230"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* WHITE */}
          <path
            d="M368 133C336 165 309 186 270 190"
            fill="none"
            stroke="#F4F1EA"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* GREY */}
          <path
            d="M385 150C353 183 334 216 339 252"
            fill="none"
            stroke="#A7AAA8"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* YELLOW */}
          <path
            d="M402 166C375 194 371 220 391 240"
            fill="none"
            stroke="#F2C230"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ==================================================
            UPPER RIGHT ELECTRICAL ICON
        ================================================== */}
        {/*
        <g transform="translate(354 258) rotate(7) scale(.82)">
          <path
            d="m3-28-22 29h14l-7 26L20-9H5Z"
            fill="#202322"
          />
          <path
            d="m3-15-11 15h9l-4 13L10-5H2Z"
            fill="#F4F1EA"
          />
        </g>
        */}

        {/* ==================================================
            LOWER LEFT ELECTRICAL ICON
        ================================================== */}
        {/*
        <g transform="translate(244 394) rotate(-12) scale(.82)">
          <path
            d="m3-25-20 26h12l-6 23L18-8H5Z"
            fill="#202322"
          />
          <path
            d="m3-13-10 13h8l-3 11L9-4H2Z"
            fill="#F4F1EA"
          />
        </g>
        */}
      </svg>
    </div>
  );
}

function CopperDrawingIcon() {
  return <svg className="shop-process-icon" width="100%" height="56" viewBox="0 0 180 56" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
    <g transform="translate(0 4.2) scale(1.25 .85)">
    <path d="M0 22 30 27M0 26 30 28M0 30 30 29M0 34 30 30" fill="none" stroke="#C7C8C5" strokeWidth="1.6" />
    <path d="M28 24 38 28 28 32" fill="none" stroke="#F4F1EA" strokeWidth="1.5" />
    <path d="M40 18h18v20H40z" fill="#111312" stroke="#C7C8C5" strokeWidth="1.3" />
    <path d="M43 21h12v14H43z" fill="#202322" stroke="#777A78" strokeWidth="1" />
    <path d="M58 28h40" fill="none" stroke="#F4F1EA" strokeWidth="2" />
    <path d="M58 25h8M58 31h8" fill="none" stroke="#DD2C1C" strokeWidth="1.2" />
    </g>
  </svg>;
}

function CompoundingIcon() {
  return <svg className="shop-process-icon" width="100%" height="56" viewBox="0 0 180 56" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
    <g transform="translate(0 4.2) scale(1.25 .85)">
    <g fill="#C7C8C5">
      <circle cx="8" cy="17" r="2.2" /><circle cx="15" cy="24" r="2.2" /><circle cx="7" cy="34" r="2.2" />
      <circle cx="21" cy="16" r="2.2" /><circle cx="21" cy="35" r="2.2" />
    </g>
    <path d="M25 27h12" stroke="#F4F1EA" strokeWidth="1.5" />
    <path d="m34 24 4 3-4 3" fill="none" stroke="#F4F1EA" strokeWidth="1.3" />
    <path d="M42 18h22v20H42z" fill="#111312" stroke="#C7C8C5" strokeWidth="1.3" />
    <path d="M47 22v12m5-12v12m5-12v12" stroke="#777A78" strokeWidth="1.4" />
    <path d="M64 28h34" stroke="#F4F1EA" strokeWidth="2" />
    <path d="M64 28h13" stroke="#DD2C1C" strokeWidth="1.2" />
    </g>
  </svg>;
}

function ExtrusionIcon() {
  return <svg className="shop-process-icon" width="100%" height="56" viewBox="0 0 180 56" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
    <g transform="translate(0 4.2) scale(1.25 .85)">
    <path d="M0 27h34" stroke="#C7C8C5" strokeWidth="2" />
    <path d="M0 29h34" stroke="#777A78" strokeWidth="1" />
    <path d="M34 16h22v24H34z" fill="#111312" stroke="#C7C8C5" strokeWidth="1.3" />
    <path d="M39 20h12v16H39z" fill="#202322" stroke="#777A78" strokeWidth="1" />
    <path d="M56 28h37" stroke="#C7C8C5" strokeWidth="8" />
    <path d="M56 28h37" stroke="#DD2C1C" strokeWidth="4" />
    <path d="M92 23h6v10h-6z" fill="#F4F1EA" stroke="#777A78" strokeWidth="1" />
    <path d="M94 25v6" stroke="#202322" strokeWidth="1.5" />
    </g>
  </svg>;
}

function MouldedCordIcon() {
  return <svg className="shop-process-icon" width="100%" height="56" viewBox="0 0 180 56" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
    <g transform="translate(0 4.2) scale(1.25 .85)">
    <path d="M0 28h37" stroke="#F4F1EA" strokeWidth="7" />
    <path d="M30 23v10m5-10v10m5-10v10" stroke="#777A78" strokeWidth="1.4" />
    <path d="M40 18h21v20H40z" fill="#202322" stroke="#C7C8C5" strokeWidth="1.3" />
    <path d="M61 21h8v14h-8z" fill="#111312" stroke="#777A78" strokeWidth="1" />
    <path d="M69 22h19v12H69z" fill="#202322" stroke="#C7C8C5" strokeWidth="1.2" />
    <path d="M88 25h9m-9 6h9" stroke="#C7C8C5" strokeWidth="2" />
    <path d="M40 18h21" stroke="#DD2C1C" strokeWidth="1.5" />
    </g>
  </svg>;
}

function HarnessAssemblyIcon() {
  return <svg className="shop-process-icon" width="100%" height="56" viewBox="0 0 180 56" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
    <g transform="translate(0 4.2) scale(1.25 .85)">
    <path d="M0 28h39" stroke="#111312" strokeWidth="12" />
    <path d="M0 28h39" stroke="#C7C8C5" strokeWidth="8" />
    <path d="M7 21v14m4-14v14m23-14v14" stroke="#777A78" strokeWidth="1.2" />
    <path d="M39 28c14 0 11-17 25-17h20M39 28c14 0 12 17 25 17h20M50 28h34" fill="none" stroke="#F4F1EA" strokeWidth="2.4" />
    <path d="M39 28c14 0 11-17 25-17h20" fill="none" stroke="#DD2C1C" strokeWidth="2.4" />
    <path d="M84 5h12v12H84zM84 22h12v12H84zM84 41h12v12H84z" fill="#202322" stroke="#C7C8C5" strokeWidth="1.2" />
    <path d="M88 8h4m-4 17h4m-4 19h4" stroke="#777A78" strokeWidth="1" />
    </g>
  </svg>;
}

function ShopSequence({ compact = false, illustrated = false }) {
  const shops = [
    ['01', 'Copper drawing', 'Conductor preparation'],
    ['02', 'PVC compounding', 'Compound preparation'],
    ['03', 'Extrusion', 'Cable formation'],
    ['04', 'Moulded cord', 'Cord assembly'],
    ['05', 'Harness assembly', 'Drawing-led integration'],
  ];
  const processIcons = [
    <CopperDrawingIcon />,
    <CompoundingIcon />,
    <ExtrusionIcon />,
    <MouldedCordIcon />,
    <HarnessAssemblyIcon />,
  ];
  return <div className={`shop-sequence ${compact ? 'shop-sequence-compact' : ''} ${illustrated ? 'shop-sequence-illustrated' : ''}`}>
    {shops.map(([n, title, detail], i) => <div className="shop-step" key={n}>
      <span className="shop-number mono">{n}</span>{illustrated ? processIcons[i] : <span className="shop-node" aria-hidden="true" />}
      <strong>{title}</strong><small>{detail}</small>{!illustrated && i < shops.length - 1 && <span className="shop-arrow" aria-hidden="true">→</span>}
    </div>)}
  </div>;
}

function CableCrossSection() {
  return <svg className="product-drawing" viewBox="0 0 600 260" aria-hidden="true">
    <g transform="translate(-36 -15.6) scale(1.12)">
      <g fill="#202322" stroke="#111312" strokeWidth="2">
        <circle cx="365" cy="130" r="91" />
        <circle cx="365" cy="130" r="73" fill="#C7C8C5" stroke="#777A78" />
        <circle cx="365" cy="130" r="62" fill="#F4F1EA" stroke="#777A78" />
      </g>
      <g stroke="#777A78" strokeWidth="1">
        <path d="M365 68v124M303 130h124" />
      </g>
      <g stroke="#111312" strokeWidth="2">
        <circle cx="340" cy="105" r="22" fill="#DD2C1C" />
        <circle cx="390" cy="105" r="22" fill="#F4F1EA" />
        <circle cx="340" cy="155" r="22" fill="#F4F1EA" />
        <circle cx="390" cy="155" r="22" fill="#C7C8C5" />
      </g>
      <g fill="none" stroke="#777A78" strokeWidth="1.5" strokeLinecap="round">
        <path d="M327 100l9 10m-8-16 13 17m-5-19 10 16m-5-15 8 12" />
        <path d="M377 100l9 10m-8-16 13 17m-5-19 10 16m-5-15 8 12" />
        <path d="M327 150l9 10m-8-16 13 17m-5-19 10 16m-5-15 8 12" />
        <path d="M377 150l9 10m-8-16 13 17m-5-19 10 16m-5-15 8 12" />
      </g>
    </g>
    <g fill="none" stroke="#777A78" strokeWidth=".7">
      <path d="M115 48H311L344 80M115 212H311L344 180" />
      <path d="M115 48v20M115 202v10M323 72l14 14M323 188l14-14" />
      <path d="M441 47h40v28M441 213h40v-28" />
      <path d="M130 76h78l56 26M169 198h59l63-34" />
    </g>
    <g fill="#777A78" fontFamily="IBM Plex Mono, monospace" fontSize="7.5" letterSpacing=".8">
      <text x="34" y="43">ILLUSTRATIVE CROSS-SECTION / A—A</text>
      <text x="35" y="79">OUTER JACKET</text>
      <text x="35" y="202">INSULATED CONDUCTOR</text>
    </g>
  </svg>;
}

function MouldedCordDrawing() {
  return <svg className="product-drawing" viewBox="0 0 600 260" aria-hidden="true">
    <g transform="translate(-36 -15.6) scale(1.12)">
      <path d="M566 28C520 32 490 48 465 75C434 109 419 158 385 178C361 192 339 188 316 184" fill="none" stroke="#202322" strokeWidth="17" strokeLinecap="square" />
      <path d="M316 184h-30" fill="none" stroke="#111312" strokeWidth="25" />
      <path d="M317 173v22M308 173v22M299 173v22" fill="none" stroke="#777A78" strokeWidth="2" />
      <path d="M286 139h-110l-20 17v52l20 17h110z" fill="#202322" stroke="#111312" strokeWidth="2" />
      <path d="M176 139v86l-20-17v-52z" fill="#777A78" stroke="#111312" strokeWidth="2" />
      <path d="M156 162h-31v13h31zM156 189h-31v13h31z" fill="#C7C8C5" stroke="#111312" strokeWidth="2" />
      <path d="M176 151h102M176 213h102" stroke="#DD2C1C" strokeWidth="3" />
      <path d="M194 157v50M205 157v50M216 157v50" stroke="#777A78" strokeWidth="1" />
    </g>
    <g fill="none" stroke="#777A78" strokeWidth=".7">
      <path d="M493 42h-62l-25 29M258 141V92h-74M118 219h59l30-20" />
    </g>
    <g fill="#777A78" fontFamily="IBM Plex Mono, monospace" fontSize="7.5" letterSpacing=".8">
      <text x="442" y="36">FLEXIBLE CORD</text>
      <text x="123" y="88">STRAIN RELIEF</text>
      <text x="46" y="222">MOULDED BODY</text>
    </g>
  </svg>;
}

function ConnectorDrawing() {
  return <svg className="product-drawing" viewBox="0 0 600 260" aria-hidden="true">
    <g transform="translate(-57 -26) scale(1.19)">
      <path d="M37 130h105" fill="none" stroke="#202322" strokeWidth="16" strokeLinecap="square" />
      <g fill="#C7C8C5" stroke="#202322" strokeWidth="2">
        <path d="M142 101h28v58h-28z" />
        <path d="M170 81h202v98H170z" fill="#202322" />
        <path d="M372 93h46v74h-46z" fill="#C7C8C5" />
        <path d="M418 104h97v52h-97z" fill="#F4F1EA" />
      </g>
      <path d="M433 112h66v36h-66z" fill="#C7C8C5" stroke="#111312" strokeWidth="1.5" />
      <path d="M442 120h48v20h-48z" fill="#F4F1EA" stroke="#777A78" strokeWidth="1.5" />
      <path d="M182 93h176M182 167h176" stroke="#DD2C1C" strokeWidth="3" />
    </g>
    <g fill="none" stroke="#777A78" strokeWidth=".85">
      <path d="M63 67h60l33 36M278 60v21M467 84V58h-36M526 104h36M526 156h36M562 104v52" />
    </g>
    <g fill="#686B69" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing=".75">
      <text x="30" y="60">CABLE ENTRY</text>
      <text x="245" y="53">CONNECTOR BODY</text>
      <text x="431" y="49">CONTACT AREA</text>
    </g>
  </svg>;
}

function HarnessDrawing() {
  return <svg className="product-drawing" viewBox="0 0 600 260" aria-hidden="true">
    <g transform="translate(-36 -15.6) scale(1.12)">
      <path d="M72 130H310" fill="none" stroke="#111312" strokeWidth="25" strokeLinecap="square" />
      <path d="M72 130H310" fill="none" stroke="#202322" strokeWidth="19" strokeLinecap="square" />
      <g fill="none" stroke="#202322" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M310 130C324 130 321 89 345 89" stroke="#DD2C1C" />
        <path d="M310 130C325 130 325 169 347 169" />
        <path d="M310 130C330 120 330 75 417 75" />
        <path d="M310 130C340 135 355 194 430 194" stroke="#DD2C1C" />
      </g>
      <g fill="none" stroke="#C7C8C5" strokeWidth="3">
        <path d="M107 118v24M114 118v24M285 118v24M292 118v24" />
      </g>
      <g fill="none" stroke="#777A78" strokeWidth="1.5">
        <path d="M110 118v24M289 118v24" />
      </g>
      <g fill="#C7C8C5" stroke="#202322" strokeWidth="2">
        <path d="M345 73h45v32h-45zM347 153h45v32h-45zM417 59h44v32h-44zM430 178h44v32h-44z" />
        <path d="M57 115h34v30H57z" fill="#202322" />
      </g>
      <g fill="#777A78">
        <rect x="357" y="82" width="6" height="14" /><rect x="371" y="82" width="6" height="14" />
        <rect x="359" y="162" width="6" height="14" /><rect x="373" y="162" width="6" height="14" />
        <rect x="429" y="67" width="6" height="14" /><rect x="443" y="67" width="6" height="14" />
        <rect x="442" y="187" width="6" height="14" /><rect x="456" y="187" width="6" height="14" />
      </g>
      <g fill="none" stroke="#777A78" strokeWidth="2">
        <path d="M184 122v16m7-16v16m7-16v16M264 122v16m7-16v16m7-16v16" />
      </g>
    </g>
    <g fill="none" stroke="#777A78" strokeWidth=".85">
      <path d="M235 81V48h-48M290 183v29h-43M465 66h61v-29M113 152v51h67" />
    </g>
    <g fill="#686B69" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing=".75">
      <text x="112" y="42">MAIN TRUNK</text>
      <text x="246" y="228">BRANCH</text>
      <text x="449" y="31">CONNECTOR</text>
      <text x="184" y="210">CUSTOMER DRAWING</text>
    </g>
  </svg>;
}

function ProductVisual({ kind }) {
  const drawings = {
    cable: <CableCrossSection />,
    cord: <MouldedCordDrawing />,
    connector: <ConnectorDrawing />,
    harness: <HarnessDrawing />,
  };
  return <div className={`product-visual visual-${kind}`} aria-hidden="true">
    {drawings[kind]}
    <span className="visual-crosshair crosshair-a" /><span className="visual-crosshair crosshair-b" />
  </div>;
}

function ProductModules({ limit, items = products }) {
  const shown = limit ? items.slice(0, limit) : items;
  return <div className="product-grid">{shown.map((item, i) => <article className="product-module" key={item.title}>
    <div className="product-module-top mono"><span>PRODUCT FAMILY / 0{i + 1}</span><span>↗</span></div>
    <ProductVisual kind={item.art} />
    <div className="product-module-copy"><span className="technical-label">{item.badge}</span><h3>{item.title}</h3><p>{item.text}</p>
      <div className="product-tags mono">{item.tags}</div><Link to="/products" className="text-link">Explore product family <span>↗</span></Link>
    </div>
  </article>)}</div>;
}

function CertStrip() {
  const certifications = [
    ['ISO 9001', 'QUALITY MANAGEMENT SYSTEM'],
    ['BIS', 'APPLICABLE PRODUCT SCOPE'],
    ['UL', 'SELECT PRODUCTS / CONSTRUCTIONS'],
    ['C-UL / CSA', 'SELECT PRODUCTS / APPROVALS'],
    ['CE', 'WHERE APPLICABLE'],
    ['RoHS', 'PRODUCT-SPECIFIC COMPLIANCE'],
    ['REACH', 'PRODUCT-SPECIFIC INFORMATION'],
  ];
  return <section className="cert-strip">
    <div className="cert-strip-intro">
      <Eyebrow light>CERTIFICATIONS / APPROVALS</Eyebrow>
      <h2>Quality,<br />verified.</h2>
      <p>Standards, approvals and compliance frameworks supporting applicable Everest products.</p>
      <Link className="cert-strip-link mono" to="/quality">View quality & certifications <span aria-hidden="true">↗</span></Link>
    </div>
    <div className="cert-marks">{certifications.map(([cert, detail]) => <div className="cert-mark" key={cert}>
      <strong>{cert}</strong><span className="cert-mark-rule" aria-hidden="true" /><small>{detail}</small>
    </div>)}</div>
  </section>;
}

function QuoteCTA() {
  return <section className="quote-cta"><div className="quote-cta-grid" aria-hidden="true" /><div className="quote-cta-inner"><Eyebrow light>ENGINEERING / PROCUREMENT</Eyebrow><h2>Have a drawing,<br />specification or<br />requirement?</h2><p>Send us the product category, quantity, delivery requirement, drawing or specification, and certification needs.</p><div className="quote-promise mono">RESPONSE WITHIN 24 HOURS</div><div className="cta-actions"><Link className="button button-white" to="/contact?type=quote">Request a quote <span>↗</span></Link><Link className="button button-outline-white" to="/contact">General inquiry <span>↗</span></Link></div></div><div className="quote-side-note mono">EVCC / CONNECT WITH OUR TEAM / 01</div></section>;
}

function ChargecoreChargingGunSVG() {
  const titleId = useId();
  const descriptionId = useId();

  return <svg
    className="chargecore-gun-svg"
    viewBox="0 0 700 600"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
    preserveAspectRatio="xMidYMid meet"
  >
    <title id={titleId}>Conceptual EV charging gun and attached cable</title>
    <desc id={descriptionId}>A three-quarter engineering-style illustration of a charcoal and off-white charging gun with a generic connector face, red housing details and a thick cable sweeping toward the lower left. The connector is illustrative and does not represent a specific standard.</desc>

    <g fill="none" stroke="#777A78" strokeWidth="1.2">
      <path d="M359 47H490L558 207" />
      <path d="M494 538H392L258 444" />
    </g>
    <g className="chargecore-gun-annotations" fill="#C7C8C5" fontFamily="IBM Plex Mono, monospace" fontSize="14" letterSpacing=".7">
      <text x="18" y="52">EV CHARGING CONNECTOR / CONCEPT</text>
      <text x="682" y="556" textAnchor="end">CABLE ENTRY / STRAIN RELIEF</text>
    </g>

    <g aria-hidden="true">
      <path d="M263 423C239 460 207 487 173 496C132 509 91 501 61 477C43 475 27 481 12 488" fill="none" stroke="#111312" strokeWidth="66" strokeLinecap="round" />
      <path d="M263 423C239 460 207 487 173 496C132 509 91 501 61 477C43 475 27 481 12 488" fill="none" stroke="#202322" strokeWidth="56" strokeLinecap="round" />
      <path d="M235 449C211 474 180 493 146 496C119 498 94 490 74 476" fill="none" stroke="#777A78" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M218 462C195 482 167 496 139 497C117 498 96 491 80 479" fill="none" stroke="#F4F1EA" strokeOpacity=".68" strokeWidth="1.4" strokeLinecap="round" />

      <path d="M227 400 275 414 266 444Q262 456 249 451L218 439Q208 435 214 421Z" fill="#111312" stroke="#777A78" strokeWidth="2" />
      <path d="M232 410 269 424M227 421 265 435M222 432 260 446" fill="none" stroke="#C7C8C5" strokeWidth="2" />
      <path d="M229 412 267 428" fill="none" stroke="#DD2C1C" strokeWidth="3" />

      <path d="M319 282Q347 275 371 295L389 314 322 414Q313 434 294 427L257 411Q239 402 251 380L299 300Q307 286 319 282Z" fill="#111312" stroke="#777A78" strokeWidth="2" />
      <path d="M323 294Q347 287 364 302L376 317 319 403Q313 417 302 413L273 400Q263 396 270 382L309 311Q315 298 323 294Z" fill="#202322" />
      <path d="M306 333 365 350" fill="none" stroke="#DD2C1C" strokeWidth="6" />
      <path d="M299 358Q306 381 296 397" fill="none" stroke="#777A78" strokeWidth="2" />
      <path d="M300 350 352 366" fill="none" stroke="#F4F1EA" strokeOpacity=".8" strokeWidth="2" />

      <path d="M180 242Q182 207 211 183Q237 162 277 166L415 180Q452 184 477 207L493 232Q505 252 493 271Q483 289 456 299L420 311Q398 318 377 310L264 286 211 286Q181 283 175 263Z" fill="#111312" stroke="#777A78" strokeWidth="2" />
      <path d="M186 237Q190 208 216 189Q240 171 276 174L405 187Q437 190 459 210L469 226 435 246 371 260 261 253 192 260Z" fill="#F4F1EA" />
      <path d="M192 260 261 253 371 260 435 246 469 226 493 232Q505 252 493 271Q483 289 456 299L420 311Q398 318 377 310L264 286 211 286Q188 282 180 267Z" fill="#202322" />
      <path d="M215 225Q231 196 261 188L317 193 280 236 205 248Z" fill="#C7C8C5" />
      <path d="M225 219Q242 198 266 193L300 197" fill="none" stroke="#FFFFFF" strokeOpacity=".8" strokeWidth="3" />
      <path d="M349 190 406 198Q431 202 448 219" fill="none" stroke="#DD2C1C" strokeWidth="7" />
      <path d="M275 169Q291 152 322 161L341 168 330 179Z" fill="#202322" stroke="#777A78" strokeWidth="1.5" />
      <path d="M289 166 324 170" fill="none" stroke="#C7C8C5" strokeWidth="2" />

      <path d="M424 185Q447 170 472 180L515 199Q536 208 548 227L539 264Q534 282 513 288L465 275 436 248Z" fill="#111312" stroke="#777A78" strokeWidth="2" />
      <path d="M433 188Q451 177 472 185L509 202Q525 209 532 226L524 255Q520 270 503 273L467 263 444 240Z" fill="#F4F1EA" />
      <path d="M444 240 467 263 503 273Q520 270 524 255L539 264Q534 282 513 288L465 275 436 248Z" fill="#202322" />
      <path d="M438 205 491 223 514 237" fill="none" stroke="#DD2C1C" strokeWidth="6" />

      <path d="M509 199Q533 191 553 203L602 225Q623 235 619 258L606 298Q600 316 579 311L530 290Q513 283 509 265L519 226Z" fill="#111312" stroke="#777A78" strokeWidth="2" />
      <path d="M518 203Q537 196 553 207L598 228Q614 235 610 253L600 288Q596 301 581 297L537 279Q523 274 520 261L529 228Z" fill="#202322" />
      <ellipse cx="582" cy="256" rx="42" ry="59" transform="rotate(24 582 256)" fill="#111312" stroke="#777A78" strokeWidth="2" />
      <ellipse cx="583" cy="254" rx="33" ry="48" transform="rotate(24 583 254)" fill="#C7C8C5" stroke="#F4F1EA" strokeWidth="3" />
      <ellipse cx="583" cy="253" rx="22" ry="35" transform="rotate(24 583 253)" fill="#202322" stroke="#111312" strokeWidth="2" />
      <g transform="rotate(24 583 253)" fill="#F4F1EA">
        <ellipse cx="575" cy="245" rx="6.5" ry="10" />
        <ellipse cx="592" cy="255" rx="5.5" ry="8" />
        <rect x="573" y="266" width="14" height="8" rx="4" />
      </g>
      <path d="M610 238Q621 253 609 273" fill="none" stroke="#FFFFFF" strokeOpacity=".78" strokeWidth="2" />

      <path d="M326 293Q357 284 375 305Q386 319 374 339L353 369" fill="none" stroke="#111312" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M326 293Q357 284 375 305Q386 319 374 339L353 369" fill="none" stroke="#777A78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M329 299Q349 292 364 305L370 316 359 335 344 356Q340 360 336 356L352 333Q361 321 352 314Q341 309 329 315Z" fill="#111312" />
      <path d="M339 306Q354 302 361 313L349 335" fill="none" stroke="#F4F1EA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>;
}

function Footer({ footerRef }) {
  return <footer className="site-footer" ref={footerRef}>
    <div className="footer-brand">
      <img className="footer-logo" src="/images/final%20logo%20Everest%20white%20logo.png" alt="Everest" />
      <p className="footer-tagline">The No Problem Cables</p>
      <nav className="footer-nav" aria-label="Footer navigation">
        {navItems.map(([name, href]) => <Link key={href} to={href}>{name}</Link>)}
      </nav>
    </div>
    <div className="footer-contact">
      {/* <div className="footer-origin">
        <span className="footer-since mono">EST. / 1965</span>
        <span className="footer-country mono">INDIA</span>
        <p>Wires, cables and electrical interconnection products. Manufacturing continuously since 1965.</p>
      </div> */}
      <div className="footer-contact-links">
        <svg className="footer-contact-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 3a14 14 0 0 1-6-6l3-2-2-5Z" /></svg>
        <a href="mailto:sales@everestcables.com">sales@everestcables.com </a>
        <a href="tel:+919971445656">+91 99714 45656</a>
        <a href="tel:+917011342634">+91 70113 42634</a>
      </div>
      <address><svg className="footer-location-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg><span>No. 507, Ring Road Mall, 21 Mangalam Place, Sector 3, Rohini, Delhi 110085, India</span></address>
    </div>
    <div className="footer-bottom mono">
      <span>EVEREST CABLES & CONNECTORS PVT. LTD.</span>
      <span>ENGINEERED CONNECTIONS / SINCE 1965</span>
    </div>
  </footer>;
}

function Shell({ children }) {
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry.isIntersecting);
    }, { threshold: 0.05 });

    observer.observe(footer);
    return () => {
      observer.unobserve(footer);
      observer.disconnect();
    };
  }, []);

  return <><Header footerVisible={footerVisible} />{children}<Footer footerRef={footerRef} /></>;
}

function Home() {
  return <>
    <main>
      <section className="hero">
      <div className="hero-grid" aria-hidden="true" /><div className="hero-content"><div className="hero-overline"><Eyebrow light>ENGINEERED CONNECTIONS / SINCE 1965</Eyebrow><span className="hero-origin mono">EST. / 1965<br />INDIA</span></div>
        <h1>From conductor<br />to connection.</h1>
        <p>Manufacturing wires and cables, moulded power cords, connectors and wiring harness assemblies since 1965—with integrated manufacturing and in-house testing.</p>
        <div className="hero-actions"><Link className="button button-white" to="/contact?type=quote">Request a quote <span>↗</span></Link><Link className="button button-outline-white" to="/products">Explore products <span>↗</span></Link></div>
      </div><div className="cable-drawing">
        {/* Original CableDrawing SVG temporarily disabled in favor of the supplied hero image. Keep available for restoration. */}
        {/* <CableDrawing /> */}
        <img
          src="/images/AG.png"
          alt="Assortment of electrical cables, cable reels, and exposed wire conductors"
          className="hero-image"
          width="1600"
          height="1200"
          fetchpriority="high"
          decoding="async"
        />
      </div><div className="hero-caption mono">EVEREST CABLES & CONNECTORS / INDIA</div>
      </section>
      <CertStrip />
      <section className="section products-section"><SectionTitle kicker="WHAT WE MAKE" title={<><span>One manufacturing system.</span><br /><span>Multiple ways to connect.</span></>} text="From catalogue wires and cables to assemblies made to customer drawings, explore the product families built across Everest's integrated capabilities." /><ProductModules limit={4} /><div className="section-foot"><Link className="button button-dark" to="/products">View all product families <span>↗</span></Link><span className="mono">STANDARD / CATALOGUE &nbsp;·&nbsp; CUSTOMER DRAWING</span></div></section>
      <section className="process-section"><div className="process-inner"><SectionTitle kicker="INTEGRATED MANUFACTURING" title={<>From copper<br />to connection.</>} text="A connected sequence across five integrated shops—bringing critical stages of wire, cable and assembly production under one operation." light /><ShopSequence illustrated /><div className="process-foot mono"><span>01—05 / MANUFACTURING SEQUENCE</span><span>COPPER DRAWING → COMPOUNDING → EXTRUSION → MOULDED CORD → HARNESS</span></div></div><div className="process-vertical-mark mono">INTEGRATED MANUFACTURING / 01—05</div></section>
      <section className="quality-band"><div className="quality-diagram">
        <svg className="quality-control-diagram" viewBox="0 0 560 300" role="img" aria-labelledby="quality-diagram-title quality-diagram-desc">
          <title id="quality-diagram-title">Quality control throughout manufacturing</title>
          <desc id="quality-diagram-desc">Input, process, and assembly checkpoints are connected along the manufacturing flow, with inspection points and a central test and verification node.</desc>
          <g fill="#686B69" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing=".6">
            <text x="70" y="72" textAnchor="middle">INPUT CONTROL</text>
            <text x="280" y="72" textAnchor="middle">PROCESS CONTROL</text>
            <text x="490" y="72" textAnchor="middle">ASSEMBLY CONTROL</text>
          </g>
          <g fill="none" stroke="#777A78" strokeWidth="1.2">
            <path d="M42 98H518" />
            <path d="M70 104V204M280 104V214M490 104V204" />
            <path d="M70 204H230M330 204H490" />
            <path d="M49 90v16m-7-8h14M511 90v16m-7-8h14" />
          </g>
          <g fill="#202322" stroke="#C7C8C5" strokeWidth="1.4">
            <rect x="63" y="91" width="14" height="14" />
            <rect x="273" y="91" width="14" height="14" />
            <rect x="483" y="91" width="14" height="14" />
          </g>
          <g fill="#DD2C1C">
            <rect x="169" y="94" width="8" height="8" />
            <rect x="383" y="94" width="8" height="8" />
            <rect x="276" y="200" width="8" height="8" />
          </g>
          <g fill="#686B69" fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing=".7">
            <text x="280" y="192" textAnchor="middle">TEST / VERIFY</text>
          </g>
          <rect x="230" y="214" width="100" height="42" fill="#202322" stroke="#DD2C1C" strokeWidth="1.5" />
          <path d="M238 222h8m-8 0v8m76-8h8m0 0v8m-84 18h8m-8 0v-8m76 8h8m0 0v-8" fill="none" stroke="#777A78" strokeWidth="1" />
          <text x="280" y="242" textAnchor="middle" fill="#F4F1EA" fontFamily="IBM Plex Mono, monospace" fontSize="15" letterSpacing="1.2">QC</text>
        </svg>
        <div className="quality-scale mono">BIS-RECOGNIZED LAB / IN-HOUSE TESTING</div>
      </div><div className="quality-copy"><Eyebrow>QUALITY SYSTEMS</Eyebrow><h2>Quality is not<br />a final check.</h2><p>In-house testing and integrated process control support products and assemblies across our manufacturing operations, including testing through our BIS-recognized laboratory.</p><div className="quality-tags mono"><span>BIS-RECOGNIZED LAB</span><span>IN-HOUSE TESTING</span><span>PROCESS CONTROL</span></div><Link className="text-link" to="/quality">Explore quality systems <span>↗</span></Link></div></section>
      <section className="section industries-section"><SectionTitle kicker="INDUSTRIES SERVED" title={<>Connections for<br />critical applications.</>} text="Start with the application. Find product families and capabilities relevant to the systems you build." /><div className="industry-list">{industries.map(([name, text, links], i) => <Link className="industry-row" to="/industries" key={name}><span className="mono industry-index">0{i + 1}</span><h3>{name}</h3><p>{text}</p><span className="industry-products mono">{links}</span><span className="industry-arrow">↗</span></Link>)}</div></section>
      <section className="chargecore-section"><div className="chargecore-copy"><div className="chargecore-mark mono">NEW CAPABILITY</div><Eyebrow light>EV CHARGING INFRASTRUCTURE</Eyebrow><h2>CHARGECORE<span>+</span></h2><p>A new Everest capability platform for EV charging infrastructure. Talk to our team about your application and requirements.</p><Link className="button button-white" to="/products#chargecore">Discover CHARGECORE+ <span>↗</span></Link></div><div className="chargecore-art"><ChargecoreChargingGunSVG /></div></section>
      <section className="heritage-section"><div className="heritage-year mono">1965 <span>→</span> TODAY</div><div><Eyebrow>HERITAGE</Eyebrow><h2>Continuously<br />making since 1965.</h2><p>From a modest beginning producing small cables to a broader manufacturing operation spanning wires, cables, harness assemblies, moulded cords and connectors.</p><Link className="text-link" to="/about">Our story <span>↗</span></Link></div><div className="heritage-line"><span className="heritage-node mono">1965<br />ESTABLISHED</span><span className="heritage-continuation mono">CONTINUOUS OPERATION / TODAY</span></div></section>
      <QuoteCTA />
      <section className="section insights-section"><SectionTitle kicker="INSIGHTS" title="Technical notes." text="Engineering-led reading on standards, EV infrastructure, quality and manufacturing. Articles will be published here as they become available." /><div className="insights-empty"><span className="mono">EDITORIAL INDEX / 001—004</span><p>Technical notes are in development.</p><Link className="text-link" to="/insights">Visit insights <span>↗</span></Link></div></section>
    </main>
  </>;
}

function PageHero({ eyebrow, title, text, meta }) {
  return <section className="page-hero"><div className="page-hero-inner"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{text}</p>{meta && <div className="page-hero-meta mono">{meta}</div>}</div><div className="page-hero-grid" aria-hidden="true" /></section>;
}

function PageIntro({ index, kicker, title, text }) { return <div className="page-intro"><SectionTitle index={index} kicker={kicker} title={title} text={text} /></div>; }

function About() {
  return <main><PageHero eyebrow="ABOUT EVEREST / 1965—TODAY" title={<>Continuously<br />making since 1965.</>} text="A manufacturing operation built around wires, cables and electrical interconnection products—growing from a modest beginning into an integrated, multi-process business." meta="ESTABLISHED / 1965     FACILITY / APPROX. 87,000 SQ FT" />
    <section className="section story-section"><PageIntro index="01" kicker="OUR STORY" title="Built through making." text="Everest Cables & Connectors Private Limited, formerly Universal Spares (India) Private Limited, has manufactured electrical interconnection products continuously since 1965." /><div className="timeline"><div className="timeline-year mono">1965</div><div className="timeline-rule"><span /></div><div className="timeline-copy"><Eyebrow>ESTABLISHED</Eyebrow><p>Beginning with small cables, the company has expanded its product families and integrated manufacturing capabilities over time.</p><span className="mono">FURTHER MILESTONES / CLIENT TO CONFIRM</span></div><div className="timeline-year mono timeline-today">TODAY</div></div></section>
    <section className="dark-facts"><div><Eyebrow light>MANUFACTURING SCALE</Eyebrow><strong>~87,000</strong><span className="mono">SQ FT / FACILITY</span></div><div><Eyebrow light>INTEGRATED PROCESS</Eyebrow><strong>05</strong><span className="mono">CONNECTED SHOPS</span></div><div className="dark-facts-copy"><h2>One connected<br />manufacturing system.</h2><p>From copper drawing and PVC compounding through extrusion, moulded cords and harness assembly.</p></div></section>
    <section className="section"><SectionTitle index="02" kicker="INTEGRATED CAPABILITIES" title={<>From copper<br />to connection.</>} text="A connected sequence across five integrated shops, supported by tool-room capability and testing." /><ShopSequence /></section>
    <section className="leadership-section"><div><Eyebrow>03 / LEADERSHIP</Eyebrow><h2>Experience that<br />builds continuity.</h2><p>Leadership profiles and the formal group photograph will be added when approved assets and names are supplied.</p><span className="mono">LEADERSHIP DETAILS / CLIENT TO CONFIRM</span></div><div className="leadership-placeholder mono">LEADERSHIP<br />PORTRAIT / ASSET PENDING</div></section>
    <CertStrip /><QuoteCTA /></main>;
}

function Industries() {
  return <main><PageHero eyebrow="APPLICATIONS / INDUSTRIES" title={<>Start with<br />the application.</>} text="Explore the product families and manufacturing capabilities relevant to the systems you build." meta="05 INDUSTRY ENTRY POINTS / PRODUCT-LINKED" />
    <section className="section industry-page-list"><PageIntro index="01" kicker="INDUSTRIES SERVED" title="Engineering context matters." text="Requirements vary by equipment and application. Share the drawing, specification and intended use so our team can help identify a relevant product family." />
      {industries.map(([name, text, links], i) => <article className="industry-detail" key={name}><span className="mono">0{i + 1} / APPLICATION</span><div><h2>{name}</h2><p>{text}</p></div><div><span className="mono">RELATED PRODUCT FAMILIES</span><p>{links}</p><Link className="text-link" to="/products">Explore products <span>↗</span></Link></div></article>)}
    </section><QuoteCTA /></main>;
}

function Products() {
  const [filter, setFilter] = useState('ALL PRODUCTS');
  const filtered = filter === 'ALL PRODUCTS' ? products : products.filter((item) => item.badge.includes(filter));
  const allFamilies = ['UL Approved Wires & Cables', 'UL/CSA Appliance Wiring Material', 'UL/CSA Wiring Harnesses', 'UL/CSA Flexible Cords', 'Wiring Harness Assemblies', 'Moulded Power Cords', 'LAN Cables', 'Fire Alarm Cables', 'House Wiring & Flexible Cables', 'Microphone Cables', 'LT PVC Power & Control Cables', 'Submersible Cables', 'Radio Frequency Coaxial Cables', 'Instrumentation & Data Cables', 'Twisted Pair Data Transmission Cables', 'Equipment Wires', 'CCTV Cables', 'Telephone & Switchboard Cables', 'PVC Cables', 'Solar Cables', 'HDMI Cables'];
  return <main><PageHero eyebrow="PRODUCTS / TECHNICAL DIRECTORY" title={<>Find the right<br />connection.</>} text="Browse Everest product families by type and application. Standards apply to specific products and constructions—confirm applicability during technical review." meta="STANDARD / CATALOGUE     MADE TO CUSTOMER DRAWING" />
    <section className="section products-page"><PageIntro index="01" kicker="PRODUCT FAMILIES" title="A catalogue built for scanning." text="Start with a family. For product-specific construction, rating, standard and configuration, request the applicable technical documentation." />
      <div className="filter-row mono" role="group" aria-label="Filter product families">{['ALL PRODUCTS', 'STANDARD / CATALOGUE', 'MADE TO CUSTOMER DRAWING'].map((choice) => <button key={choice} className={filter === choice ? 'filter-active' : ''} aria-pressed={filter === choice} onClick={() => setFilter(choice)}>{choice}</button>)}</div>
      <ProductModules items={filtered} />
      <div className="family-index"><div className="family-index-heading"><Eyebrow>DETAILED CATALOGUE INDEX</Eyebrow><h2>More product families.</h2><p>Availability, construction and ratings vary by product. Ask us for the relevant specification.</p></div><div className="family-tags">{allFamilies.map((family, i) => <div key={family}><span className="mono">0{i + 1}</span><strong>{family}</strong><span>↗</span></div>)}</div></div>
      <div id="chargecore" className="chargecore-product"><Eyebrow>NEW CAPABILITY / EV CHARGING</Eyebrow><h2>CHARGECORE<span>+</span></h2><p>A new Everest capability platform for EV charging infrastructure. Contact our team with your application and requirements.</p><Link className="button button-dark" to="/contact?type=quote">Discuss your requirement <span>↗</span></Link></div>
      <div className="spec-note mono">PRODUCT RATINGS, CONSTRUCTIONS AND STANDARDS ARE PRODUCT-SPECIFIC. REQUEST THE CURRENT SPECIFICATION FOR YOUR REQUIREMENT.</div>
    </section><QuoteCTA /></main>;
}

function Quality() {
  return <main><PageHero eyebrow="QUALITY / COMPLIANCE" title={<>Proof, mapped<br />to the product.</>} text="Standards and approvals are product-specific. Everest states that it operates a BIS-recognized testing laboratory; request current product documentation to confirm scope and applicability." meta="IN-HOUSE TESTING / BIS-RECOGNIZED LAB" />
    <section className="section quality-page"><PageIntro index="01" kicker="STANDARDS & APPROVALS" title="Know what applies." text="The marks below describe standard or regulatory frameworks. They are not a claim that every Everest product is certified or compliant to every mark." />
      <div className="cert-detail-list">{certifications.map(([name, what, meaning], i) => <article key={name} className="cert-detail"><span className="mono cert-detail-number">0{i + 1} / SCOPE</span><h2>{name}</h2><div><span className="mono">WHAT IT IS</span><p>{what}</p></div><div><span className="mono">WHAT IT MEANS TO THE BUYER</span><p>{meaning}</p></div><span className="mono cert-confirm">PRODUCT-SPECIFIC / VERIFY SCOPE</span></article>)}</div>
    </section>
    <section className="lab-feature"><div className="lab-illustration" aria-hidden="true"><span className="lab-circle" /><span className="lab-axis axis-one" /><span className="lab-axis axis-two" /><span className="lab-measure mono">TEST / MEASURE / VERIFY</span><strong>BIS</strong></div><div><Eyebrow light>IN-HOUSE TESTING</Eyebrow><h2>Measurement<br />in the process.</h2><p>Everest states that it operates a BIS-recognized testing laboratory. Contact us for product-specific testing information and available documentation.</p><span className="mono lab-tag">BIS-RECOGNIZED TESTING LABORATORY</span></div></section>
    <section className="section downloads"><SectionTitle index="02" kicker="TECHNICAL DOCUMENTS" title="Request current documentation." text="No certificate numbers, validity dates or downloadable files are published until verified assets are supplied." /><div className="download-row"><div><span className="mono">DOCUMENT / 01</span><h3>Certificate PDF</h3><p>Request the current certificate and scope relevant to your product.</p></div><Link className="text-link" to="/contact">Request document <span>↗</span></Link></div><div className="download-row"><div><span className="mono">DOCUMENT / 02</span><h3>Product specification PDF</h3><p>Ask for the construction, rating and standard details for a selected product.</p></div><Link className="text-link" to="/contact?type=quote">Request specification <span>↗</span></Link></div></section><QuoteCTA /></main>;
}

function Careers() {
  return <main><PageHero eyebrow="CAREERS / BUILD THROUGH MAKING" title={<>Five integrated shops.<br />One place to build<br />real experience.</>} text="Work across manufacturing processes and electrical interconnection products in a professional environment built around learning, clear systems and equal opportunity." meta="TRAINING / DEVELOPMENT / EQUAL OPPORTUNITY" />
    <section className="section careers-content"><PageIntro index="01" kicker="WORK AT EVEREST" title="See how the whole system connects." text="Experience across copper drawing, compounding, extrusion, moulded cords, harness assembly and testing can build a grounded understanding of manufacturing." /><ShopSequence compact /><div className="career-values">{[['01', 'Professional environment', 'A workplace focused on clear responsibilities and professional conduct.'], ['02', 'Transparent systems', 'Defined policies and processes that support day-to-day work.'], ['03', 'Learning & development', 'Training and development opportunities across roles and manufacturing processes.'], ['04', 'Equal opportunity', 'A commitment to fair consideration and opportunity.']].map(([n, title, text]) => <article key={n}><span className="mono">{n} / PEOPLE</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className="open-roles"><div><Eyebrow>GENERAL INTEREST APPLICATION</Eyebrow><h2>No roles listed right now.</h2><p>We are not publishing vacancies at this time. Send a short introduction and your area of interest for future consideration.</p></div><Link className="button button-dark" to="/contact?type=general">Contact our team <span>↗</span></Link></div></section><QuoteCTA /></main>;
}

function Insights() {
  const topics = ['STANDARDS', 'EV INFRASTRUCTURE', 'QUALITY', 'ENGINEERING'];
  return <main><PageHero eyebrow="INSIGHTS / ENGINEERING NOTES" title={<>Technical notes.<br />No noise.</>} text="A concise editorial resource for standards, EV infrastructure, quality and engineering topics relevant to electrical interconnection." meta="EDITORIAL INDEX / ARTICLES PUBLISHED AS AVAILABLE" />
    <section className="section insights-page"><PageIntro index="01" kicker="EDITORIAL INDEX" title="Useful context for technical teams." text="Articles will be published here when reviewed and approved. No sample publication history or unverified authors are shown." /><div className="topic-index">{topics.map((topic, i) => <div key={topic}><span className="mono">0{i + 1}</span><h2>{topic}</h2><span className="mono">IN DEVELOPMENT</span></div>)}</div><div className="insights-empty insights-empty-large"><span className="mono">NO ARTICLES PUBLISHED</span><p>Technical notes are in development. Contact our team for product and standards information.</p><Link className="text-link" to="/contact">Ask a technical question <span>↗</span></Link></div></section><QuoteCTA /></main>;
}

function InquiryForm({ type }) {
  const quote = type === 'quote';
  const [status, setStatus] = useState({ kind: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setStatus({ kind: '', message: '' });
    const body = new FormData(form);
    body.set('type', type);
    try {
      const response = await fetch('/api/inquiries', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your inquiry could not be submitted.');
      setStatus({ kind: 'success', message: result.message });
      form.reset();
    } catch (error) {
      setStatus({ kind: 'error', message: error.message || 'The server could not be reached. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }
  return <form className="inquiry-form" onSubmit={submit}>
    {quote ? <>
      <div className="form-grid"><label>Company <input name="company" autoComplete="organization" required /></label><label>Contact name <input name="name" autoComplete="name" required /></label><label>Work email <input name="email" type="email" autoComplete="email" required /></label><label>Phone <input name="phone" type="tel" autoComplete="tel" /></label>
        <label>Product category <select name="productCategory" required defaultValue=""><option value="" disabled>Select category</option>{['Wires & cables', 'Moulded power cords', 'Connectors', 'Wiring harness assemblies', 'CHARGECORE+', 'Other / not sure'].map((x) => <option key={x}>{x}</option>)}</select></label><label>Estimated quantity <input name="quantity" required /></label><label>Delivery timeline <input name="timeline" required /></label><label>Certification requirements <input name="certifications" /></label>
      </div><label>Drawing / specification upload <input name="specification" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" /><small>PDF, JPG or PNG · Maximum 5 MB</small></label><label>Additional requirements <textarea name="requirements" rows="4" /></label>
    </> : <>
      <div className="form-grid"><label>Name <input name="name" autoComplete="name" required /></label><label>Company <input name="company" autoComplete="organization" required /></label><label>Email <input name="email" type="email" autoComplete="email" required /></label><label>Phone <input name="phone" type="tel" autoComplete="tel" /></label></div><label>Subject <input name="subject" required /></label><label>Message <textarea name="message" rows="5" required /></label>
    </>}
    {status.message && <div role="status" className={`form-status ${status.kind}`}>{status.message}</div>}
    <button className="button button-red" type="submit" disabled={submitting}>{submitting ? 'Sending…' : quote ? 'Submit quote request' : 'Send inquiry'} <span>↗</span></button>
  </form>;
}

function Contact() {
  const location = useLocation();
  const requestedType = new URLSearchParams(location.search).get('type');
  const [active, setActive] = useState(requestedType === 'quote' ? 'quote' : 'general');
  useEffect(() => {
    setActive(requestedType === 'quote' ? 'quote' : 'general');
  }, [requestedType]);
  return <main><PageHero eyebrow="CONTACT / CONNECT WITH EVEREST" title={<>Let's discuss<br />your requirement.</>} text="Share the application, product category and relevant specification. Select the right inquiry route to get started." meta="SALES / SALES@EVERESTCABLES.COM" />
    <section className="contact-page"><div className="contact-form-column"><div className="contact-form-heading"><Eyebrow>01 / SEND AN INQUIRY</Eyebrow><h2>What can we help with?</h2></div><div className="form-tabs" role="tablist" aria-label="Inquiry type"><button role="tab" aria-selected={active === 'general'} className={active === 'general' ? 'tab-active' : ''} onClick={() => setActive('general')}>General inquiry</button><button role="tab" aria-selected={active === 'quote'} className={active === 'quote' ? 'tab-active' : ''} onClick={() => setActive('quote')}>Request a quote</button></div>
      {active === 'quote' && <div className="response-note mono">QUOTE REQUESTS / RESPONSE WITHIN 24 HOURS</div>}<InquiryForm key={active} type={active} />
    </div><aside className="contact-details"><Eyebrow light>02 / CONTACT DETAILS</Eyebrow><h2>Everest Cables &<br />Connectors Pvt. Ltd.</h2><address>No. 507, Ring Road Mall<br />21 Mangalam Place<br />Sector 3, Rohini<br />Delhi 110085, India</address><div className="contact-detail-block"><span className="mono">PHONE</span><a href="tel:+919971445656">+91 99714 45656</a><a href="tel:+917011342634">+91 70113 42634</a></div>    <div className="contact-detail-block"><span className="mono">EMAIL</span><a href="mailto:sales@everestcables.com">sales@everestcables.com</a></div><div className="map-panel"><iframe title="Map to Everest Cables & Connectors, Rohini, Delhi" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=No.%20507%2C%20Ring%20Road%20Mall%2C%20Mangalam%20Place%2C%20Rohini%2C%20Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed" /><span className="mono">ROHINI / DELHI, INDIA</span><a href="https://maps.google.com/?q=No.+507,+Ring+Road+Mall,+Mangalam+Place,+Rohini,+Delhi" target="_blank" rel="noreferrer">Open map ↗</a></div></aside></section></main>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return <><ScrollToTop /><Shell><Routes>
    <Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/industries" element={<Industries />} />
    <Route path="/products" element={<Products />} /><Route path="/quality" element={<Quality />} /><Route path="/careers" element={<Careers />} />
    <Route path="/insights" element={<Insights />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<Home />} />
  </Routes></Shell></>;
}
