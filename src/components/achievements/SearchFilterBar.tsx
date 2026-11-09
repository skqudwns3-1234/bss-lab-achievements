import type { AchievementFilter, AchievementType } from '../../types.ts'
import { ACHIEVEMENT_TYPES, TYPE_LABELS } from '../../utils/achievements.ts'
import './SearchFilterBar.css'

type SearchFilterBarProps = {
  filter: AchievementFilter // 지금 검색 조건 — 상태는 부모(AchievementsPage)가 가진다
  years: number[] // 연도 선택지 (전체 목록에 있는 연도만, 최신순 — Q4)
  typeCounts: Record<AchievementType, number> // 유형 칩 옆 숫자 (전체 목록 기준 — Q-B1)
  total: number // "전체" 칩 옆 숫자
  onChange: (next: AchievementFilter) => void // 조건이 바뀌면 새 조건 전체를 올린다
}

// 성과 목록 위 검색·필터 줄 (spec/02 B-2, design 5.4, P194–P195). 받은 조건을 그리기만 하고 상태는 없다.
// 검색칸·칩·연도 중 무엇이 바뀌든 { ...filter, 바뀐 칸 }으로 새 조건을 만들어 부모에게 올린다 — 입력하는 즉시 목록이 바뀜 (FR-07)
export default function SearchFilterBar({ filter, years, typeCounts, total, onChange }: SearchFilterBarProps) {
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
          value={filter.query}
          onChange={(event) => onChange({ ...filter, query: event.target.value })}
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
