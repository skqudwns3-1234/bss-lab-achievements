import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useAdminMode } from '../../context/useAdminMode.ts'
import AdminBar from './AdminBar.tsx'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import './Layout.css'

export default function Layout() {
  const { pathname } = useLocation()
  const { isAdmin } = useAdminMode()

  // 다른 페이지로 넘어가면 새 페이지를 맨 위에서 시작한다 (P119).
  // 브라우저는 주소가 바뀌어도 스크롤을 그대로 두기 때문에, 주소(pathname)가 바뀔 때마다 직접 올린다.
  // 스크롤은 React 화면 밖의 브라우저 동작이라 useEffect에서 한다.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // 관리 띠는 성과를 다루는 주소(목록·등록·수정)에서만 (P209 ①). 홈 등 다른 페이지는 헤더 스위치로 켜짐을 알 수 있음.
  // "/achievementsxyz" 같은 주소는 빼려고 정확히 같거나 "/achievements/"로 시작할 때만
  const onAchievementPages = pathname === '/achievements' || pathname.startsWith('/achievements/')

  return (
    <div className="layout">
      <Header />
      {/* 가로 전체 띠라서 내용 폭(max-width)이 있는 main 밖, 헤더 바로 아래에 둔다 */}
      {isAdmin && onAchievementPages && <AdminBar />}
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
