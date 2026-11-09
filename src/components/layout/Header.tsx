import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { LAB } from '../../data/lab.ts'
import { NAV_ITEMS } from './navItems.ts'
import { scrollToTopIfCurrent } from './scrollToTop.ts'

export default function Header() {
  // 모바일 화면에서 메뉴 펼침 여부. 넓은 화면에서는 CSS가 항상 메뉴를 보여 준다.
  const [menuOpen, setMenuOpen] = useState(false)
  // 지금 주소 — 같은 페이지 링크를 누르면 맨 위로 올리는 데 씀
  const { pathname } = useLocation()

  // 주소가 바뀌면 메뉴를 접는다 — 링크를 누를 때뿐 아니라 브라우저 뒤로·앞으로 가기로 바뀔 때도 (홈 점검 P187–P188).
  // 지난번 주소를 기억해 두고 그리는 중에 달라졌으면 맞춘다 (HomePage 팝업 번호와 같은 "렌더 중에 상태 맞추기")
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  // 로고·메뉴를 누르면: 모바일 메뉴를 접고, 지금 페이지의 링크면 맨 위로
  function handleLinkClick(path: string) {
    setMenuOpen(false)
    scrollToTopIfCurrent(path, pathname)
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => handleLinkClick('/')}>
          <span className="header__logo-main">{LAB.shortName} archive.</span>
          <span className="header__logo-sub">연구실 성과 아카이브</span>
        </Link>

        <button
          type="button"
          className="header__menu-button"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '닫기' : '메뉴'}
        </button>

        <nav id="main-nav" aria-label="주 메뉴" className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="header__link"
              onClick={() => handleLinkClick(item.path)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
