// src/components/HeroSearch.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { universityPairs } from "../data/universities";

type HeroSearchProps = {
  initialNear?: string;
  initialPeriod?: string;
  initialRadius?: string;
};

const HeroSearch: React.FC<HeroSearchProps> = ({
  initialNear,
  initialPeriod,
  initialRadius,
}) => {
  const [near, setNear] = React.useState("");
  const [period, setPeriod] = React.useState("");
  const [radius, setRadius] = React.useState("");

  // URL 파라미터가 바뀔 때(같은 /search에서 재검색) 입력값도 갱신
  React.useEffect(() => {
    if (typeof initialNear === "string" && initialNear !== near)
      setNear(initialNear);
    if (typeof initialPeriod === "string" && initialPeriod !== period)
      setPeriod(initialPeriod);
    if (typeof initialRadius === "string" && initialRadius !== radius)
      setRadius(initialRadius);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNear, initialPeriod, initialRadius]);

  const [openNear, setOpenNear] = React.useState(false);
  const [openPeriod, setOpenPeriod] = React.useState(false);
  const [openRadius, setOpenRadius] = React.useState(false);

  const [activeNear, setActiveNear] = React.useState(-1);
  const [activePeriod, setActivePeriod] = React.useState(-1);
  const [activeRadius, setActiveRadius] = React.useState(-1);

  const nearRef = React.useRef<HTMLDivElement>(null);
  const periodRef = React.useRef<HTMLDivElement>(null);
  const radiusRef = React.useRef<HTMLDivElement>(null);
  const nearInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const RADIUS_PRESETS = [0.5, 1, 2, 3, 5, 10];
  const fmtKm = (n: number) => `${n} km 근처`;
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
    if (!near.trim()) {
      alert("대학교명을 입력해주세요.");
      nearInputRef.current?.focus();
      return;
    }
    const params = new URLSearchParams();
    params.set("near", near.trim());
    if (period.trim()) params.set("period", period.trim());
    if (radius.trim()) params.set("radius", radius.trim());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="ys-hero">
      <form className="ys-search-wrap" onSubmit={onSubmit} noValidate>
        <div className="ys-search">
          <div className="ys-auto" ref={nearRef}>
            <input
              ref={nearInputRef}
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

export default HeroSearch;
