// src/components/SearchResults.tsx
import * as React from "react";
import UniversityRows from "../components/UniversityRows";

type Props = {
  near: string;
  period?: string;
  radius?: string;
  onClear?: () => void;
};

type Section = {
  id: string;
  title: string;
  images: { src: string; alt?: string; href?: string }[];
};

const SearchResults: React.FC<Props> = ({ near, period, radius }) => {
  // API 호출/데이터 로딩 등은 여기서
  // React.useEffect(() => {...}, [near, period, radius]);
  const [sections, setSections] = React.useState<Section[]>([]);

  React.useEffect(() => {
    // TODO: 실제 API 호출로 대체하세요.
    // 데모: near가 있으면 샘플 데이터, 없으면 빈 배열
    if (near) {
      const demo: Section[] = [
        {
          id: "snu",
          title: `${near} 정문`,
          images: Array.from({ length: 20 }).map((_, i) => ({
            src: `/img${i + 1}.png`,
            alt: `서울대학교 주변 숙소 샘플 ${i + 1}`,
            href: `/search?near=${encodeURIComponent("서울대학교")}`,
          })),
        },
        {
          id: "ku",
          title: `${near} 후문`,
          images: Array.from({ length: 7 }).map((_, i) => ({
            src: `/img${i + 7}.png`,
            alt: `고려대학교 주변 숙소 샘플 ${i + 1}`,
            href: `/search?near=${encodeURIComponent("고려대학교")}`,
          })),
        },
        {
          id: "yonsei",
          title: `${near} 서문`,
          images: Array.from({ length: 7 }).map((_, i) => ({
            src: `/img${i + 14}.png`,
            alt: `연세대학교 주변 숙소 샘플 ${i + 1}`,
            href: `/search?near=${encodeURIComponent("연세대학교")}`,
          })),
        },
        {
          id: "yonsei",
          title: `${near} 동문`,
          images: Array.from({ length: 9 }).map((_, i) => ({
            src: `/img${i + 2}.png`,
            alt: `연세대학교 주변 숙소 샘플 ${i + 1}`,
            href: `/search?near=${encodeURIComponent("연세대학교")}`,
          })),
        },
      ];
      setSections(demo);
    } else {
      setSections([]);
    }
  }, [near, period, radius]);

  const hasResults =
    sections.length > 0 && sections.some((s) => s.images?.length);

  return (
    <section className="ys-results">
      {hasResults ? (
        <UniversityRows sections={sections} />
      ) : (
        <div className="ys-empty" role="status" aria-live="polite">
          검색 결과가 없습니다
        </div>
      )}
    </section>
  );
};

export default SearchResults;
