import { Link } from 'react-router'
import ArrowIcon from '../components/common/ArrowIcon.tsx'
import { LAB } from '../data/lab.ts'
import './HomePage.css'

// ④ 지원 안내(연락 상자) 표시 스위치 — 부원 모집 기간에만 true, 기간이 끝나면 false로 바꾼다
const SHOW_RECRUIT_BOX = true

// 홈 (spec/01_home.md). 1-1 뼈대, 1-2 첫 화면 제목·설명·버튼까지 채움.
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

      {/* ② 연구 분야: RESEARCH AREAS, 분야 칸들 */}
      <section className="home__section" aria-label="연구 분야">
        <div className="home-placeholder home-placeholder--research">
          ② 연구 분야
          <small>RESEARCH AREAS · 번호 · 분야 이름 · 설명</small>
        </div>
      </section>

      {/* ③ 최근 성과: RECENT ACHIEVEMENTS, 카드 4장 */}
      <section className="home__section" aria-label="최근 성과">
        <div className="home-placeholder home-placeholder--recent">
          ③ 최근 성과
          <small>RECENT ACHIEVEMENTS · 전체 성과 보기 · 카드 4장</small>
        </div>
      </section>

      {/* ===== ④ 지원 안내 시작 — 맨 위 SHOW_RECRUIT_BOX로 켜고 끔. 아예 없애려면 여기부터 ===== */}
      {/* 회색 큰 상자 — 위치·이메일은 푸터에 있으니 제목과 버튼만 (P071) */}
      {SHOW_RECRUIT_BOX && (
        <section className="home__contact" aria-label="지원 안내">
          <div className="home__contact-box">
            <div className="home-placeholder home-placeholder--contact">
              ④ 지원 안내
              <small>제목 두 줄 · 버튼 2개 (연구실 소개, 이메일 보내기)</small>
            </div>
          </div>
        </section>
      )}
      {/* ===== ④ 지원 안내 끝 — 아예 없애려면 여기까지 지우고, 맨 위 SHOW_RECRUIT_BOX 줄도 지운다 ===== */}
    </div>
  )
}
