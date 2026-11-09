import { useMemo } from 'react'
import AchievementList from '../components/achievements/AchievementList.tsx'
import EmptyState from '../components/common/EmptyState.tsx'
import { useAchievements } from '../context/useAchievements.ts'
import { sortByLatest } from '../utils/achievements.ts'
import './AchievementsPage.css'

// 성과 페이지 (spec/02 B). B-1: 꾸밈 글씨·제목·전체 개수 + 최신순 줄 목록 + 0건 안내 (P192–P193).
// 검색·필터(B-2), 줄을 누르면 팝업(B-3), 관리 모드(B-4), 삭제(B-5)는 다음 단계
export default function AchievementsPage() {
  // 성과 목록 상자(2-5)에서 꺼내 쓴다 — 예시 성과도 모두 보임("예시" 배지로 구분, BR-19).
  // 다른 탭에서 바뀌어도 자동으로 다시 그려짐 (EX-25)
  const { achievements } = useAchievements()

  // 최신순(같은 날짜면 번호 큰 것이 위, BR-10). 목록이 바뀔 때만 다시 정렬하려고 useMemo —
  // B-2부터 검색어를 칠 때마다 이 페이지가 다시 그려지는데, 그때마다 전체를 다시 정렬하지 않게
  const sorted = useMemo(() => sortByLatest(achievements), [achievements])

  return (
    <section className="achievements-page" aria-labelledby="achievements-title">
      <div className="achievements-page__head">
        <p className="eyebrow">PAPERS · AWARDS · PATENTS · CONTESTS</p>
        {/* 제목 옆 전체 개수 (FR-06). 걸러 볼 때의 "3 / 8"은 B-2 (Q-B2) */}
        <h1 id="achievements-title" className="page-title">
          성과 <span className="achievements-page__count">{achievements.length}</span>
        </h1>
      </div>

      {/* 성과가 0건이면 목록 대신 안내 (EX-09). 검색 결과 없음(EX-08)은 B-2에서 다른 문장으로 */}
      {sorted.length === 0 ? (
        <EmptyState message="아직 등록된 성과가 없어요." />
      ) : (
        <AchievementList achievements={sorted} />
      )}
    </section>
  )
}
