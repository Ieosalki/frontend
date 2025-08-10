export interface UniversityRecord {
  학교명: string;
  "학교 영문명": string;
  본분교구분명: string;
  대학구분명: string;
  학교구분명: string;
  설립형태구분명: string;
  시도코드: string;
  시도명: string;
  소재지도로명주소: string;
  소재지지번주소: string;
  도로명우편번호: string;
  소재지우편번호: string;
  홈페이지주소: string;
  대표전화번호: string;
  대표팩스번호: string;
  설립일자: string;
  기준연도: string;
  데이터기준일자: string;
  제공기관코드: string;
  제공기관명: string;
}

export interface UniversityData {
  fields: Array<{ id: string }>;
  records: UniversityRecord[];
}

// 자취방 검색에 필요한 간소화된 타입
export interface SimpleUniversity {
  name: string;
  location: string;
  type: string;
  address: string;
}
