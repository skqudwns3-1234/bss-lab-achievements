import { useCallback, useMemo, useState } from 'react'
import AchievementList from '../components/achievements/AchievementList.tsx'
import SearchFilterBar from '../components/achievements/SearchFilterBar.tsx'
import EmptyState from '../components/common/EmptyState.tsx'
import { useAchievements } from '../context/useAchievements.ts'
import type { AchievementFilter } from '../types.ts'
import { countByType, filterAchievements, getYears, sortByLatest } from '../utils/achievements.ts'
import './AchievementsPage.css'

// 처음 검색 조건 — "조건 초기화"도 이 값으로 되돌린다
const INITIAL_FILTER: AchievementFilter = { query: '', type: 'ALL', year: 'ALL' }

// 성과 페이지 (spec/02 B). B-1: 꾸밈 글씨·제목·개수 + 최신순 줄 목록 + 0건 안내 (P192–P193).
// B-2: 검색·유형 칩·연도로 걸러 보기 + 결과 없음 안내 (P194–P195).
// 줄을 누르면 팝업(B-3), 관리 모드(B-4), 삭제(B-5)는 다음 단계
export default function AchievementsPage() {
  // 성과 목록 상자(2-5)에서 꺼내 쓴다 — 예시 성과도 모두 보임("예시" 배지로 구분, BR-19).
  // 다른 탭에서 바뀌어도 자동으로 다시 그려짐 (EX-25)
  const { achievements } = useAchievements()

  // 검색 조건 — 이 화면에서만 쓰는 값이라 이 페이지의 상태로 (주소에는 남기지 않음, Q-B6)
  const [filter, setFilter] = useState<AchievementFilter>(INITIAL_FILTER)

  // 최신순(같은 날짜면 번호 큰 것이 위, BR-10). 목록이 바뀔 때만 — 검색어를 칠 때마다 다시 정렬하지 않게
  const sorted = useMemo(() => sortByLatest(achievements), [achievements])

  // 칩 숫자·연도 선택지는 전체 목록 기준 (Q-B1, P195) — 검색어와 상관없이 목록이 바뀔 때만 계산
  const typeCounts = useMemo(() => countByType(achievements), [achievements])
  const years = useMemo(() => getYears(achievements), [achievements])

  // ★ 고른 연도가 사라지면(다른 탭에서 그 연도 성과를 다 지움) 조건을 "전체"로 되돌린다 (EX-35, P195).
  //   선택지에 없는 값이 골라진 채 남지 않게 — 그리는 중에 상태 맞추기 (홈 팝업 번호·헤더 메뉴와 같은 방식)
  if (filter.year !== 'ALL' && !years.includes(filter.year)) {
    setFilter({ ...filter, year: 'ALL' })
  }

  // 걸러진 목록 — 검색어·유형·연도를 모두 만족(AND, BR-11). 조건이나 목록이 바뀔 때만 계산.
  // 줄(AchievementRow)은 memo라서, 다시 걸러도 성과가 그대로인 줄은 다시 그리지 않는다 (design R5)
  const filtered = useMemo(() => filterAchievements(sorted, filter), [sorted, filter])

  // 조건이 하나라도 걸렸는지 — 공백뿐인 검색어는 안 건 것으로 (BR-11)
  const isFiltered = filter.query.trim() !== '' || filter.type !== 'ALL' || filter.year !== 'ALL'

  // "조건 초기화" — EmptyState 버튼에 넘기는 함수라 useCallback으로 고정
  const resetFilter = useCallback(() => setFilter(INITIAL_FILTER), [])

  return (
    <section className="achievements-page" aria-labelledby="achievements-title">
      <div className="achievements-page__head">
        <p className="eyebrow">PAPERS · AWARDS · PATENTS · CONTESTS</p>
        {/* 제목 옆 개수 — 평소엔 전체(FR-06), 걸렀을 때만 "남은 수 / 전체" (Q-B2) */}
        <h1 id="achievements-title" className="page-title">
          성과{' '}
          <span className="achievements-page__count">
            {isFiltered ? `${filtered.length} / ${achievements.length}` : achievements.length}
          </span>
        </h1>
      </div>

      {achievements.length === 0 ? (
        // 성과가 0건 — 찾을 게 없으니 검색·필터 줄도 숨기고 안내만 (EX-09, P195)
        <EmptyState message="아직 등록된 성과가 없어요." />
      ) : (
        <>
          <SearchFilterBar
            filter={filter}
            years={years}
            typeCounts={typeCounts}
            total={achievements.length}
            onChange={setFilter}
          />
          {filtered.length === 0 ? (
            // 조건에 맞는 게 없음 — 성과 0건과 다른 문장 + 도움말 + 초기화 (EX-08)
            <div className="achievements-page__empty">
              <EmptyState
                message="조건에 맞는 성과가 없어요."
                hint="검색어를 줄이거나 유형·연도를 바꿔 보세요."
                actionLabel="조건 초기화"
                onAction={resetFilter}
              />
            </div>
          ) : (
            <AchievementList achievements={filtered} />
          )}
        </>
      )}
    </section>
  )
}
