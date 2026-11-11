import { Link } from '@tanstack/react-router'
import { useAuth } from '../../auth/auth-context'

const navLinkClass = 'text-[15px] font-medium text-[#616773] no-underline'
const navLinkActive = { className: 'underline font-semibold text-[#17191e]' }
const primaryButtonClass =
  'flex h-10 items-center rounded-lg bg-[#3662e3] px-5 text-sm font-bold text-white no-underline'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-[#edeff3] bg-white px-20 py-6">
      <div className="flex items-center gap-11">
        <Link to="/" className="flex items-center gap-2.5 text-[#17191e] no-underline">
          <img src="/icons/movie.svg" alt="" className="size-8 rounded-lg border-2 border-[#17191e] p-0.5" />
          <span className="text-xl font-extrabold tracking-tight">UMCine</span>
        </Link>
        <nav className="flex gap-8" aria-label="주요 메뉴">
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

      <div className="flex items-center gap-3">
        <Link
          to="/search"
          className="flex size-10 items-center justify-center rounded-lg border border-[#e3e6ea] bg-white"
          aria-label="검색"
        >
          <img src="/icons/search.svg" alt="" />
        </Link>
        {user ? (
          <>
            <Link to="/mypage" className={primaryButtonClass}>
              마이페이지
            </Link>
            <button className="cursor-pointer text-sm text-[#616773]" onClick={logout}>
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
