// src/components/UniversityRows.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import type { UnivSection, UnivImage } from "../types/university";
import "../styles/university-rows.css";
import { useNavigate } from "react-router-dom";

interface Props {
  sections: UnivSection[];
  className?: string;
}

const UniversityRows: React.FC<Props> = ({ sections, className }) => {
  const navigate = useNavigate();
  if (!sections || sections.length === 0) return null;

  const getImageHref = (img: UnivImage, sec: UnivSection) => {
    if (img.id) {
      const base = (sec.detailBasePath ?? "/buildings").replace(/\/+$/, "");
      return `${base}/${encodeURIComponent(img.id)}`; // ← 인코딩
    }
    return undefined;
  };

  return (
    <section className={`ys-univ ${className ?? ""}`}>
      {sections.map((sec) => {
        const titleHref = sec.href;

        return (
          <div key={sec.id} className="ys-univ-row">
            <h2 className="ys-univ-title">
              {titleHref ? (
                <Link
                  to={titleHref}
                  className="ys-univ-title-link"
                  aria-label={sec.title}
                >
                  {sec.title}
                </Link>
              ) : (
                sec.title
              )}
            </h2>

            <div className="ys-univ-grid">
              {sec.images.map((img, i) => {
                const label = img.alt ?? `${sec.title} ${i + 1}`;
                const detailHref = getImageHref(img, sec);
                if (import.meta.env.DEV && !detailHref) {
                  console.warn("[UniversityRows] 링크 없음 - id 누락?", {
                    section: sec.id,
                    img,
                  });
                }

                return (
                  <div key={img.id ?? i} className="ys-u-item">
                    {detailHref ? (
                      <button
                        type="button"
                        className="ys-u-card"
                        aria-label={`${label} 상세페이지로 이동`}
                        onClick={() => navigate(detailHref)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(detailHref);
                          }
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.alt ?? `${sec.title} 숙소 이미지`}
                          loading="lazy"
                        />
                      </button>
                    ) : (
                      <div
                        className="ys-u-card"
                        role="img"
                        aria-label={`${label} 이미지`}
                      >
                        <img
                          src={img.src}
                          alt={img.alt ?? `${sec.title} 숙소 이미지`}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default UniversityRows;
