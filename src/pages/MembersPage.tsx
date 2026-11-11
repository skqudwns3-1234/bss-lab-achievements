import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router'
import MemberCard from '../components/members/MemberCard.tsx'
import ProfessorCard from '../components/members/ProfessorCard.tsx'
import EmptyState from '../components/common/EmptyState.tsx'
import { useAchievements } from '../context/useAchievements.ts'
import { MEMBERS, PROFESSORS } from '../data/members.ts'
import type { MemberStatus } from '../types.ts'
import { achievementsOf, countByStatus, sortedMembers } from '../utils/members.ts'
import './MembersPage.css'

// 두 탭 — 주소 값(param)·탭 이름·0명일 때 문장
const TABS: { status: MemberStatus; param: string; label: string; empty: string }[] = [
  { status: 'ENROLLED', param: 'enrolled', label: '재학', empty: '아직 재학 중인 부원이 없어요.' },
  { status: 'GRADUATED', param: 'graduated', label: '졸업', empty: '아직 졸업한 부원이 없어요.' },
]

// 부원 페이지 (spec/04 D-2, P246–P247, FR-15). 순서: 제목 → 지도교수(탭 밖, 늘 보임) → 재학/졸업 탭 → 카드.
// 고른 탭은 상태(useState)가 아니라 주소의 ?tab= 이 들고 있다 (Q-D5 "주소에 남기기" P241) —
// 새로고침·뒤로 가기에도 유지. 목록은 그릴 때마다 계산하고 useMemo는 안 씀 (Q-D6 — 부원 수십 명이라 가벼움)
export default function MembersPage() {
  // 주소의 ?tab= 읽고 쓰기 (라우터 기능). "graduated"(대소문자 무시)일 때만 졸업, 없거나 이상한 값은 재학
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: MemberStatus = searchParams.get('tab')?.toLowerCase() === 'graduated' ? 'GRADUATED' : 'ENROLLED'
  const current = TABS.find((item) => item.status === tab) ?? TABS[0]

  // 성과 목록 (성과 페이지와 같은 상자) — 부원 활동을 여기서 계산해서, 성과를 등록·수정·삭제하거나 다른 탭에서 바꾸면 바로 반영 (D-4)
  const { achievements } = useAchievements()
  const counts = countByStatus(MEMBERS) // 탭 옆 숫자 (교수는 안 셈)
  const members = sortedMembers(MEMBERS, tab) // 직위 → 연도 → 이름 (Q-D3)

  // 화살표 키로 옮길 때 그 탭 버튼에 포커스를 줘야 해서 실제 버튼(DOM)을 가리킴
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // 탭 고르기 — 재학은 /members(tab 없이, ④), 졸업은 /members?tab=graduated.
  // replace: 탭을 여러 번 바꿔도 뒤로 가기 한 번이면 이전 페이지 (②). 레이아웃은 경로가 바뀔 때만 맨 위로 올려서 화면이 튀지 않음
  function selectTab(status: MemberStatus) {
    setSearchParams(status === 'GRADUATED' ? { tab: 'graduated' } : {}, { replace: true })
  }

  // 탭 안 키보드 (웹 접근성 탭 모양): ←→ 옆 탭(양 끝에서는 반대쪽으로), Home·End 처음·끝 — 옮기면 바로 그 탭을 보여 줌 (③)
  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TABS.length - 1
    let next: number
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault() // 화면이 옆·맨 위로 스크롤되지 않게
    selectTab(TABS[next].status)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className="members-page" aria-labelledby="members-title">
      <div className="members-page__head">
        <p className="eyebrow">MEMBERS</p>
        <h1 id="members-title" className="page-title">
          부원
        </h1>
      </div>

      {/* 지도교수 — 탭과 상관없이 맨 위에 따로, 크게 (P240·P246). 데이터가 없으면 자리째 숨김 */}
      {PROFESSORS.length > 0 && (
        <div className="members-page__professors">
          {PROFESSORS.map((professor) => (
            <ProfessorCard key={professor.name} professor={professor} />
          ))}
        </div>
      )}

      {/* 재학/졸업 탭 (시안, Q-D4 진짜 탭). 고른 탭만 Tab 키로 들어가고(tabIndex 0), 나머지는 화살표로 */}
      <div className="members-page__tabs" role="tablist" aria-label="부원 구분">
        {TABS.map((item, index) => {
          const selected = item.status === tab
          return (
            <button
              key={item.status}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`members-tab-${item.param}`}
              className="members-page__tab"
              aria-selected={selected}
              aria-controls="members-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(item.status)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {item.label}
              <span className="members-page__tab-count">{counts[item.status]}</span>
            </button>
          )
        })}
      </div>

      {/* 고른 탭의 부원 카드 — 0명이면 빈 상태 문장 */}
      <div
        id="members-panel"
        className="members-page__panel"
        role="tabpanel"
        aria-labelledby={`members-tab-${current.param}`}
      >
        {members.length === 0 ? (
          <EmptyState message={current.empty} />
        ) : (
          <ul className="members-page__grid">
            {members.map((member) => (
              <li key={member.id}>
                {/* 활동은 그릴 때 계산 — 부원·성과가 수십 개라 가벼워 useMemo는 안 씀 (Q-D6과 같은 판단) */}
                <MemberCard member={member} activities={achievementsOf(member.name, achievements)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
