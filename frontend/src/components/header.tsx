import './header.css';
export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img src="/icons/movie.svg" alt="영화 아이콘" className="logo-icon" />
          <span className="logo-text">UMCine</span>
        </div>
        <nav className="nav-menu">
          <a href="#" className="nav-link active">영화</a>
          <a href="#" className="nav-link">검색</a>
          <a href="#" className="nav-link">내 정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button className="icon-button">
          <img src="/icons/search.svg" alt="검색" />
        </button>
        <button className="mypage-button">마이페이지</button>
      </div>
    </header>
  );
}