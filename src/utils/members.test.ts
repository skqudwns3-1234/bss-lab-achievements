import { describe, expect, test } from 'vitest'
import { MEMBERS, PROFESSORS } from '../data/members.ts'
import type { Member, MemberStatus } from '../types.ts'
import { countByStatus, memberInitial, periodLabel, positionLabel, sortedMembers } from './members.ts'

// 부원 계산 함수·데이터 검사 테스트 (spec/04 D-1, test-cases UT-78~83). 실행: npm test

// 테스트용 부원 — 필요한 칸만 주고 나머지는 빈 값
function make(id: number, name: string, position: string, status: MemberStatus, startYear: number, endYear: number | null = null): Member {
  return { id, name, position, researchField: '', email: '', status, startYear, endYear, isSample: true }
}

describe('sortedMembers — 탭별 거르기·정렬 (AC-15-1, Q-D3)', () => {
  test('UT-78 직위 순 → 재학은 시작 연도 빠른 순 → 이름 가나다 (예시 데이터)', () => {
    expect(sortedMembers(MEMBERS, 'ENROLLED').map((m) => m.name)).toEqual(['김하늘', '박서준', '이도윤', '정민서'])
  })

  test('UT-79 졸업은 직위 순 → 졸업 연도 최근 순 → 이름, 원본은 그대로', () => {
    const before = MEMBERS.map((m) => m.id)
    expect(sortedMembers(MEMBERS, 'GRADUATED').map((m) => m.name)).toEqual(['오세린', '최유진', '한지우'])
    expect(MEMBERS.map((m) => m.id)).toEqual(before) // 데이터 파일 순서가 바뀌지 않음

    const list = [
      make(1, '가', '석사과정', 'GRADUATED', 2018, 2020),
      make(2, '나', '석사과정', 'GRADUATED', 2020, 2024), // 최근 졸업이 앞
      make(3, '다', '박사과정', 'GRADUATED', 2015, 2019), // 박사가 연도보다 먼저
    ]
    expect(sortedMembers(list, 'GRADUATED').map((m) => m.name)).toEqual(['다', '나', '가'])
  })

  test('UT-80 직위는 자유 글자 — 글자 안의 박사·석사·학부(학사)로 순위, 그 밖은 맨 뒤', () => {
    const list = [
      make(1, '가', '연구원', 'ENROLLED', 2020),
      make(2, '나', '학사', 'ENROLLED', 2020),
      make(3, '다', '석사 과정', 'ENROLLED', 2020), // 띄어 써도 석사
      make(4, '라', ' 박사과정(휴학) ', 'ENROLLED', 2020),
    ]
    expect(sortedMembers(list, 'ENROLLED').map((m) => m.name)).toEqual(['라', '다', '나', '가'])
    expect(sortedMembers([], 'ENROLLED')).toEqual([])
  })
})

describe('countByStatus · memberInitial · periodLabel · positionLabel', () => {
  test('UT-81 인원 수 (빈 목록은 0), 첫 글자 (공백·영어 대문자·빈 이름 ?)', () => {
    expect(countByStatus(MEMBERS)).toEqual({ ENROLLED: 4, GRADUATED: 3 })
    expect(countByStatus([])).toEqual({ ENROLLED: 0, GRADUATED: 0 })
    expect(memberInitial(' 김하늘 ')).toBe('김')
    expect(memberInitial('alex kim')).toBe('A')
    expect(memberInitial('   ')).toBe('?')
  })

  test('UT-82 기간 글자와 직위 이름표 (졸업생은 "석사 졸업" 모양)', () => {
    expect(periodLabel(make(1, '가', '석사과정', 'ENROLLED', 2023))).toBe('2023 –')
    expect(periodLabel(make(1, '가', '석사과정', 'GRADUATED', 2022, 2026))).toBe('2022 – 2026')
    expect(positionLabel(make(1, '가', ' 석사과정 ', 'ENROLLED', 2023))).toBe('석사과정')
    expect(positionLabel(make(1, '가', '박사과정', 'GRADUATED', 2015, 2020))).toBe('박사 졸업')
    expect(positionLabel(make(1, '가', '석사 과정', 'GRADUATED', 2015, 2020))).toBe('석사 졸업')
    expect(positionLabel(make(1, '가', '학부연구생', 'GRADUATED', 2015, 2020))).toBe('학부연구생 졸업')
    expect(positionLabel(make(1, '가', '연구원', 'GRADUATED', 2015, 2020))).toBe('연구원 졸업')
    expect(positionLabel(make(1, '가', '', 'GRADUATED', 2015, 2020))).toBe('졸업')
  })
})

// 데이터 파일 검사 — members.ts를 고칠 때(실제 데이터로 바꿀 때) 실수를 바로 알려 준다 (P242)
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // 이름@도메인.끝 모양 (빈칸은 따로 허용)
const isYear = (year: number) => Number.isInteger(year) && year >= 1990 && year <= 2100

describe('data/members.ts 검사', () => {
  test('UT-83 번호 겹침 없음, 이름 있음, 졸업 연도 규칙, 연도 범위, 이메일 모양 (부원·교수)', () => {
    // 겹친 번호를 실패 문장에 보여 줌 — 그냥 개수만 비교하면 "expected 6 to be 7"처럼 무엇이 문제인지 안 보여서
    const ids = MEMBERS.map((m) => m.id)
    const repeated = ids.filter((id, index) => ids.indexOf(id) !== index)
    expect(repeated, `번호가 겹침: ${repeated.join(', ')}`).toEqual([])

    for (const member of MEMBERS) {
      const where = `부원 ${member.id} ${member.name}` // 실패하면 어느 줄인지 보이게
      expect(member.name.trim(), where).not.toBe('')
      expect(isYear(member.startYear), where).toBe(true)
      if (member.status === 'GRADUATED') {
        expect(member.endYear, `${where}: 졸업생은 졸업 연도가 있어야 함`).not.toBeNull()
        expect(isYear(member.endYear ?? 0), where).toBe(true)
        expect(member.endYear ?? 0, `${where}: 졸업 연도가 시작 연도보다 앞`).toBeGreaterThanOrEqual(member.startYear)
      } else {
        expect(member.endYear, `${where}: 재학생은 졸업 연도가 없어야 함`).toBeNull()
      }
      if (member.email !== '') expect(member.email, where).toMatch(EMAIL_SHAPE)
    }

    expect(PROFESSORS.length).toBeGreaterThan(0)
    for (const professor of PROFESSORS) {
      expect(professor.name.trim()).not.toBe('')
      if (professor.email !== '') expect(professor.email).toMatch(EMAIL_SHAPE)
    }
  })
})
