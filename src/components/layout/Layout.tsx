import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import './Layout.css'

export default function Layout() {
  const { pathname } = useLocation()

  // 다른 페이지로 넘어가면 새 페이지를 맨 위에서 시작한다 (P119).
  // 브라우저는 주소가 바뀌어도 스크롤을 그대로 두기 때문에, 주소(pathname)가 바뀔 때마다 직접 올린다.
  // 스크롤은 React 화면 밖의 브라우저 동작이라 useEffect에서 한다.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
