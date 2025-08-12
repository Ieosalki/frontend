// src/components/UniversityRows.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import "../styles/university-rows.css";

export type UnivImage = { src: string; alt?: string; href?: string };
export type UnivSection = { id: string; title: string; images: UnivImage[] };

interface Props {
  sections: UnivSection[];
  className?: string; // 필요하면 외부에서 여백/위치 조정용
}

const UniversityRows: React.FC<Props> = ({ sections, className }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <section className={`ys-univ ${className ?? ""}`}>
      {sections.map((sec) => (
        <div key={sec.id} className="ys-univ-row">
          <h2 className="ys-univ-title">{sec.title}</h2>
          <div className="ys-univ-grid">
            {sec.images.map((img, i) => {
              const card = (
                <div className="ys-u-card" key={`${sec.id}-${i}`}>
                  <img
                    src={img.src}
                    alt={img.alt ?? `${sec.title} 숙소 이미지`}
                    loading="lazy"
                  />
                </div>
              );
              return img.href ? (
                <Link
                  key={`${sec.id}-${i}`}
                  to={img.href}
                  aria-label={`${sec.title} 주변 숙소 보기 ${i + 1}`}
                  className="ys-u-link"
                >
                  {card}
                </Link>
              ) : (
                card
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

export default UniversityRows;
