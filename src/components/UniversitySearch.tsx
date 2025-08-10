import React, { useState, useMemo, useRef, useEffect } from "react";
import type { SimpleUniversity } from "../types/university";
import { universities } from "../data/universities";
import popularUniversitiesData from "../data/popular-universities.json";

const UniversitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredUniversities = useMemo(() => {
    if (!searchTerm) return [];
    return universities.filter(
      (university) =>
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUniversitySelect = (university: SimpleUniversity) => {
    setSearchTerm(university.name);
    setShowSuggestions(false);

    // 메인 화면으로 이동 (예: 자취방 검색 페이지)
    // 여기에 실제 라우팅 로직을 추가할 수 있습니다
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div className="university-search">
      <div className="search-header">
        <h1>대학교 검색</h1>
        <p>원하는 대학교를 찾고 근처 자취방 정보를 확인해보세요</p>
      </div>

      <div className="search-container" ref={searchRef}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="대학교명 또는 지역으로 검색"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
            onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>

        {showSuggestions && filteredUniversities.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredUniversities.map((university) => (
              <div
                key={university.name}
                className="suggestion-item"
                onClick={() => handleUniversitySelect(university)}
              >
                <div className="university-info">
                  <span className="university-name">{university.name}</span>
                  <span className="university-location">
                    {university.location}
                  </span>
                </div>
                <span className="university-type">{university.type}</span>
              </div>
            ))}
          </div>
        )}

        {showSuggestions && searchTerm && filteredUniversities.length === 0 && (
          <div className="suggestions-dropdown">
            <div className="no-suggestions">
              <p>검색 결과가 없습니다</p>
              <p>다른 검색어를 입력해보세요</p>
            </div>
          </div>
        )}
      </div>

      {/* 많이 찾는 대학 */}
      <div className="popular-universities">
        <h3>많이 찾는 대학</h3>
        <div className="popular-list">
          {popularUniversitiesData.popularUniversities.map((university) => (
            <div
              key={university.name}
              className="popular-item"
              onClick={() =>
                handleUniversitySelect({
                  name: university.name,
                  location: university.location,
                  type: university.type,
                  address: university.address,
                })
              }
            >
              <div className="popular-info">
                <span className="popular-name">{university.name}</span>
                <span className="popular-location">{university.location}</span>
              </div>
              <span className="popular-type">{university.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversitySearch;
