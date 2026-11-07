import { Link } from 'react-router'
import { LAB } from '../../data/lab.ts'
import { NAV_ITEMS } from './navItems.ts'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__lab">
          <span className="footer__lab-name">{LAB.shortName} 연구실</span>
          <span className="footer__text">
            {LAB.department}
            <br />
            {LAB.location}
          </span>
        </div>

        <div className="footer__group">
          <span className="footer__heading">메뉴</span>
          {/* 헤더 메뉴와 같은 목록 — 시안은 "홈"을 뺐지만, 맨 아래에서 바로 홈으로 갈 수 있게 넣음 (P116) */}
          {NAV_ITEMS.map((item) => (
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
        {/* 저작권 줄은 공식 표기라 전체 이름 (P114) */}
        <span>© 2026 {LAB.name}</span>
        <span>체험판 — 성과 데이터는 이 브라우저에만 저장됩니다</span>
      </div>
    </footer>
  )
}
