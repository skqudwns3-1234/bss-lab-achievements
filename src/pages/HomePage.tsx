import { Link } from 'react-router'
import ArrowIcon from '../components/common/ArrowIcon.tsx'
import RecruitBox from '../components/home/RecruitBox.tsx'
import ResearchAreaList from '../components/home/ResearchAreaList.tsx'
import { LAB } from '../data/lab.ts'
import './HomePage.css'

// ④ 지원 안내(연락 상자) 표시 스위치 — 부원 모집 기간에만 true, 기간이 끝나면 false로 바꾼다
const SHOW_RECRUIT_BOX = true

// 홈 (spec/01_home.md). 1-1 뼈대, 1-2 첫 화면, 1-3 연구 분야, 1-4 지원 안내까지 채움.
export default function HomePage() {
  return (
    <div className="home">
      {/* ① 첫 화면: 큰 제목, 설명, 버튼 2개 (NEW 알약·통계 4칸은 성과 데이터 뒤에, D4 물방울 배경은 1-8) */}
      <section className="home__hero" aria-label="첫 화면">
        <div className="home-hero__content">
          <h1 className="home-hero__title">
            연구의 기록을
            <br />
            <span className="home-hero__title-sub">한곳에서.</span>
          </h1>

          <div className="home-hero__body">
            <p className="home-hero__desc">
              {LAB.shortName} 연구실의 논문·수상·특허·공모전 성과를 모아 보여 줍니다. 제목이나 저자로
              검색하고, 유형과 연도로 걸러 볼 수 있어요.
            </p>
            <div className="home-hero__actions">
              <Link to="/achievements" className="btn btn--primary">
                성과 둘러보기
                <ArrowIcon />
              </Link>
              <Link to="/members" className="btn btn--secondary">
                부원 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ② 연구 분야: RESEARCH AREAS, 분야 칸들 (1-3) — 분야 목록은 lab.ts의 researchAreas */}
      <section className="home__section" aria-labelledby="home-research-title">
        <div className="home-section__head">
          <p className="eyebrow">RESEARCH AREAS</p>
          <h2 id="home-research-title" className="section-title">
            우리가 다루는 문제
          </h2>
        </div>
        <ResearchAreaList areas={LAB.researchAreas} />
      </section>

      {/* ③ 최근 성과: RECENT ACHIEVEMENTS, 카드 4장 */}
      <section className="home__section" aria-label="최근 성과">
        <div className="home-placeholder home-placeholder--recent">
          ③ 최근 성과
          <small>RECENT ACHIEVEMENTS · 전체 성과 보기 · 카드 4장</small>
        </div>
      </section>

      {/* ===== ④ 지원 안내 시작 — 맨 위 SHOW_RECRUIT_BOX로 켜고 끔. 아예 없애려면 여기부터 ===== */}
      {/* 회색 큰 상자 — 모집 정보·포스터는 lab.ts의 recruitment에서 고친다 (1-4) */}
      {SHOW_RECRUIT_BOX && (
        <section className="home__contact" aria-labelledby="home-recruit-title">
          <div className="home__contact-box">
            <RecruitBox recruitment={LAB.recruitment} />
          </div>
        </section>
      )}
      {/* ===== ④ 지원 안내 끝 — 아예 없애려면 여기까지 지우고, 맨 위 SHOW_RECRUIT_BOX 줄도 지운다 ===== */}
    </div>
  )
}
