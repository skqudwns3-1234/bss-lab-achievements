import { LAB } from '../../data/lab.ts'
import ArrowIcon from '../common/ArrowIcon.tsx'
import { todayYmd } from '../../utils/date.ts'
import { getRecruitStatus } from '../../utils/recruitment.ts'

// 푸터 (P297): 3줄 — ① 연구실 이름 + 학과 ② 소개 문구 ③ 연락처, 그 아래 저작권 줄.
// 메뉴 묶음은 지움 — 헤더가 스크롤해도 늘 위에 붙어 있어(P297) 맨 아래에서도 헤더 메뉴로 바로 이동 (예전 메뉴는 P116)
export default function Footer() {
  // 모집 중이고, 마감 전이고, 올바른 응답용 링크일 때만 "지원서 작성" (홈 ④와 같은 판단, P170)
  const { isOpen } = LAB.recruitment
  const { applyUrl } = getRecruitStatus(LAB.recruitment, todayYmd())

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__lab">
          {/* ① 연구실 이름 옆에 학과 — 좁은 화면에서 한 줄에 안 들어가면 학과가 다음 줄로 */}
          <div className="footer__title-row">
            <span className="footer__lab-name">{LAB.shortName} 연구실</span>
            <span className="footer__text">{LAB.department}</span>
          </div>
          {/* ② 소개 문구 — PC는 한 줄, 휴대폰은 화면 폭에 맞춰 자동 줄바꿈 */}
          <p className="footer__intro">{LAB.intro}</p>

          {/* ③ 연락처 — PC는 한 줄로 이어서, 880px 이하는 누르기 쉬운 세로 목록.
            "연락처" 제목은 화면에서 빼고(P304 사용자 결정 — 줄이 가벼워 보이게) 화면 낭독기에만 읽힘 */}
          <div className="footer__group">
            <span className="visually-hidden">연락처</span>
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
