// src/data/univSections.ts
import type { UnivSection } from "../types/university";

export const UNIV_SECTIONS: UnivSection[] = [
  {
    id: "snu",
    title: "서울대학교",
    href: `/search?near=${encodeURIComponent("서울대학교")}`, // 타이틀 클릭 시 검색으로
    detailBasePath: "/buildings", // 이미지 클릭 시 기본 상세 경로
    images: Array.from({ length: 20 }).map((_, i) => ({
      id: `snu-${i + 1}`,
      src: `/img${i + 1}.png`,
      alt: `서울대학교 주변 숙소 샘플 ${i + 1}`,
      // 이미지 href 제거 → /buildings/:id 로 이동
    })),
  },
  {
    id: "ku",
    title: "고려대학교",
    href: `/search?near=${encodeURIComponent("고려대학교")}`,
    detailBasePath: "/buildings",
    images: Array.from({ length: 7 }).map((_, i) => ({
      id: `ku-${i + 1}`,
      src: `/img${i + 7}.png`, // 기존 인덱싱 유지
      alt: `고려대학교 주변 숙소 샘플 ${i + 1}`,
      // 이미지 href 제거
    })),
  },
  {
    id: "yonsei",
    title: "연세대학교",
    href: `/search?near=${encodeURIComponent("연세대학교")}`,
    detailBasePath: "/buildings",
    images: Array.from({ length: 7 }).map((_, i) => ({
      id: `yonsei-${i + 1}`,
      src: `/img${i + 14}.png`, // 기존 인덱싱 유지
      alt: `연세대학교 주변 숙소 샘플 ${i + 1}`,
      // 이미지 href 제거
    })),
  },
];
