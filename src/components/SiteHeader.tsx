import * as React from "react";
import { Link, useLocation } from "react-router-dom";

const SiteHeader: React.FC = () => {
  const location = useLocation();

  const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <header className="ys-header">
      <div className="ys-inner">
        <div className="ys-brand">
          <Link
            to="/"
            aria-label="홈으로 이동"
            className="ys-logo-link"
            onClick={onLogoClick}
          >
            <img src="/logo.png" alt="이어살기 로고" className="ys-logo" />
          </Link>

          <Link
            to="/"
            aria-label="홈으로 이동 (제목 클릭 시 새로고침)"
            className="ys-title-link"
            onClick={onTitleClick}
          >
            <h1 className="ys-title">
              <span className="sub">처음 시작하는 대학 자취,</span>
              <br />
              이어살기
            </h1>
          </Link>
        </div>

        <nav className="ys-quick" aria-label="빠른 메뉴">
          <Link className="ys-link" to="/login">
            로그인
          </Link>
          <Link className="ys-link" to="/consult">
            상담
          </Link>
          <Link className="ys-link" to="/guide">
            입주 안내
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
