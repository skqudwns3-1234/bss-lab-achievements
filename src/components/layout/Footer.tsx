import { Link } from 'react-router'
import { LAB } from '../../data/lab.ts'
import { NAV_ITEMS } from './navItems.ts'

// 푸터 메뉴는 시안처럼 "홈"을 빼고 보여 준다
const FOOTER_LINKS = NAV_ITEMS.filter((item) => item.path !== '/')

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__lab">
          <span className="footer__lab-name">{LAB.name}</span>
          <span className="footer__text">
            {LAB.department}
            <br />
            {LAB.location}
          </span>
        </div>

        <div className="footer__group">
          <span className="footer__heading">메뉴</span>
          {FOOTER_LINKS.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer__group">
          <span className="footer__heading">연락처</span>
          <a href={`mailto:${LAB.contactEmail}`}>{LAB.contactEmail}</a>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 {LAB.name}</span>
        <span>체험판 — 성과 데이터는 이 브라우저에만 저장됩니다</span>
      </div>
    </footer>
  )
}
