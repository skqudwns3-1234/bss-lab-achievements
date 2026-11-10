import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import AchievementList from '../components/achievements/AchievementList.tsx'
import AchievementModal from '../components/achievements/AchievementModal.tsx'
import SearchFilterBar from '../components/achievements/SearchFilterBar.tsx'
import EmptyState from '../components/common/EmptyState.tsx'
import { useAchievements } from '../context/useAchievements.ts'
import { useAdminMode } from '../context/useAdminMode.ts'
import type { Achievement, AchievementFilter } from '../types.ts'
import { countByType, filterAchievements, getYears, sortByLatest } from '../utils/achievements.ts'
import './AchievementsPage.css'

// 처음 검색 조건 — "조건 초기화"도 이 값으로 되돌린다
const INITIAL_FILTER: AchievementFilter = { query: '', type: 'ALL', year: 'ALL' }

// 성과 페이지 (spec/02 B). B-1: 꾸밈 글씨·제목·개수 + 최신순 줄 목록 + 0건 안내 (P192–P193).
// B-2: 검색·유형 칩·연도로 걸러 보기 + 결과 없음 안내 (P194–P195).
// B-3: 줄을 누르면 홈과 같은 성과 팝업 (P199).
// B-4: 관리 모드면 제목 줄에 "성과 등록", 줄마다 "수정" — 둘 다 주소로 이동만 (폼은 spec/03, P209).
// B-5: 줄의 "삭제" → 그 줄 아래 확인 칸 → 삭제 (P214–P215)
export default function AchievementsPage() {
  // 성과 목록 상자(2-5)에서 꺼내 쓴다 — 예시 성과도 모두 보임("예시" 배지로 구분, BR-19).
  // 다른 탭에서 바뀌어도 자동으로 다시 그려짐 (EX-25)
  const { achievements, deleteAchievement } = useAchievements()

  // 관리 모드 켜짐 여부 — 헤더 스위치가 바꾸면 이 페이지도 다시 그려져 버튼이 생기고 사라진다 (B-4)
  const { isAdmin } = useAdminMode()

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

  // ★ 목록이 0건이 되면 검색 조건을 처음으로 (spec/02 점검 ③, P216–P217).
  //   0건 화면에는 검색 줄이 없어 조건이 안 보이는데 남아 있으면 제목이 "0 / 0"이 되고,
  //   나중에 성과가 다시 생겨도 보이지 않던 조건이 걸린 채로 시작함. 처음 값과 같은 객체가 되면 더 바꾸지 않음
  if (achievements.length === 0 && filter !== INITIAL_FILTER) {
    setFilter(INITIAL_FILTER)
  }

  // 걸러진 목록 — 검색어·유형·연도를 모두 만족(AND, BR-11). 조건이나 목록이 바뀔 때만 계산.
  // 줄(AchievementRow)은 memo라서, 다시 걸러도 성과가 그대로인 줄은 다시 그리지 않는다 (design R5)
  const filtered = useMemo(() => filterAchievements(sorted, filter), [sorted, filter])

  // 조건이 하나라도 걸렸는지 — 공백뿐인 검색어는 안 건 것으로 (BR-11)
  const isFiltered = filter.query.trim() !== '' || filter.type !== 'ALL' || filter.year !== 'ALL'

  // "조건 초기화" — EmptyState 버튼에 넘기는 함수라 useCallback으로 고정
  const resetFilter = useCallback(() => setFilter(INITIAL_FILTER), [])

  // 팝업으로 열린 성과 — 홈(1-9)과 같은 방식: 성과 자체가 아니라 번호(id)를 기억하고 지금 목록에서 찾는다.
  // 걸러진 목록(filtered)이 아니라 전체 목록(achievements)에서 찾아서, 열린 채 다른 탭 수정으로 검색 조건에서 빠져도 팝업은 그대로
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = achievements.find((achievement) => achievement.id === selectedId) ?? null
  // ★ 사라진 번호는 그리는 중에 바로 잊는다 — 다른 탭에서 지우면 팝업이 닫히고,
  //   나중에 새 성과가 같은 번호를 받아도 팝업이 다시 튀어나오지 않게 (EX-28·29)
  if (selectedId !== null && !selected) setSelectedId(null)

  // 열고 닫는 함수는 useCallback으로 고정 — 줄(AchievementRow)이 memo라서, 함수가 그릴 때마다 새로 생기면
  // 검색어를 칠 때마다 모든 줄이 다시 그려진다 (memo가 깨짐)
  const openModal = useCallback((achievement: Achievement) => setSelectedId(achievement.id), [])
  const closeModal = useCallback(() => setSelectedId(null), [])

  // ── 삭제 (B-5, P214–P215) ──
  // 확인 칸이 열린 성과 번호 — 한 번에 한 줄만 (③). 줄에는 번호가 아니라 "내가 확인 중인가" 참/거짓만 넘긴다(memo)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  // 저장에 실패했는지 — 확인 칸 안에 "저장에 실패했습니다." (②)
  const [deleteFailed, setDeleteFailed] = useState(false)
  // 지운 뒤 제목에 포커스를 줄 성과 번호 (① 다음 줄, 없으면 이전 줄). 그 줄이 포커스를 주고 나면 onFocusDone으로 지움
  const [focusId, setFocusId] = useState<number | null>(null)
  // 다 지워서 줄이 없을 때 포커스를 옮길 페이지 제목 — DOM을 직접 가리켜야 해서 useRef
  const titleRef = useRef<HTMLHeadingElement>(null)

  // ★ 확인 칸 저절로 닫기 — 그리는 중에 맞추기 (팝업 번호와 같은 방식).
  //   관리 모드가 꺼짐(이 탭·다른 탭) / 걸러진 목록에 없음(다른 탭에서 지움, 검색으로 빠짐 ④) → 닫는다.
  //   안 닫으면 다시 켜거나 검색을 지웠을 때 확인 칸이 열린 채로 튀어나옴
  if (confirmingId !== null && (!isAdmin || !filtered.some((achievement) => achievement.id === confirmingId))) {
    setConfirmingId(null)
    setDeleteFailed(false)
  }

  // 가장 최신의 걸러진 목록 — 지우는 함수가 "다음 줄"을 찾을 때 읽는다.
  // 함수 의존값에 filtered를 넣으면 검색어를 칠 때마다 함수가 새로 생겨 모든 줄이 다시 그려지므로(memo 깨짐)
  // 값만 기억하는 useRef에 두고, 그린 뒤(useEffect) 바꿔 둔다 — 그리는 중에 ref를 바꾸지 않기 (React 규칙)
  const latestFiltered = useRef(filtered)
  useEffect(() => {
    latestFiltered.current = filtered
  }, [filtered])

  // 줄에 넘기는 함수들은 모두 useCallback으로 고정 — 줄이 memo라서 (B-3과 같은 이유)
  const requestDelete = useCallback((achievement: Achievement) => {
    setConfirmingId(achievement.id) // 다른 줄이 열려 있었으면 그 칸은 저절로 닫힘 (③)
    setDeleteFailed(false)
  }, [])

  const cancelDelete = useCallback(() => {
    setConfirmingId(null)
    setDeleteFailed(false)
  }, [])

  const confirmDelete = useCallback(
    (achievement: Achievement) => {
      // 지우기 전에 다음 줄(맨 끝이면 이전 줄)을 찾아 둔다
      const list = latestFiltered.current
      const index = list.findIndex((item) => item.id === achievement.id)
      const next = list[index + 1] ?? list[index - 1] ?? null

      // 저장 먼저, 성공했을 때만 화면에서 사라짐 (EX-12 — 2-5의 deleteAchievement가 처리)
      if (!deleteAchievement(achievement.id)) {
        setDeleteFailed(true) // 줄은 그대로, 확인 칸은 열린 채로 → 바로 다시 시도 가능
        return
      }
      setConfirmingId(null)
      setDeleteFailed(false)
      if (next) {
        setFocusId(next.id)
      } else {
        titleRef.current?.focus() // 마지막 성과였으면 페이지 제목으로 (줄이 하나도 없음)
      }
    },
    [deleteAchievement],
  )

  // 지운 뒤 포커스를 받은 줄이 부르면 표시를 지운다 — 남아 있으면 나중에 다시 그릴 때 또 포커스가 옮겨감
  const clearFocus = useCallback(() => setFocusId(null), [])

  return (
    <section className="achievements-page" aria-labelledby="achievements-title">
      <div className="achievements-page__head">
        <div>
          <p className="eyebrow">PAPERS · AWARDS · PATENTS · CONTESTS</p>
          {/* 제목 옆 개수 — 평소엔 전체(FR-06), 걸렀을 때만 "남은 수 / 전체" (Q-B2) */}
          {/* tabIndex -1: Tab으로는 안 오고, 마지막 성과를 지운 뒤 코드로만 포커스를 옮겨 올 수 있게 (B-5 ①) */}
          <h1 id="achievements-title" className="page-title" ref={titleRef} tabIndex={-1}>
            성과{' '}
            <span className="achievements-page__count">
              {isFiltered ? `${filtered.length} / ${achievements.length}` : achievements.length}
            </span>
          </h1>
        </div>
        {/* 관리 모드: 시안대로 제목 줄 오른쪽(휴대폰은 제목 아래)에 "성과 등록" — 등록 폼 주소로 이동만 (P209 ②) */}
        {isAdmin && (
          <Link to="/achievements/new" className="btn btn--primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            성과 등록
          </Link>
        )}
      </div>

      {achievements.length === 0 ? (
        // 성과가 0건 — 찾을 게 없으니 검색·필터 줄도 숨기고 안내만 (EX-09, P195).
        // 관리 모드면 바로 위 "성과 등록" 버튼을 가리키는 도움말만 더함 — 같은 버튼을 두 개 두지 않게 (P209 ⑥)
        <EmptyState
          message="아직 등록된 성과가 없어요."
          hint={isAdmin ? "위의 '성과 등록'으로 첫 성과를 추가해 보세요." : undefined}
        />
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
            <AchievementList
              achievements={filtered}
              isAdmin={isAdmin}
              confirmingId={confirmingId}
              deleteFailed={deleteFailed}
              focusId={focusId}
              onOpen={openModal}
              onDelete={requestDelete}
              onCancelDelete={cancelDelete}
              onConfirmDelete={confirmDelete}
              onFocusDone={clearFocus}
            />
          )}
        </>
      )}

      {/* 성과 팝업 (B-3) — 열린 성과가 있을 때만. 홈에서 만든 AchievementModal을 그대로 씀 */}
      {selected && <AchievementModal achievement={selected} onClose={closeModal} />}
    </section>
  )
}
