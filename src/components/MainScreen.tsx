// src/pages/MainScreen.tsx
import * as React from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ 추가

const Header: React.FC = () => {
  const location = useLocation(); // ✅ 현재 경로 확인용

  return (
    <>
      <header className="ys-header">
        <div className="ys-inner">
          <div className="ys-brand">
            {/* ✅ 로고 클릭 → / 로 이동. 이미 /면 스크롤 맨 위 */}
            <Link
              to="/"
              aria-label="홈으로 이동"
              className="ys-logo-link"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <img src="/logo.png" alt="이어살기 로고" className="ys-logo" />
            </Link>

            <h1 className="ys-title">
              <span className="sub">처음 시작하는 대학 자취,</span>
              <br />
              이어살기
            </h1>
          </div>

          <nav className="ys-quick" aria-label="빠른 메뉴">
            <a className="ys-link" href="/login">
              로그인
            </a>
            <a className="ys-link" href="/consult">
              상담
            </a>
            <a className="ys-link" href="/guide">
              입주 안내
            </a>
          </nav>
        </div>
      </header>

      <main className="ys-main" />

      <style>{`
        html, body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          -webkit-text-size-adjust: 100%;
        }

        .ys-header{
          position: sticky;
          top: 12px;
          margin-top: 12px;
          background: transparent;
          border: none;
          z-index: 50;
          transform: none !important;
          filter: none !important;
          opacity: 1;
          backface-visibility: hidden;
        }

        /* 폭: 현재 파일 값 유지 (inner 1460) */
        .ys-inner{
          max-width: 1460px;
          margin: 0 auto;
          padding: 12px 28px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        /* 로고 56px, 로고-문구 간격 28px */
        .ys-brand{ display:flex; align-items:center; gap:28px; }
        .ys-logo-link{ display:inline-flex; line-height:0; text-decoration:none; } /* ✅ 링크 스타일 */
        .ys-logo-link:focus-visible{ outline:2px solid #111; outline-offset:2px; } /* 접근성 */
        .ys-logo{ width:56px; height:56px; object-fit:contain; }

        .ys-title{ margin:0; line-height:1.15; color:#111827; font-weight:700; font-size:20px; }
        .ys-title .sub{ font-weight:600; }

        /* 오른쪽 메뉴 */
        .ys-quick{ display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
        .ys-link{
          font-size:12px;
          color:#000;
          text-decoration:none;
        }
        .ys-link:hover{ opacity: 0.8; text-decoration: none; }

        /* 본문 폭: 기존 값 유지 (1360) */
        .ys-main{ max-width:1360px; margin:0 auto; padding:24px 28px; }

        @media (min-width:768px){
          .ys-title{ font-size:22px; }
        }
      `}</style>
    </>
  );
};

export default function MainScreen() {
  return <Header />;
}
