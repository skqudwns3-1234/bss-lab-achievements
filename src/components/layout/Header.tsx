import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { NAV_ITEMS } from './navItems.ts'

export default function Header() {
  // 모바일 화면에서 메뉴 펼침 여부. 넓은 화면에서는 CSS가 항상 메뉴를 보여 준다.
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => setMenuOpen(false)}>
          <span className="header__logo-main">lab archive.</span>
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
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
