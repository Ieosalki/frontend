// src/data/universities.ts
import data from "./universities.json";

interface UniversityRecord {
  학교명?: unknown;
  "학교 영문명"?: unknown;
}
interface UniversitiesJson {
  records?: UniversityRecord[];
}

type UniPair = { ko: string; en: string };

const records = (data as UniversitiesJson).records ?? [];

// '학교명'과 '학교 영문명'을 한 쌍으로 추출 (학교명 없는 행은 제외)
const pairsRaw: UniPair[] = records
  .map((r) => ({
    ko: typeof r["학교명"] === "string" ? r["학교명"].trim() : "",
    en: typeof r["학교 영문명"] === "string" ? r["학교 영문명"].trim() : "",
  }))
  .filter((p) => p.ko.length > 0);

// 중복 제거 (동일 ko|en 키 기준)
function dedupeBy<T>(arr: T[], keyFn: (v: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

export const universityPairs: UniPair[] = dedupeBy(
  pairsRaw,
  (p) => `${p.ko}|${p.en}`
);

// 편의용 파생 데이터
export const universityNamesKo: string[] = universityPairs.map((p) => p.ko);
export const universityNamesEn: string[] = universityPairs
  .map((p) => p.en)
  .filter(Boolean);
export const uniMapKoToEn = new Map<string, string>(
  universityPairs.map((p) => [p.ko, p.en])
);

// 필요하면 기본 내보내기는 쌍 배열로
export default universityPairs;
