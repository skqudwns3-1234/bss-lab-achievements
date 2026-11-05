import { Outlet } from 'react-router'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import './Layout.css'

export default function Layout() {
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
