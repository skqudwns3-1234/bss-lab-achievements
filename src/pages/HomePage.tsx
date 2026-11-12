import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router'
import AchievementModal from '../components/achievements/AchievementModal.tsx'
import ArrowIcon from '../components/common/ArrowIcon.tsx'
import EmptyState from '../components/common/EmptyState.tsx'
import HeroArt from '../components/home/HeroArt.tsx'
import RecentAchievementCard from '../components/home/RecentAchievementCard.tsx'
import RecruitBox from '../components/home/RecruitBox.tsx'
import StatList from '../components/home/StatList.tsx'
import { useAchievements } from '../context/useAchievements.ts'
import { LAB } from '../data/lab.ts'
import type { Achievement } from '../types.ts'
import {
  ACHIEVEMENT_TYPES,
  TYPE_LABELS,
  countByType,
  formatDate,
  getNewestSummary,
  sortByLatest,
} from '../utils/achievements.ts'
import { todayYmd } from '../utils/date.ts'
import './HomePage.css'

// 홈 (spec/01_home.md). 1-1 뼈대, 1-2 첫 화면, 1-3 연구 분야, 1-4 지원 안내, 1-8 물방울 배경, 1-5 최근 성과, 1-9 팝업, 1-6 통계, 1-7 NEW 알약까지 — 홈 완성.
// 1-3 연구 분야는 P288에 홈에서 빼고 연구실 소개에만 남김
export default function HomePage() {
  // 성과 목록 상자(2-5)에서 꺼내 쓴다 — 다른 탭에서 바뀌어도 자동으로 다시 그려짐
  const { achievements } = useAchievements()

  // 최근 성과: 최신순 앞 4개 (H6, BR-14). 목록이 바뀔 때만 다시 정렬하려고 useMemo (1-5)
  const recent = useMemo(() => sortByLatest(achievements).slice(0, 4), [achievements])

  // 실제 성과만 (예시 성과는 뺌) — 통계 4칸(1-6)과 NEW 알약(1-7)이 같은 기준으로 같이 씀 (BR-20, P184·P186).
  // 아래 계산들은 팝업을 열고 닫을 때처럼 목록은 그대로인데 홈만 다시 그려질 때 다시 하지 않으려고 useMemo
  // — 목록이 바뀔 때만 계산 (지금 8건에서는 차이가 작음)
  const real = useMemo(() => achievements.filter((achievement) => !achievement.isSample), [achievements])

  // 통계 4칸: 실제 성과를 유형별로 세서 논문·수상·특허·공모전 순서(ACHIEVEMENT_TYPES)로 칸을 만든다 (1-6)
  const stats = useMemo(() => {
    const counts = countByType(real)
    return ACHIEVEMENT_TYPES.map((type) => ({ label: TYPE_LABELS[type], count: counts[type] }))
  }, [real])

  // NEW 알약: 실제 성과 중 오늘까지의 가장 최근 날짜와 그날 개수 (1-7, P186). 없으면 null → 숨김 (EX-09, EX-32).
  // 오늘 날짜는 계산할 때 한 번 읽는다 — 켜 둔 채 자정이 지나면 목록이 바뀌거나 새로고침할 때 반영 (영향 작아 그대로)
  const newest = useMemo(() => getNewestSummary(real, todayYmd()), [real])

  // 팝업으로 열린 성과 — 성과 자체가 아니라 번호(id)를 기억하고 지금 목록에서 찾는다 (1-9, P182).
  // 그래서 팝업이 열린 채 다른 탭에서 그 성과를 고치면 바로 반영되고, 지우면 팝업이 저절로 닫힌다
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = achievements.find((achievement) => achievement.id === selectedId) ?? null
  // ★ 사라진 번호는 바로 잊는다 — 안 잊으면 나중에 새 성과가 같은 번호(가장 큰 번호 + 1)를 받을 때 팝업이 다시 튀어나옴.
  //   렌더 중에 상태를 맞추는 방식(React 공식 문서) — useEffect로 한 번 더 그리는 것보다 단순
  if (selectedId !== null && !selected) setSelectedId(null)

  // 열고 닫는 함수는 useCallback으로 고정 — 카드·팝업에 넘기는 함수가 그릴 때마다 새로 생기지 않게
  const openModal = useCallback((achievement: Achievement) => setSelectedId(achievement.id), [])
  const closeModal = useCallback(() => setSelectedId(null), [])

  return (
    <div className="home">
      {/* ① 첫 화면: NEW 알약(1-7), 큰 제목, 설명, 버튼 2개 + 물방울 배경(1-8) + 통계 4칸(1-6) */}
      <section className="home__hero" aria-label="첫 화면">
        <HeroArt />
        <div className="home-hero__content">
          {/* NEW 알약 — 보기만 하고 눌러도 동작 없음 (시안대로, P186) */}
          {newest && (
            <p className="home-hero__new">
              <span className="home-hero__new-tag">NEW</span>
              최근 등록 · {formatDate(newest.date)} {newest.label} {newest.count}건
            </p>
          )}
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

          {/* 통계 4칸 — 유형별 실제 성과 개수 (1-6) */}
          <StatList stats={stats} />
        </div>
      </section>

      {/* ② 연구 분야 구역은 지움 (P288) — 연구실 소개(/about)에 같은 목록이 있고, 홈은 성과 중심으로 (사용자 결정, P287–P288) */}

      {/* ③ 최근 성과: RECENT ACHIEVEMENTS, 카드 4장 (1-5). 카드를 누르면 성과 팝업 (1-9) */}
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
              <RecentAchievementCard key={achievement.id} achievement={achievement} onOpen={openModal} />
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

      {/* 성과 팝업 (1-9) — 열린 성과가 있을 때만 */}
      {selected && <AchievementModal achievement={selected} onClose={closeModal} />}
    </div>
  )
}
