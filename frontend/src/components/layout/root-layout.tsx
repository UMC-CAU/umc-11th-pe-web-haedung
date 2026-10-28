import { Outlet, useLocation } from '@tanstack/react-router'
import Header from './header'
import { TmdbAttribution } from './tmdb-attribution'

const HIDE_ATTRIBUTION_PATHS = ['/login', '/signup', '/mypage/edit', '/search']

export default function RootLayout() {
  const { pathname } = useLocation()
  const showAttribution = !HIDE_ATTRIBUTION_PATHS.includes(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      {showAttribution && <TmdbAttribution />}
    </div>
  )
}