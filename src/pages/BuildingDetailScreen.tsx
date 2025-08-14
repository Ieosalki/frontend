import * as React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../styles/building-detail.css";

/** ========== 타입 ========== */
type BuildingDetail = {
  id: string;
  title: string;
  images: string[];
  address?: string;
  near?: string; // 인근 대학명 등
  deposit?: number; // 보증금
  rent?: number; // 월세
  maintenanceFee?: number; // 관리비
  floor?: string; // 예: "3/5층"
  builtYear?: number; // 준공연도
  sizeM2?: number; // 전용 면적 (m²)
  amenities?: string[]; // 편의시설 태그
  description?: string; // 소개글
};

/** ========== 유틸 ========== */
const formatKRW = (n?: number) => (n == null ? "-" : n.toLocaleString("ko-KR"));

const toMapsLink = (q: string) =>
  `https://maps.google.com/?q=${encodeURIComponent(q)}`;

/**
 * 임시 모킹 API: 실제 API로 교체하세요.
 * 예: GET /api/buildings/:id → BuildingDetail
 */
async function getBuildingDetail(id: string): Promise<BuildingDetail> {
  // 샘플 데이터를 id 기준으로 생성
  return new Promise((resolve) =>
    setTimeout(() => {
      const images = buildImagesFromId(id);
      resolve({
        id,
        title: idToTitle(id),
        images,
        address: "서울 관악구 대학동 XX로 12",
        near: labelFromPrefix(id),
        deposit: 5000000,
        rent: 650000,
        maintenanceFee: 70000,
        floor: "3/5층",
        builtYear: 2017,
        sizeM2: 23.1,
        amenities: [
          "엘리베이터",
          "CCTV",
          "세탁기",
          "에어컨",
          "가스레인지",
          "와이파이",
        ],
        description:
          "샘플 상세 페이지입니다. 실제 API 연결 후 정보를 교체하세요. 조용한 주택가에 위치하며 대로변 접근이 편리합니다.",
      });
    }, 200)
  );
}

// 'snu-3' → '서울대 인근 샘플 3' 같은 제목 생성
function idToTitle(id: string) {
  const [prefix, num] = id.split("-");
  const base = labelFromPrefix(prefix);
  return `${base} 인근 샘플${num ? ` ${num}` : ""}`;
}

function labelFromPrefix(prefix: string) {
  const map: Record<string, string> = {
    snu: "서울대",
    ku: "고려대",
    yonsei: "연세대",
  };
  return map[prefix] ?? "대학";
}

// UNIV_SECTIONS의 /imgX.png를 재활용해서 5장 갤러리 구성
function buildImagesFromId(id: string) {
  const n = parseInt(id.split("-")[1] ?? "1", 10);
  const start = Number.isFinite(n) ? Math.max(1, n) : 1;
  const max = 20; // 프로젝트에 있는 샘플 이미지 개수만큼 조정
  const arr: string[] = [];
  for (let i = 0; i < 5; i++) {
    const idx = ((start + i - 1) % max) + 1;
    arr.push(`/img${idx}.png`);
  }
  return arr;
}

