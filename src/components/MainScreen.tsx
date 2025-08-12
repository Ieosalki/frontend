// src/components/MainScreen.tsx
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { universityPairs } from "../data/universities";

/** =========================
 *  (NEW) 학교별 이미지 섹션 데이터
 *  - src: 실제 이미지 경로로 변경하면 됨 (예: /images/snu/1.jpg)
 ========================= */
const UNIV_SECTIONS: {
  id: string;
  title: string; // 표기용
  images: { src: string; alt?: string; href?: string }[];
}[] = [
  {
    id: "snu",
    title: "서울대학교",
    images: Array.from({ length: 7 }).map((_, i) => ({
      src: `/img${i + 1}.png`,
      alt: `서울대학교 주변 숙소 샘플 ${i + 1}`,
      href: `/search?near=${encodeURIComponent("서울대학교")}`,
    })),
  },
  {
    id: "ku",
    title: "고려대학교",
    images: Array.from({ length: 7 }).map((_, i) => ({
      src: `/img${i + 7}.png`,
      alt: `고려대학교 주변 숙소 샘플 ${i + 1}`,
      href: `/search?near=${encodeURIComponent("고려대학교")}`,
    })),
  },
  {
    id: "yonsei",
    title: "연세대학교",
    images: Array.from({ length: 7 }).map((_, i) => ({
      src: `/img${i + 14}.png`,
      alt: `연세대학교 주변 숙소 샘플 ${i + 1}`,
      href: `/search?near=${encodeURIComponent("연세대학교")}`,
    })),
  },
];

