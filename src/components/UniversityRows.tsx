// src/components/UniversityRows.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import "../styles/university-rows.css";

export type UnivImage = { src: string; alt?: string; href?: string };
export type UnivSection = {
  id: string;
  title: string;
  images: UnivImage[];
  href?: string; // 🔹 섹션 타이틀 링크(옵션)
};

interface Props {
  sections: UnivSection[];
  className?: string;
}

const UniversityRows: React.FC<Props> = ({ sections, className }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <section className={`ys-univ ${className ?? ""}`}>
      {sections.map((sec) => {
        const titleHref = sec.href ?? sec.images.find((im) => im.href)?.href;

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

                return (
                  <div>
                    <button
                      type="button"
                      className="ys-u-card"
                      aria-label={`${label} 이미지`}
                      onClick={() => {
                        /* TODO: 이미지 클릭 시 액션 */
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt ?? `${sec.title} 숙소 이미지`}
                        loading="lazy"
                      />
                    </button>
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
