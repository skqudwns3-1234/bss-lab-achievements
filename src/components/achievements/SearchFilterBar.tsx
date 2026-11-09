import { useEffect, useState } from 'react'
import type { AchievementFilter, AchievementType } from '../../types.ts'
import { ACHIEVEMENT_TYPES, TYPE_LABELS } from '../../utils/achievements.ts'
import './SearchFilterBar.css'

// 마지막 입력 후 이만큼(ms) 더 안 치면 검색 — 한글 조합 중간 글자("나벼")에서 결과가 0건이 됐다가
// 다시 나타나며 화면이 깜빡이던 문제를 막는다 (사용자 발견, P196–P197). 바꾸려면 이 숫자만
const SEARCH_DELAY_MS = 250

type SearchFilterBarProps = {
  filter: AchievementFilter // 지금 검색 조건 — 상태는 부모(AchievementsPage)가 가진다
  years: number[] // 연도 선택지 (전체 목록에 있는 연도만, 최신순 — Q4)
  typeCounts: Record<AchievementType, number> // 유형 칩 옆 숫자 (전체 목록 기준 — Q-B1)
  total: number // "전체" 칩 옆 숫자
  onChange: (next: AchievementFilter) => void // 조건이 바뀌면 새 조건 전체를 올린다
}

// 성과 목록 위 검색·필터 줄 (spec/02 B-2, design 5.4, P194–P195).
// 검색칸·칩·연도 중 무엇이 바뀌든 { ...filter, 바뀐 칸 }으로 새 조건을 만들어 부모에게 올린다.
// 칩·연도는 누르는 즉시, 검색어만 SEARCH_DELAY_MS만큼 멈췄을 때 올린다 (P197)
export default function SearchFilterBar({ filter, years, typeCounts, total, onChange }: SearchFilterBarProps) {
  // 입력칸에 보이는 글자 — 치는 즉시 바뀌어야 해서 이 컴포넌트가 따로 들고, 검색 조건(부모)에는 조금 늦게 올린다
  const [draft, setDraft] = useState(filter.query)

  // 부모가 검색어를 바꾸면("조건 초기화") 입력칸도 맞춘다 — 지난번 부모 값을 기억해 두고 그리는 중에 달라졌으면 맞추기
  // (홈 팝업 번호·헤더 메뉴와 같은 "렌더 중에 상태 맞추기")
  const [syncedQuery, setSyncedQuery] = useState(filter.query)
  if (filter.query !== syncedQuery) {
    setSyncedQuery(filter.query)
    setDraft(filter.query)
  }

  // 입력이 멈추면 검색어를 올린다 — 타이머는 화면 밖 일이라 useEffect, 다시 치면 정리 함수가 지난 타이머를 취소.
  // filter도 의존값이라, 기다리는 중에 칩·연도를 눌러도 그 최신 조건에 검색어를 얹어 올린다
  useEffect(() => {
    if (draft === filter.query) return
    const timer = setTimeout(() => onChange({ ...filter, query: draft }), SEARCH_DELAY_MS)
    return () => clearTimeout(timer)
  }, [draft, filter, onChange])

  // 칩 5개: 전체 + 정해 둔 유형 4가지 (개수가 0인 유형도 보임)
  const chips = [
    { value: 'ALL' as const, label: '전체', count: total },
    ...ACHIEVEMENT_TYPES.map((type) => ({ value: type, label: TYPE_LABELS[type], count: typeCounts[type] })),
  ]

  return (
    <div className="search-filter">
      <div className="search-filter__search">
        {/* 라벨은 시안처럼 화면에선 숨기고 화면 낭독기만 읽음. 지도교수로도 찾아져서 함께 적음 (P195) */}
        <label htmlFor="achievement-search" className="visually-hidden">
          제목·저자·지도교수 검색
        </label>
        <svg
          className="search-filter__icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          id="achievement-search"
          type="search"
          className="search-filter__input"
          placeholder="제목, 저자, 지도교수로 검색"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </div>

      {/* 유형 칩 — 누른 칩은 aria-pressed로 화면 낭독기에도 "눌림"을 알림 */}
      <div className="search-filter__chips" role="group" aria-label="유형">
        {chips.map((chip) => (
          <button
            key={chip.value}
            type="button"
            className="search-filter__chip"
            aria-pressed={filter.type === chip.value}
            onClick={() => onChange({ ...filter, type: chip.value })}
          >
            {chip.label}
            <span className="search-filter__chip-count">{chip.count}</span>
          </button>
        ))}
      </div>

      <div className="search-filter__year">
        <label htmlFor="achievement-year">연도</label>
        {/* 선택칸 값은 글자라서, 전체가 아니면 숫자로 바꿔 올린다 */}
        <select
          id="achievement-year"
          className="search-filter__select"
          value={filter.year}
          onChange={(event) =>
            onChange({ ...filter, year: event.target.value === 'ALL' ? 'ALL' : Number(event.target.value) })
          }
        >
          <option value="ALL">전체</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
