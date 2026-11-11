import type { Member, MemberStatus } from '../types.ts'

// 부원 페이지 계산 함수 (spec/04 D-1, P242–P243). 화면(React)과 상관없는 순수 함수만 —
// 같은 값을 넣으면 늘 같은 결과, 받은 목록은 바꾸지 않는다 (utils/achievements.ts와 같은 방식)

// 직위 순위: 박사 → 석사 → 학부연구생 → 그 밖 (Q-D3).
// 직위가 자유 글자라(P242) 정확히 같은 글자가 아니라 "글자 안에 든 말"로 본다 —
// '석사 과정'(띄어 씀)·'석사과정(휴학)'도 석사, 사용자가 말한 '학사'는 학부연구생 자리
function positionRank(position: string): number {
  if (position.includes('박사')) return 0
  if (position.includes('석사')) return 1
  if (position.includes('학부') || position.includes('학사')) return 2
  return 3 // '연구원' 같은 다른 글자는 맨 뒤
}

// 한 탭의 부원만 걸러 정렬한 새 목록 (AC-15-1, Q-D3).
// 재학: 직위 → 시작 연도 빠른 순 → 이름 가나다 / 졸업: 직위 → 졸업 연도 최근 순 → 이름 가나다 (P240·P242)
// filter가 새 배열을 만들어 sort가 원본(데이터 파일)을 바꾸지 않는다
export function sortedMembers(list: Member[], status: MemberStatus): Member[] {
  return list
    .filter((member) => member.status === status)
    .sort((a, b) => {
      const byRank = positionRank(a.position) - positionRank(b.position)
      if (byRank !== 0) return byRank
      const byYear =
        status === 'ENROLLED'
          ? a.startYear - b.startYear // 먼저 들어온 사람이 앞
          : (b.endYear ?? 0) - (a.endYear ?? 0) // 최근 졸업이 앞
      if (byYear !== 0) return byYear
      return a.name.localeCompare(b.name, 'ko') // 한글 가나다순
    })
}

// 탭 옆 숫자 — 재학·졸업 인원 수 (교수는 따로라 안 셈)
export function countByStatus(list: Member[]): Record<MemberStatus, number> {
  const counts: Record<MemberStatus, number> = { ENROLLED: 0, GRADUATED: 0 }
  for (const member of list) counts[member.status] += 1
  return counts
}

// 카드의 첫 글자 동그라미: 앞뒤 공백을 빼고 첫 글자, 영어는 대문자, 비면 '?'.
// Array.from — 이모지처럼 두 칸짜리 글자도 한 글자로 셈 (목록 줄 제목과 같은 방식)
export function memberInitial(name: string): string {
  const first = Array.from(name.trim())[0]
  return first === undefined ? '?' : first.toUpperCase()
}

// 기간 글자: 재학 '2023 –' / 졸업 '2022 – 2026' (시안, Q-D2)
export function periodLabel(member: Member): string {
  return member.endYear === null ? `${member.startYear} –` : `${member.startYear} – ${member.endYear}`
}

// 직위 이름표: 재학은 적힌 직위 그대로, 졸업은 시안처럼 '석사 졸업' 모양 — 졸업생이 다니는 사람처럼 읽히지 않게 (P242)
const GRADUATE_LABELS = ['박사 졸업', '석사 졸업', '학부연구생 졸업']
export function positionLabel(member: Member): string {
  const position = member.position.trim()
  if (member.status === 'ENROLLED') return position
  const rank = positionRank(position)
  if (rank < GRADUATE_LABELS.length) return GRADUATE_LABELS[rank]
  return position === '' ? '졸업' : `${position} 졸업` // 가이드 밖 글자 — '연구원 졸업'
}
