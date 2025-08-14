import SiteHeader from "../components/SiteHeader";
import UniversityRows from "../components/UniversityRows";
import HeroSearch from "../components/HeroSearch";
import "../styles/main-screen.css";
import { UNIV_SECTIONS } from "../data/univSections";

export default function MainScreen() {
  return (
    <>
      <SiteHeader />
      <main className="ys-main">
        <HeroSearch />
        <section className="ys-content-slot">
          <UniversityRows sections={UNIV_SECTIONS} />
        </section>
      </main>
    </>
  );
}
