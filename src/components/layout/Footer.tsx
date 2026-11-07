import { Link, useLocation } from 'react-router'
import { LAB } from '../../data/lab.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'
import { getRecruitStatus, todayYmd } from '../../utils/recruitment.ts'
import { NAV_ITEMS } from './navItems.ts'
import { scrollToTopIfCurrent } from './scrollToTop.ts'

// 푸터 (P143 정돈): 왼쪽 연구실 정보 / 오른쪽 메뉴·연락처를 한 묶음으로
export default function Footer() {
  const { pathname } = useLocation()
  // 모집 중이고, 마감 전이고, 올바른 응답용 링크일 때만 "지원서 작성" (홈 ④와 같은 판단, P170)
  const { isOpen } = LAB.recruitment
  const { applyUrl } = getRecruitStatus(LAB.recruitment, todayYmd())

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__lab">
          <span className="footer__lab-name">{LAB.shortName} 연구실</span>
          <p className="footer__intro">{LAB.intro}</p>
          <span className="footer__text">{LAB.department}</span>
        </div>

        {/* 오른쪽 묶음: 메뉴 + 연락처 */}
        <div className="footer__links">
          <div className="footer__group">
            <span className="footer__heading">메뉴</span>
            {/* 헤더 메뉴와 같은 목록 — 시안은 "홈"을 뺐지만, 맨 아래에서 바로 홈으로 갈 수 있게 넣음 (P116) */}
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => scrollToTopIfCurrent(item.path, pathname)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="footer__group">
            <span className="footer__heading">연락처</span>
            <span className="footer__text">{LAB.location} (방문)</span>
            <a href={`mailto:${LAB.contactEmail}`}>{LAB.contactEmail}</a>
            {/* 모집 기간에만 — 어느 페이지에서든 바로 지원할 수 있게 (P142) */}
            {isOpen && applyUrl && (
              <a className="footer__apply" href={applyUrl} target="_blank" rel="noopener noreferrer">
                지원서 작성
                <ArrowIcon size={12} />
              </a>
            )}
          </div>
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
