import type { UniversityRecord, SimpleUniversity } from "../types/university";
import universityData from "./universities.json";

// JSON 데이터를 SimpleUniversity 형태로 변환
export const universities: SimpleUniversity[] = universityData.records.map(
  (record: UniversityRecord) => ({
    name: record["학교명"],
    location: record["시도명"],
    type: record["설립형태구분명"],
    address: record["소재지도로명주소"] || record["소재지지번주소"],
  })
);

// 원본 데이터도 export (필요시 사용)
export const originalUniversityData = universityData;
