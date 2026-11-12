import { describe, expect, test } from 'vitest'
import { HIDDEN_MEMBER, HONORARY_MEMBER, MEMBERS, PROFESSORS } from '../data/members.ts'
import { SAMPLE_ACHIEVEMENTS } from '../data/sampleAchievements.ts'
import type { Achievement, Member, MemberStatus, ProfessorPaper } from '../types.ts'
import {
  achievementsOf,
  countByGrade,
  countByStatus,
  memberInitial,
  papersByYear,
  periodLabel,
  positionLabel,
  recentPapers,
  sortedMembers,
  splitNames,
} from './members.ts'

// 부원 계산 함수·데이터 검사 테스트 (spec/04 D-1, test-cases UT-78~83). 실행: npm test

// 테스트용 부원 — 필요한 칸만 주고 나머지는 빈 값
function make(id: number, name: string, position: string, status: MemberStatus, startYear: number, endYear: number | null = null): Member {
  return { id, name, position, researchField: '', email: '', status, startYear, endYear, isSample: true }
}

describe('sortedMembers — 탭별 거르기·정렬 (AC-15-1, Q-D3)', () => {
  test('UT-78 직위 순 → 재학은 시작 연도 빠른 순 → 이름 가나다', () => {
    // 실제 데이터 (P260): 셋 다 학부연구생·2026 → 이름 가나다. "학부연구생 · 랩장"도 학부연구생 자리
    expect(sortedMembers(MEMBERS, 'ENROLLED').map((m) => m.name)).toEqual(['나병준', '윤승빈', '정수빈'])
    // 규칙 확인용 가짜 부원 (예시 부원을 지운 뒤에도 규칙을 계속 확인 — 처음엔 예시 데이터로 확인했음)
    const list = [
      make(1, '정민서', '학부연구생', 'ENROLLED', 2025),
      make(2, '이도윤', '석사과정', 'ENROLLED', 2024),
      make(3, '박서준', '석사과정', 'ENROLLED', 2024), // 같은 직위·같은 해 → 이름순
      make(4, '김하늘', '박사과정', 'ENROLLED', 2023),
      make(5, '최유진', '석사과정', 'GRADUATED', 2022, 2026), // 다른 탭이라 빠짐
    ]
    expect(sortedMembers(list, 'ENROLLED').map((m) => m.name)).toEqual(['김하늘', '박서준', '이도윤', '정민서'])
  })

  test('UT-79 졸업은 직위 순 → 졸업 연도 최근 순 → 이름, 원본은 그대로', () => {
    const before = MEMBERS.map((m) => m.id)
    expect(sortedMembers(MEMBERS, 'GRADUATED')).toEqual([]) // 실제 데이터엔 졸업생이 아직 없음 (P260)
    expect(MEMBERS.map((m) => m.id)).toEqual(before) // 데이터 파일 순서가 바뀌지 않음

    const list = [
      make(1, '가', '석사과정', 'GRADUATED', 2018, 2020),
      make(2, '나', '석사과정', 'GRADUATED', 2020, 2024), // 최근 졸업이 앞
      make(3, '다', '박사과정', 'GRADUATED', 2015, 2019), // 박사가 연도보다 먼저
    ]
    expect(sortedMembers(list, 'GRADUATED').map((m) => m.name)).toEqual(['다', '나', '가'])
    // 같은 직위·같은 졸업 해 → 이름순 (처음 예시 데이터의 오세린·최유진 경우)
    const same = [make(1, '최유진', '석사과정', 'GRADUATED', 2022, 2026), make(2, '오세린', '석사과정', 'GRADUATED', 2021, 2026)]
    expect(sortedMembers(same, 'GRADUATED').map((m) => m.name)).toEqual(['오세린', '최유진'])
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
    expect(countByStatus(MEMBERS)).toEqual({ ENROLLED: 3, GRADUATED: 0 }) // 실제 데이터 (P260)
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
    // 점검 P269: 교수 이름 겹침 — 화면 key는 순서로 막았지만 같은 사람을 두 번 넣은 실수일 가능성이 커서 알려 줌
    const names = PROFESSORS.map((p) => p.name.trim())
    const repeatedNames = names.filter((name, index) => names.indexOf(name) !== index)
    expect(repeatedNames, `교수 이름이 겹침: ${repeatedNames.join(', ')}`).toEqual([])
    for (const professor of PROFESSORS) {
      // 점검 P269: 사진 폴더가 페이지 주소(App.tsx의 about·members·achievements)와 같은 이름이면 배포 후 그 페이지 새로고침이 403
      if (professor.photoUrl) {
        const folder = professor.photoUrl.split('/')[1]
        expect(['about', 'members', 'achievements'], `${professor.name} 사진 폴더 "${folder}"가 페이지 주소와 겹침`).not.toContain(folder)
      }
      expect(professor.name.trim()).not.toBe('')
      if (professor.email !== '') expect(professor.email).toMatch(EMAIL_SHAPE)
      // D-3: 논문·학술활동은 제목이 있고 날짜가 'YYYY.MM' 모양 (정렬·연도 묶기가 이 모양에 기대서)
      for (const paper of [...(professor.papers ?? []), ...(professor.activities ?? [])]) {
        const where = `${professor.name} 논문 「${paper.title.slice(0, 20)}」`
        expect(paper.title.trim(), where).not.toBe('')
        expect(paper.date, `${where}: 날짜는 YYYY.MM`).toMatch(/^\d{4}\.(0[1-9]|1[0-2])$/)
      }
    }
  })

  test('UT-93 부원 카드 그림 — /images/ 아래, 페이지 주소와 같은 폴더 아님, 배율 1~3 (P307–P308)', () => {
    for (const member of MEMBERS) {
      const where = `부원 ${member.id} ${member.name}`
      if (member.photoUrl !== undefined && member.photoUrl !== '') {
        // public/ 아래 그림 주소는 "/"로 시작 — 교수 사진과 같은 /images/ 폴더에 (페이지 주소 폴더는 403, 점검 P269)
        expect(member.photoUrl, `${where}: 그림은 /images/ 아래에`).toMatch(/^\/images\//)
        const folder = member.photoUrl.split('/')[1]
        expect(['about', 'members', 'achievements'], `${where}: 그림 폴더 "${folder}"가 페이지 주소와 겹침`).not.toContain(folder)
      }
      if (member.photoScale !== undefined) {
        // 1보다 작으면 동그라미에 빈 곳이 생기고, 너무 크면 그림이 알아볼 수 없게 잘림
        expect(member.photoScale, `${where}: 배율은 1~3`).toBeGreaterThanOrEqual(1)
        expect(member.photoScale, `${where}: 배율은 1~3`).toBeLessThanOrEqual(3)
      }
    }
  })

  test('UT-95 숨은 부원 — 이름·메일 모양·기간(시작 ≤ 끝), 지금 부원과 번호·이름 안 겹침, 카드 글자 (P310–P311)', () => {
    expect(HIDDEN_MEMBER.name.trim()).not.toBe('')
    if (HIDDEN_MEMBER.email !== '') expect(HIDDEN_MEMBER.email).toMatch(EMAIL_SHAPE)
    expect(isYear(HIDDEN_MEMBER.startYear)).toBe(true)
    expect(HIDDEN_MEMBER.endYear, '예전 부원이라 끝난 해가 있어야 "2025 – 2026"').not.toBeNull()
    expect(HIDDEN_MEMBER.endYear ?? 0).toBeGreaterThanOrEqual(HIDDEN_MEMBER.startYear)
    // 지금 부원 목록과 섞이면 탭·인원 수에 들어가 숨은 의미가 없어짐
    expect(MEMBERS.map((m) => m.id)).not.toContain(HIDDEN_MEMBER.id)
    expect(MEMBERS.map((m) => m.name)).not.toContain(HIDDEN_MEMBER.name)
    // 졸업 이름표("학부연구생 졸업")로 바뀌지 않고 적힌 직위 그대로, 기간은 시작–끝
    expect(positionLabel(HIDDEN_MEMBER)).toBe('학부연구생 · 전 랩장')
    expect(periodLabel(HIDDEN_MEMBER)).toBe('2025 – 2026')
  })

  test('UT-97 명예 부원 — 지금 부원·숨은 부원과 번호·이름 안 겹침, 메일 대신 "비밀", 기간 "2025 –" (P313–P314)', () => {
    expect(HONORARY_MEMBER.name.trim()).not.toBe('')
    expect([...MEMBERS.map((m) => m.id), HIDDEN_MEMBER.id]).not.toContain(HONORARY_MEMBER.id)
    expect([...MEMBERS.map((m) => m.name), HIDDEN_MEMBER.name]).not.toContain(HONORARY_MEMBER.name)
    // 메일이 비었으니 대신 보일 글자가 있어야 카드 아래 줄이 비지 않음. 사진은 쓰지 않음(P313–P314 — 첫 글자 동그라미)
    expect(HONORARY_MEMBER.email).toBe('')
    expect(HONORARY_MEMBER.contactNote?.trim()).toBe('비밀')
    expect(HONORARY_MEMBER.photoUrl).toBeUndefined()
    expect(positionLabel(HONORARY_MEMBER)).toBe('명예 부원')
    expect(periodLabel(HONORARY_MEMBER)).toBe('2025 –')
  })
})

describe('recentPapers · papersByYear · countByGrade — 지도교수 이력 (spec/04 D-3)', () => {
  const paper = (title: string, date: string, grade = ''): ProfessorPaper => ({ title, venue: '학술지', grade, role: '교신저자', date })
  const papers = [paper('가', '2024.07', 'SCOPUS'), paper('나', '2026.02', 'SCIE'), paper('다', '2026.02'), paper('라', '2025.12', 'SCIE'), paper('마', '2026.03', 'SCI')]

  test('UT-84 최근 논문 n편 — 최신순, 같은 달은 적힌 순서, 적으면 있는 만큼, 원본 그대로', () => {
    expect(recentPapers(papers, 3).map((p) => p.title)).toEqual(['마', '나', '다'])
    expect(recentPapers(papers.slice(0, 2), 3).map((p) => p.title)).toEqual(['나', '가'])
    expect(recentPapers([], 3)).toEqual([])
    expect(papers.map((p) => p.title)).toEqual(['가', '나', '다', '라', '마'])
  })

  test('UT-85 연도별 묶기 — 최신 해부터, 묶음 안도 최신순', () => {
    expect(papersByYear(papers).map((g) => [g.year, g.papers.map((p) => p.title).join('')])).toEqual([
      ['2026', '마나다'],
      ['2025', '라'],
      ['2024', '가'],
    ])
    expect(papersByYear([])).toEqual([])
  })

  test('UT-86 등급별 편수 — 등급 없는 논문은 세지 않음, 실제 데이터는 21편 · SCIE 5 · SCOPUS 5 · SCI 1', () => {
    expect(countByGrade(papers)).toEqual([
      { grade: 'SCOPUS', count: 1 },
      { grade: 'SCIE', count: 2 },
      { grade: 'SCI', count: 1 },
    ])
    const real = PROFESSORS[0].papers ?? []
    expect(real).toHaveLength(21)
    expect(countByGrade(real)).toEqual([
      { grade: 'SCIE', count: 5 },
      { grade: 'SCOPUS', count: 5 },
      { grade: 'SCI', count: 1 },
    ])
  })
})

describe('splitNames · achievementsOf — 부원 활동 자동 모으기 (spec/04 D-4)', () => {
  test('UT-87 저자 칸 나누기 — ·,、/; 다섯 가지, 앞뒤 공백, " 외 N명" 떼기', () => {
    expect(splitNames('나병준·윤승빈, 정수빈、심유승/홍길동;김철수')).toEqual(['나병준', '윤승빈', '정수빈', '심유승', '홍길동', '김철수'])
    expect(splitNames(' 나병준 · ')).toEqual(['나병준'])
    expect(splitNames('홍길동 외 2명')).toEqual(['홍길동'])
    expect(splitNames('나병준외3명')).toEqual(['나병준'])
    expect(splitNames('')).toEqual([])
  })

  test('UT-89 괄호 붙은 저자도 이름만 — "(제1저자)"·전각 괄호·괄호 안 쉼표 (점검 P269)', () => {
    expect(splitNames('나병준(제1저자)·윤승빈 (교신)')).toEqual(['나병준', '윤승빈'])
    expect(splitNames('정수빈（공동）, 나병준')).toEqual(['정수빈', '나병준'])
    expect(splitNames('나병준(제1저자, 교신), 윤승빈')).toEqual(['나병준', '윤승빈'])
    expect(splitNames('(공동)')).toEqual([])
  })

  test('UT-88 이름이 정확히 같은 실제 성과만 최신순 — 비슷한 이름·예시 성과·빈 이름은 안 셈', () => {
    const make = (id: number, authors: string, achievedOn: string, isSample = false): Achievement => ({
      id, type: 'PAPER', title: `성과 ${id}`, achievedOn, authors, advisors: '', venue: '', doi: '', link: '', isSample,
    })
    const list = [
      make(1, '나병준·윤승빈', '2025-01-01'),
      make(2, '나병준 외 2명', '2026-03-01'),
      make(3, '나병준희', '2026-04-01'), // 비슷한 이름
      make(4, '나병', '2026-04-01'),
      make(5, '나병준', '2026-05-01', true), // 예시 성과
    ]
    expect(achievementsOf('나병준', list).map((a) => a.id)).toEqual([2, 1])
    expect(achievementsOf(' 나병준 ', list).map((a) => a.id)).toEqual([2, 1]) // 부원 이름 앞뒤 공백
    expect(achievementsOf('', list)).toEqual([])
    expect(achievementsOf('없는사람', list)).toEqual([])

    // 실제 처음 데이터: 나병준 4건, 심유승 2건, 예시 성과의 홍길동은 0건
    expect(achievementsOf('나병준', SAMPLE_ACHIEVEMENTS)).toHaveLength(4)
    expect(achievementsOf('심유승', SAMPLE_ACHIEVEMENTS)).toHaveLength(2)
    expect(achievementsOf('홍길동', SAMPLE_ACHIEVEMENTS)).toHaveLength(0)
  })
})
