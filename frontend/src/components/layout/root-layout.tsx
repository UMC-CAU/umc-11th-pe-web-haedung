import { Outlet } from '@tanstack/react-router'
import Header from './header'

export default function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  )
}