import { useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { LAB } from '../../data/lab.ts'
import { HIDDEN_MEMBER } from '../../data/members.ts'
import { EMPTY_TAP, registerTap } from '../../utils/secretTap.ts'
import HiddenMemberModal from '../members/HiddenMemberModal.tsx'
import AdminModeToggle from './AdminModeToggle.tsx'
import { NAV_ITEMS } from './navItems.ts'
import { scrollToTopIfCurrent } from './scrollToTop.ts'

export default function Header() {
  // 모바일 화면에서 메뉴 펼침 여부. 넓은 화면에서는 CSS가 항상 메뉴를 보여 준다.
  const [menuOpen, setMenuOpen] = useState(false)
  // 이스터에그(P310–P311): 숨은 부원 팝업이 열렸는지 — 화면이 바뀌어야 하는 값이라 상태
  const [hiddenOpen, setHiddenOpen] = useState(false)
  // 로고를 몇 번 눌렀는지·처음 누른 시각 — 화면에 안 보이는 값이라 상태가 아니라 useRef
  // (상태로 두면 누를 때마다 헤더를 쓸데없이 다시 그림)
  const tapRef = useRef(EMPTY_TAP)
  // 지금 주소 — 같은 페이지 링크를 누르면 맨 위로 올리는 데 씀
  const { pathname } = useLocation()

  // 주소가 바뀌면 메뉴를 접는다 — 링크를 누를 때뿐 아니라 브라우저 뒤로·앞으로 가기로 바뀔 때도 (홈 점검 P187–P188).
  // 지난번 주소를 기억해 두고 그리는 중에 달라졌으면 맞춘다 (HomePage 팝업 번호와 같은 "렌더 중에 상태 맞추기").
  // 숨은 부원 팝업도 같이 닫음 — 다른 페이지로 넘어갔는데 팝업만 남아 있지 않게 (P311)
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
    setHiddenOpen(false)
  }

  // 로고·메뉴를 누르면: 모바일 메뉴를 접고, 지금 페이지의 링크면 맨 위로
  function handleLinkClick(path: string) {
    setMenuOpen(false)
    scrollToTopIfCurrent(path, pathname)
  }

  // 로고: 평소처럼 홈으로 + 2초 안 5번째면 숨은 부원 팝업 (센 값은 utils/secretTap.ts가 계산)
  function handleLogoClick() {
    handleLinkClick('/')
    const { state, triggered } = registerTap(tapRef.current, Date.now())
    tapRef.current = state
    if (triggered) setHiddenOpen(true)
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={handleLogoClick}>
          <span className="header__logo-main">{LAB.shortName} archive.</span>
          <span className="header__logo-sub">연구실 성과 아카이브</span>
        </Link>

        <button
          type="button"
          className="header__menu-button"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '닫기' : '메뉴'}
        </button>

        {/* 메뉴 + 관리 모드 스위치 묶음 — 휴대폰에서는 이 묶음이 통째로 펼쳐지고 접힌다 (스위치는 맨 아래, D1, B-4) */}
        <div id="main-menu" className={`header__menu ${menuOpen ? 'header__menu--open' : ''}`}>
          <nav aria-label="주 메뉴" className="header__nav">
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
          {/* 스위치를 눌러도 메뉴는 그대로 펼쳐 둔다 — 켜졌는지 바로 볼 수 있게 */}
          <AdminModeToggle />
        </div>
      </div>

      {/* 숨은 부원 팝업 — 닫으면 useModal이 로고로 포커스를 돌려놓음 */}
      {hiddenOpen && <HiddenMemberModal member={HIDDEN_MEMBER} onClose={() => setHiddenOpen(false)} />}
    </header>
  )
}