/** ========== 화면 ========== */
export default function BuildingDetailScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const [data, setData] = React.useState<BuildingDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    getBuildingDetail(id)
      .then((res) => {
        if (!alive) return;
        setData(res);
        setActiveIndex(0);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message ?? "상세 정보를 불러오지 못했습니다.");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="ys-bd">
        <div className="ys-bd-topbar">
          <button className="ys-btn ghost" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
        </div>
        <div className="ys-skeleton-hero" />
        <div className="ys-bd-grid">
          <div className="ys-bd-main">
            <div className="ys-skeleton-block" />
            <div className="ys-skeleton-block" />
          </div>
          <aside className="ys-bd-side">
            <div className="ys-skeleton-card" />
          </aside>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="ys-bd">
        <div className="ys-bd-topbar">
          <button className="ys-btn ghost" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
        </div>
        <div className="ys-error">
          {error ?? "상세 정보를 불러오지 못했습니다."}
        </div>
      </main>
    );
  }

  const mainImg = data.images[activeIndex] ?? data.images[0];

  return (
    <main className="ys-bd">
      <div className="ys-bd-topbar">
        <button className="ys-btn ghost" onClick={() => navigate(-1)}>
          ← 뒤로
        </button>
        <div className="ys-breadcrumb">
          <Link to="/">홈</Link>
          <span> / </span>
          <Link to={`/search?near=${encodeURIComponent(data.near ?? "")}`}>
            {data.near ?? "주변"}
          </Link>
          <span> / </span>
          <span aria-current="page">{data.title}</span>
        </div>
      </div>

      {/* 이미지 갤러리 */}
      <section aria-label="이미지 갤러리">
        <div className="ys-bd-hero">
          {mainImg ? (
            <img src={mainImg} alt={`${data.title} 대표 이미지`} />
          ) : (
            <div className="ys-empty">이미지가 없습니다</div>
          )}
        </div>
        {data.images.length > 1 && (
          <div className="ys-bd-thumbs">
            {data.images.map((src, i) => (
              <button
                key={i}
                className="ys-bd-thumb"
                aria-current={i === activeIndex}
                onClick={() => setActiveIndex(i)}
                aria-label={`${i + 1}번 이미지 보기`}
              >
                <img src={src} alt={`${data.title} 썸네일 ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 본문 */}
      <div className="ys-bd-grid">
        <section className="ys-bd-main">
          <h1 className="ys-bd-title">{data.title}</h1>
          <div className="ys-bd-meta">
            {data.address && (
              <>
                <span className="ys-meta-label">주소</span>
                <span className="ys-meta-value">{data.address}</span>
                <a
                  className="ys-link"
                  href={toMapsLink(data.address)}
                  target="_blank"
                  rel="noreferrer"
                >
                  지도에서 보기 ↗
                </a>
              </>
            )}
          </div>

          <div className="ys-bd-cards">
            <div className="ys-bd-card">
              <h2 className="ys-card-title">가격 정보</h2>
              <ul className="ys-spec">
                <li>
                  <span>보증금</span>
                  <strong>{formatKRW(data.deposit)}원</strong>
                </li>
                <li>
                  <span>월세</span>
                  <strong>{formatKRW(data.rent)}원</strong>
                </li>
                <li>
                  <span>관리비</span>
                  <strong>{formatKRW(data.maintenanceFee)}원</strong>
                </li>
              </ul>
            </div>

            <div className="ys-bd-card">
              <h2 className="ys-card-title">기본 정보</h2>
              <ul className="ys-spec">
                <li>
                  <span>면적</span>
                  <strong>{data.sizeM2 ? `${data.sizeM2} ㎡` : "-"}</strong>
                </li>
                <li>
                  <span>층수</span>
                  <strong>{data.floor ?? "-"}</strong>
                </li>
                <li>
                  <span>준공</span>
                  <strong>{data.builtYear ?? "-"}</strong>
                </li>
              </ul>
            </div>
          </div>

          {data.description && (
            <div className="ys-bd-card">
              <h2 className="ys-card-title">상세 설명</h2>
              <p className="ys-desc">{data.description}</p>
            </div>
          )}

          {data.amenities && data.amenities.length > 0 && (
            <div className="ys-bd-card">
              <h2 className="ys-card-title">편의시설</h2>
              <div className="ys-bd-amenities">
                {data.amenities.map((a, i) => (
                  <span key={i} className="ys-tag">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 사이드 CTA */}
        <aside className="ys-bd-side">
          <div className="ys-bd-sticky">
            <div className="ys-bd-card ys-bd-cta">
              <div className="ys-cta-price">
                월세 {formatKRW(data.rent)}원
                <span className="ys-cta-sub">
                  (보증금 {formatKRW(data.deposit)}원, 관리비{" "}
                  {formatKRW(data.maintenanceFee)}원)
                </span>
              </div>
              <button
                className="ys-btn primary"
                onClick={() => alert("문의/예약 플로우 연결")}
              >
                방문 예약 / 문의하기
              </button>
              <Link
                className="ys-btn outline"
                to={`/search?near=${encodeURIComponent(data.near ?? "")}`}
              >
                {data.near ?? "주변"} 다른 매물 보기
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
