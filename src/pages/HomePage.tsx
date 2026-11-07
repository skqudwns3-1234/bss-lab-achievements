import { useMemo } from 'react'
import { Link } from 'react-router'
import ArrowIcon from '../components/common/ArrowIcon.tsx'
import EmptyState from '../components/common/EmptyState.tsx'
import HeroArt from '../components/home/HeroArt.tsx'
import RecentAchievementCard from '../components/home/RecentAchievementCard.tsx'
import RecruitBox from '../components/home/RecruitBox.tsx'
import ResearchAreaList from '../components/home/ResearchAreaList.tsx'
import { useAchievements } from '../context/useAchievements.ts'
import { LAB } from '../data/lab.ts'
import { sortByLatest } from '../utils/achievements.ts'
import './HomePage.css'

// 홈 (spec/01_home.md). 1-1 뼈대, 1-2 첫 화면, 1-3 연구 분야, 1-4 지원 안내, 1-8 물방울 배경, 1-5 최근 성과까지 채움.
export default function HomePage() {
  // 성과 목록 상자(2-5)에서 꺼내 쓴다 — 다른 탭에서 바뀌어도 자동으로 다시 그려짐
  const { achievements } = useAchievements()

  // 최근 성과: 최신순 앞 4개 (H6, BR-14). 목록이 바뀔 때만 다시 정렬하려고 useMemo (1-5)
  const recent = useMemo(() => sortByLatest(achievements).slice(0, 4), [achievements])

  return (
    <div className="home">
      {/* ① 첫 화면: 큰 제목, 설명, 버튼 2개 + 물방울 배경(1-8). NEW 알약·통계 4칸은 성과 데이터 뒤에 */}
      <section className="home__hero" aria-label="첫 화면">
        <HeroArt />
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
      {/* 연구 분야가 0개면 제목만 남은 빈 구역이 되므로 구역째 숨김 (EX-23, P170) */}
      {LAB.researchAreas.length > 0 && (
        <section className="home__section" aria-labelledby="home-research-title">
          <div className="home-section__head">
            <p className="eyebrow">RESEARCH AREAS</p>
            <h2 id="home-research-title" className="section-title">
              우리가 다루는 문제
            </h2>
          </div>
          <ResearchAreaList areas={LAB.researchAreas} />
        </section>
      )}

      {/* ③ 최근 성과: RECENT ACHIEVEMENTS, 카드 4장 (1-5). 카드를 누르면 팝업은 1-9에서 연결 */}
      <section className="home__section" aria-labelledby="home-recent-title">
        <div className="home-section__head home-section__head--split">
          <div>
            <p className="eyebrow">RECENT ACHIEVEMENTS</p>
            <h2 id="home-recent-title" className="section-title">
              새로 더해진 기록
            </h2>
          </div>
          <Link to="/achievements" className="btn btn--secondary">
            전체 성과 보기
            <ArrowIcon />
          </Link>
        </div>

        {/* 성과가 0건이면 카드 대신 안내 (EX-09). 4건보다 적으면 있는 만큼만 */}
        {recent.length === 0 ? (
          <EmptyState message="아직 등록된 성과가 없어요." />
        ) : (
          <div className="recent-list">
            {recent.map((achievement) => (
              // onOpen: 눌렀다는 신호만 — 팝업은 1-9에서 연결 (P180)
              <RecentAchievementCard key={achievement.id} achievement={achievement} onOpen={() => {}} />
            ))}
          </div>
        )}
      </section>

      {/* ===== ④ 지원 안내 시작 — lab.ts의 recruitment.isOpen으로 켜고 끔. 아예 없애려면 여기부터 ===== */}
      {/* 회색 큰 상자 — 모집 정보·포스터는 lab.ts의 recruitment에서 고친다 (1-4) */}
      {LAB.recruitment.isOpen && (
        <section className="home__contact" aria-labelledby="home-recruit-title">
          <div className="home__contact-box">
            <RecruitBox recruitment={LAB.recruitment} />
          </div>
        </section>
      )}
      {/* ===== ④ 지원 안내 끝 — 아예 없애려면 여기까지 지운다 ===== */}
    </div>
  )
}
