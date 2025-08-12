// src/pages/SearchResultsPage.tsx
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeroSearch from "../components/HeroSearch";
import SearchResults from "../components/SearchResults";
import SiteHeader from "../components/SiteHeader";
import "../styles/main-screen.css";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const sp = new URLSearchParams(location.search);
  const near = (sp.get("near") || "").trim();
  const period = sp.get("period") || undefined;
  const radius = sp.get("radius") || undefined;

  // near가 없으면 홈으로 리다이렉트(옵션)
  React.useEffect(() => {
    if (!near) navigate("/", { replace: true });
  }, [near, navigate]);

  return (
    <>
      <SiteHeader />
      <main className="ys-main">
        <HeroSearch
          initialNear={near}
          initialPeriod={period}
          initialRadius={radius}
        />
        <section className="ys-content-slot">
          {near && (
            <SearchResults near={near} period={period} radius={radius} />
          )}
        </section>
      </main>
    </>
  );
}
