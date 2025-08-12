import SiteHeader from "../components/SiteHeader";
import UniversityRows from "../components/UniversityRows";
import HeroSearch from "../components/HeroSearch";
import "../styles/main-screen.css";

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
    images: Array.from({ length: 20 }).map((_, i) => ({
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

export default function MainScreen() {
  return (
    <>
      <SiteHeader />
      <main className="ys-main">
        <HeroSearch />
        <section className="ys-content-slot">
          <UniversityRows sections={UNIV_SECTIONS} />
        </section>
      </main>
    </>
  );
}
