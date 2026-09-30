import { Link } from '@tanstack/react-router'
import { useAuth } from '../../auth/auth-context'

const navLinkClass = 'text-[15px] text-[#333] no-underline'
const navLinkActive = { className: 'underline font-semibold' }
const primaryButtonClass =
  'rounded-lg bg-[#3b5aff] px-5 py-2.5 text-sm font-semibold text-white no-underline'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between bg-white px-10 py-5">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2 text-inherit no-underline">
          <img src="/icons/movie.svg" alt="" className="size-6 rounded-lg border-2 border-black" />
          <span className="text-xl font-bold">UMCine</span>
        </Link>
        <nav className="flex gap-6" aria-label="주요 메뉴">
          <Link
            to="/"
            className={navLinkClass}
            activeProps={navLinkActive}
            activeOptions={{ exact: true }}
          >
            영화
          </Link>
          <Link to="/search" className={navLinkClass} activeProps={navLinkActive}>
            검색
          </Link>
          <Link to="/mypage" className={navLinkClass} activeProps={navLinkActive}>
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/search"
          className="flex size-10 items-center justify-center rounded-full border border-[#ddd] bg-white"
          aria-label="검색"
        >
          <img src="/icons/search.svg" alt="" />
        </Link>
        {user ? (
          <>
            <Link to="/mypage" className={primaryButtonClass}>
              마이페이지
            </Link>
            <button className="cursor-pointer text-sm text-[#666]" onClick={logout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className={primaryButtonClass}>
            로그인
          </Link>
        )}
      </div>
    </header>
  )
}
