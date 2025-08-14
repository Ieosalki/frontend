// src/components/SearchResults.tsx
import * as React from "react";
import UniversityRows from "../components/UniversityRows";
import type { UnivSection, UnivImage } from "../types/university";

type Props = {
  near: string;
  period?: string;
  radius?: string;
  onClear?: () => void;
};

// near 문자열에서 간단히 prefix 추출 (샘플 용)
const toPrefix = (near: string) => {
  if (near.includes("서울")) return "snu";
  if (near.includes("고려")) return "ku";
  if (near.includes("연세")) return "yonsei";
  return "u"; // 기타
};

// 유틸: 데모 이미지 배열 생성
const makeImages = (
  count: number,
  startIdx: number,
  prefix: string,
  altBase: string
): UnivImage[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${startIdx + i}`, // 상세로 이동할 때 사용할 ID
    src: `/img${startIdx + i}.png`, // 샘플 이미지 경로
    alt: `${altBase} ${i + 1}`,
    // href는 넣지 않는다 → UniversityRows가 /buildings/:id로 라우팅
  }));

const SearchResults: React.FC<Props> = ({ near, period, radius }) => {
  const [sections, setSections] = React.useState<UnivSection[]>([]);

  React.useEffect(() => {
    if (!near) {
      setSections([]);
      return;
    }

    const prefix = toPrefix(near);

    const demo: UnivSection[] = [
      {
        id: `${near}-front`, // 섹션 id는 고유하게
        title: `${near} 정문`,
        detailBasePath: "/buildings",
        images: makeImages(20, 1, prefix, `${near} 주변 숙소 샘플`),
      },
      {
        id: `${near}-back`,
        title: `${near} 후문`,
        detailBasePath: "/buildings",
        images: makeImages(7, 7, prefix, `${near} 주변 숙소 샘플`),
      },
      {
        id: `${near}-west`,
        title: `${near} 서문`,
        detailBasePath: "/buildings",
        images: makeImages(7, 14, prefix, `${near} 주변 숙소 샘플`),
      },
      {
        id: `${near}-east`,
        title: `${near} 동문`,
        detailBasePath: "/buildings",
        images: makeImages(9, 2, prefix, `${near} 주변 숙소 샘플`),
      },
    ];

    setSections(demo);
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