/* =========================
   상단바 아래 검색(Hero) + 자동완성
========================= */
const HeroSearch: React.FC = () => {
  const [near, setNear] = React.useState("");
  const [period, setPeriod] = React.useState("");
  const [radius, setRadius] = React.useState("");

  // ------- 자동완성 상태 (3개 입력 각각) -------
  const [openNear, setOpenNear] = React.useState(false);
  const [openPeriod, setOpenPeriod] = React.useState(false);
  const [openRadius, setOpenRadius] = React.useState(false);

  const [activeNear, setActiveNear] = React.useState(-1);
  const [activePeriod, setActivePeriod] = React.useState(-1);
  const [activeRadius, setActiveRadius] = React.useState(-1);

  const nearRef = React.useRef<HTMLDivElement>(null);
  const periodRef = React.useRef<HTMLDivElement>(null);
  const radiusRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        nearRef.current?.contains(t) ||
        periodRef.current?.contains(t) ||
        radiusRef.current?.contains(t)
      )
        return;
      setOpenNear(false);
      setOpenPeriod(false);
      setOpenRadius(false);
      setActiveNear(-1);
      setActivePeriod(-1);
      setActiveRadius(-1);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ------- 1) 근처(대학) 자동완성 -------
  const nearSuggestions = React.useMemo((): Array<{
    label: string;
    lang: "ko" | "en";
  }> => {
    const raw = near.trim();
    const q = raw.toLowerCase();
    if (!q) return [];
    const isKo = /[ㄱ-ㅎ가-힣]/.test(raw);
    const isEn = /[A-Za-z]/.test(raw);

    if (isKo) {
      return universityPairs
        .filter((p) => p.ko && p.ko.toLowerCase().includes(q))
        .slice(0, 8)
        .map((p) => ({ label: p.ko, lang: "ko" }));
    }
    if (isEn) {
      return universityPairs
        .filter((p) => p.en && p.en.toLowerCase().includes(q))
        .slice(0, 8)
        .map((p) => ({ label: p.en, lang: "en" }));
    }
    return [];
  }, [near]);

  const selectNear = (label: string) => {
    setNear(label);
    setOpenNear(false);
    setActiveNear(-1);
  };

  const onNearKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!openNear && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpenNear(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveNear((p) => (p + 1) % Math.max(1, nearSuggestions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveNear((p) =>
        p <= 0 ? Math.max(0, nearSuggestions.length - 1) : p - 1
      );
    } else if (e.key === "Enter") {
      if (openNear && activeNear >= 0 && nearSuggestions[activeNear]) {
        e.preventDefault();
        selectNear(nearSuggestions[activeNear].label);
      }
    } else if (e.key === "Escape") {
      setOpenNear(false);
      setActiveNear(-1);
    }
  };

  // ------- 2) 거주기간 자동완성 -------
  const PERIOD_PRESETS = [
    "1개월",
    "2개월",
    "3개월",
    "4개월(한 학기)",
    "5개월",
    "6개월(반년)",
    "9개월",
    "12개월(1년)",
    "18개월",
    "24개월(2년)",
  ];
  const periodSuggestions = React.useMemo(() => {
    const raw = period.trim();
    if (!raw) return PERIOD_PRESETS.slice(0, 8);
    const q = raw.toLowerCase();
    return PERIOD_PRESETS.filter((s) => s.toLowerCase().includes(q)).slice(
      0,
      8
    );
  }, [period]);

  const selectPeriod = (label: string) => {
    setPeriod(label);
    setOpenPeriod(false);
    setActivePeriod(-1);
  };

  const onPeriodKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!openPeriod && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpenPeriod(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivePeriod((p) => (p + 1) % Math.max(1, periodSuggestions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivePeriod((p) =>
        p <= 0 ? Math.max(0, periodSuggestions.length - 1) : p - 1
      );
    } else if (e.key === "Enter") {
      if (openPeriod && activePeriod >= 0 && periodSuggestions[activePeriod]) {
        e.preventDefault();
        selectPeriod(periodSuggestions[activePeriod]);
      }
    } else if (e.key === "Escape") {
      setOpenPeriod(false);
      setActivePeriod(-1);
    }
  };

  // ------- 3) 반경(km) 자동완성 -------
  const RADIUS_PRESETS = [0.5, 1, 2, 3, 5, 10];
  const fmtKm = (n: number) =>
    (Number.isInteger(n) ? `${n}` : `${n}`) + " km 근처";
  const radiusSuggestions = React.useMemo(() => {
    const base = RADIUS_PRESETS.map((n) => fmtKm(n));
    const raw = radius.trim().toLowerCase();
    if (!raw) return base;

    const numTxt = raw.replace(/[^0-9.]/g, "");
    if (numTxt && !isNaN(Number(numTxt))) {
      const v = Number(numTxt);
      const dynamic = fmtKm(v);
      const filtered = base.filter((s) => s.toLowerCase().includes(numTxt));
      return [dynamic, ...filtered.filter((s) => s !== dynamic)].slice(0, 8);
    }
    return base.filter((s) => s.toLowerCase().includes(raw)).slice(0, 8);
  }, [radius]);

  const selectRadius = (label: string) => {
    setRadius(label);
    setOpenRadius(false);
    setActiveRadius(-1);
  };

  const onRadiusKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!openRadius && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpenRadius(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveRadius((p) => (p + 1) % Math.max(1, radiusSuggestions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveRadius((p) =>
        p <= 0 ? Math.max(0, radiusSuggestions.length - 1) : p - 1
      );
    } else if (e.key === "Enter") {
      if (openRadius && activeRadius >= 0 && radiusSuggestions[activeRadius]) {
        e.preventDefault();
        selectRadius(radiusSuggestions[activeRadius]);
      }
    } else if (e.key === "Escape") {
      setOpenRadius(false);
      setActiveRadius(-1);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ near, period, radius });
    setOpenNear(false);
    setOpenPeriod(false);
    setOpenRadius(false);
  };

  return (
    <section className="ys-hero">
      <form className="ys-search-wrap" onSubmit={onSubmit}>
        <div className="ys-search">
          {/* 1) 근처(대학) */}
          <div className="ys-auto" ref={nearRef}>
            <input
              className="ys-input"
              placeholder="대학교명"
              aria-label="근처 장소"
              aria-autocomplete="list"
              aria-expanded={openNear}
              aria-controls="near-suggest"
              value={near}
              onChange={(e) => {
                setNear(e.target.value);
                setOpenNear(true);
              }}
              onFocus={() => setOpenNear(true)}
              onKeyDown={onNearKeyDown}
            />
            {openNear &&
              (nearSuggestions.length > 0 ? (
                <ul className="ys-ac" id="near-suggest" role="listbox">
                  {nearSuggestions.map((s, i) => (
                    <li
                      key={`${s.lang}:${s.label}:${i}`}
                      role="option"
                      aria-selected={i === activeNear}
                      className={`ys-ac-item ${
                        i === activeNear ? "is-active" : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectNear(s.label);
                      }}
                    >
                      <span className="ys-ac-ko">{s.label}</span>
                    </li>
                  ))}
                </ul>
              ) : near.trim() ? (
                <div className="ys-ac ys-ac-empty">검색 결과가 없습니다</div>
              ) : null)}
          </div>

          <span className="ys-divider" aria-hidden="true" />

          {/* 2) 원하는 거주기간 */}
          <div className="ys-auto" ref={periodRef}>
            <input
              className="ys-input"
              placeholder="원하는 거주기간"
              aria-label="거주 기간"
              aria-autocomplete="list"
              aria-expanded={openPeriod}
              aria-controls="period-suggest"
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setOpenPeriod(true);
              }}
              onFocus={() => setOpenPeriod(true)}
              onKeyDown={onPeriodKeyDown}
            />
            {openPeriod &&
              (periodSuggestions.length > 0 ? (
                <ul className="ys-ac" id="period-suggest" role="listbox">
                  {periodSuggestions.map((label, i) => (
                    <li
                      key={`period:${label}:${i}`}
                      role="option"
                      aria-selected={i === activePeriod}
                      className={`ys-ac-item ${
                        i === activePeriod ? "is-active" : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectPeriod(label);
                      }}
                    >
                      <span className="ys-ac-ko">{label}</span>
                    </li>
                  ))}
                </ul>
              ) : period.trim() ? (
                <div className="ys-ac ys-ac-empty">검색 결과가 없습니다</div>
              ) : null)}
          </div>

          <span className="ys-divider" aria-hidden="true" />

          {/* 3) 몇 km 근처 */}
          <div className="ys-auto" ref={radiusRef}>
            <input
              className="ys-input ys-input--short"
              placeholder="몇 km 근처"
              aria-label="반경"
              aria-autocomplete="list"
              aria-expanded={openRadius}
              aria-controls="radius-suggest"
              inputMode="numeric"
              value={radius}
              onChange={(e) => {
                setRadius(e.target.value);
                setOpenRadius(true);
              }}
              onFocus={() => setOpenRadius(true)}
              onKeyDown={onRadiusKeyDown}
            />
            {openRadius &&
              (radiusSuggestions.length > 0 ? (
                <ul className="ys-ac" id="radius-suggest" role="listbox">
                  {radiusSuggestions.map((label, i) => (
                    <li
                      key={`radius:${label}:${i}`}
                      role="option"
                      aria-selected={i === activeRadius}
                      className={`ys-ac-item ${
                        i === activeRadius ? "is-active" : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectRadius(label);
                      }}
                    >
                      <span className="ys-ac-ko">{label}</span>
                    </li>
                  ))}
                </ul>
              ) : radius.trim() ? (
                <div className="ys-ac ys-ac-empty">검색 결과가 없습니다</div>
              ) : null)}
          </div>
        </div>

        <button type="submit" className="ys-search-btn">
          검색
        </button>
      </form>
    </section>
  );
};

/** =========================
 *  (NEW) 학교 이미지 그리드
 ========================= */
const UniversityRows: React.FC = () => {
  return (
    <section className="ys-univ">
      {UNIV_SECTIONS.map((sec) => (
        <div key={sec.id} className="ys-univ-row">
          <h2 className="ys-univ-title">{sec.title}</h2>
          <div className="ys-univ-grid">
            {sec.images.map((img, i) => {
              const card = (
                <div className="ys-u-card" key={`${sec.id}-${i}`}>
                  <img
                    src={img.src}
                    alt={img.alt ?? `${sec.title} 숙소 이미지`}
                    loading="lazy"
                  />
                </div>
              );
              return img.href ? (
                <Link
                  key={`${sec.id}-${i}`}
                  to={img.href}
                  aria-label={`${sec.title} 주변 숙소 보기 ${i + 1}`}
                  className="ys-u-link"
                >
                  {card}
                </Link>
              ) : (
                card
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

/* =========================
   Header (단일 선언!)
========================= */
const Header: React.FC = () => {
  const location = useLocation();
  return (
    <>
      <header className="ys-header">
        <div className="ys-inner">
          <div className="ys-brand">
            <Link
              to="/"
              aria-label="홈으로 이동"
              className="ys-logo-link"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <img src="/logo.png" alt="이어살기 로고" className="ys-logo" />
            </Link>

            <Link
              to="/"
              aria-label="홈으로 이동 (제목 클릭 시 새로고침)"
              className="ys-title-link"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              <h1 className="ys-title">
                <span className="sub">처음 시작하는 대학 자취,</span>
                <br />
                이어살기
              </h1>
            </Link>
          </div>

          <nav className="ys-quick" aria-label="빠른 메뉴">
            <Link className="ys-link" to="/login">
              로그인
            </Link>
            <Link className="ys-link" to="/consult">
              상담
            </Link>
            <Link className="ys-link" to="/guide">
              입주 안내
            </Link>
          </nav>
        </div>
      </header>

      <main className="ys-main">
        <HeroSearch />
        {/* (NEW) 학교 이미지 섹션 */}
        <UniversityRows />
      </main>

      <style>{`
        :root {
          --container-w: 1160px;
          --search-w: 1170px;
          --search-h: 38px;
        }
        html, body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; -webkit-text-size-adjust: 100%; }
        .ys-header{ position: static; top: auto; margin-top: 12px; background: transparent; border: none; z-index: 50; transform: none !important; filter: none !important; opacity: 1; backface-visibility: hidden; }
        .ys-inner{ max-width: var(--container-w); margin: 0 auto; padding: 12px 28px; display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
        .ys-brand{ display:flex; align-items:center; gap:20px; }
        .ys-logo-link{ display:inline-flex; line-height:0; text-decoration:none; }
        .ys-logo{ width:60px; height:60px; object-fit:contain; }
        .ys-title{ margin:0; line-height:1.15; color:#111827; font-weight:700; font-size:20px; }
        .ys-title .sub{ font-weight:600; }
        .ys-title-link{ text-decoration: none; color: inherit; cursor: pointer; display: inline-block; }
        .ys-title-link:focus-visible{ outline: 2px solid #111; outline-offset: 2px; }
        .ys-quick{ display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
        .ys-link{ font-size:11px; color:#000; text-decoration:none; }
        .ys-link:hover{ opacity:0.8; text-decoration:none; }

        .ys-main{ max-width: var(--container-w); margin: 0 auto; padding: 12px 28px 40px; }

        /* ---------- 검색바 ---------- */
        .ys-hero{
          display: flex;
          justify-content: center;   /* 가운데 정렬 */
          margin-top: 12px;
          width: 100%;               /* 컨테이너 폭을 100%로 */
          max-width: 100%;
          margin-left: auto;         /* 안전하게 중앙 */
          margin-right: auto;
        }
        .ys-search-wrap{ width: min(100%, 1050px); display:flex; align-items:center; gap:12px; margin: 0 auto; }
        @media (max-width: 1200px){
          .ys-hero{ width: 100%; max-width: 100%; margin-left: 0; }
        }
        .ys-search{
          flex:1; display:flex; align-items:center;
          background:#fff; border:1px solid #E5E7EB; border-radius:9999px;
          padding: 5px 13px; height: var(--search-h); min-height: var(--search-h);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04); position: relative;
        }

        /* 자동완성 */
        .ys-auto{ position:relative; flex:1; }
        .ys-ac{ position:absolute; top:100%; left:0; right:0; margin-top:8px; background:#fff; border:1px solid #E5E7EB; border-radius:12px; box-shadow: 0 10px 20px rgba(0,0,0,0.08); max-height: 280px; overflow:auto; z-index: 60; }
        .ys-ac-item{ display:flex; justify-content:space-between; align-items:center; padding:10px 12px; cursor:pointer; gap:12px; }
        .ys-ac-item:hover, .ys-ac-item.is-active{ background:#F3F4F6; }
        .ys-ac-ko{ font-size:13px; color:#111827; font-weight:600; }
        .ys-ac-en{ font-size:13px; color:#6B7280; }
        .ys-ac-empty{ padding:10px 13px; font-size:12px; color:#6B7280; }

        /* 입력칸 */
        .ys-input{ flex:1; font-size:13px; height: 100%; border:0; outline:none; background:transparent; padding:8px 6px; min-width:0; }
        .ys-input::placeholder{ font-size:12px; color:#9CA3AF; }
        .ys-input--short{ flex:0.9; }

        .ys-divider{ width:1px; height: 19px; background:#E5E7EB; margin:0 6px; }

        :root{ --g-start: #00E6D3; --g-end: #07E400; }
        .ys-search-btn{
          flex:0 0 auto; border:0; cursor:pointer; height: 38px; padding:0 15px; border-radius:9999px;
          font-weight:700; font-size:14px; color:#fff; height: var(--search-h);
          background: linear-gradient(180deg, var(--g-start) 0%, var(--g-end) 100%);
          box-shadow: 0 4px 10px rgba(7, 228, 0, 0.28);
          transition: transform .06s ease, box-shadow .12s ease, opacity .12s ease;
        }
        .ys-search-btn:hover{ transform: translateY(-1px); }
        .ys-search-btn:active{ transform: translateY(0); box-shadow: 0 2px 6px rgba(7, 228, 0, 0.22); }
        .ys-search-btn:focus-visible{ outline:2px solid var(--g-end); outline-offset:2px; }
      
        @media (max-width: 720px){
          .ys-logo { margin-left: 0px; }
          .ys-search-wrap{ flex-direction:column; gap:10px; width:100%; }
          .ys-search{ width:100%; padding:8px 12px; height: var(--search-h); min-height: var(--search-h); max-height: var(--search-h); }
          .ys-divider{ display:none; }
          .ys-input{ padding:8px 6px; font-size:13px; }
          .ys-search-btn{ width:100%; height:42px; height: var(--search-h); }
        }

        /* ---------- (NEW) 학교 이미지 그리드 ---------- */
        .ys-univ{ margin-top: 42px; }
        .ys-univ-row + .ys-univ-row{ margin-top: 32px; }
        .ys-univ-title{
          margin: 12px 6px 10px;
          font-size: 12px; line-height: 1; color: #000; font-weight: 700;
        }
        /* 큰 화면: 7열 고정, 작은 화면: 가로 스크롤 */
        .ys-univ-grid{
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
        }
        @media (max-width: 1200px){
          .ys-univ-grid{
            display: flex; gap: 12px; overflow-x: auto; padding-bottom: 2px;
            scroll-snap-type: x mandatory;
          }
          .ys-u-link, .ys-u-card{ scroll-snap-align: start; min-width: 150px; }
        }
        .ys-u-link{ text-decoration: none; }
        .ys-u-card{
          position: relative; border-radius: 14px; overflow: hidden; background: #F3F4F6;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
          transition: transform .08s ease, box-shadow .12s ease;
          aspect-ratio: 1 / 1;
        }
        .ys-u-card:hover{ transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,0.12); }
        .ys-u-card img{ width: 100%; height: 100%; object-fit: cover; display:block; }
      `}</style>
    </>
  );
};

export default function MainScreen() {
  return <Header />;
}
