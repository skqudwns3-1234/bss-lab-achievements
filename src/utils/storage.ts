import { SAMPLE_ACHIEVEMENTS } from '../data/sampleAchievements.ts'
import type { Achievement, AchievementType, LoadResult } from '../types.ts'

// 저장소(localStorage) 읽기·쓰기 (spec/02 2-4, design.md 7절, P164–P167).
// 어떤 값이 들어 있어도 앱이 멈추지 않게 한다 (NFR-05, EX-11). 불러오기는 읽기만 하고,
// 문제가 있었으면 2-5에서 "원본 백업 → 고친 목록 저장 → 안내 한 번"을 한다 (P167 A안).

export const STORAGE_KEY = 'lab-achievements:items' // 성과 목록
export const BACKUP_KEY = 'lab-achievements:backup' // 문제가 있던 원본을 덮어쓰기 전에 옮겨 두는 곳

const TYPES: AchievementType[] = ['PAPER', 'AWARD', 'PATENT', 'CONTEST']
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// 없어도 살릴 수 있는 글자 칸 — 없거나 글자가 아니면 빈 값으로 채운다 (옛 데이터에 지도교수 칸이 없는 경우 등)
type OptionalTextKey = 'authors' | 'advisors' | 'venue' | 'doi' | 'link'
const OPTIONAL_TEXT_FIELDS: { key: OptionalTextKey; label: string }[] = [
  { key: 'authors', label: '저자' },
  { key: 'advisors', label: '지도교수' },
  { key: 'venue', label: '학회·대회' },
  { key: 'doi', label: 'DOI' },
  { key: 'link', label: '링크' },
]

// 항목 하나를 검사한 결과 — 살릴 성과(없으면 null)와 안내 문장들
type ItemCheck = { achievement: Achievement | null; notices: string[] }

// 처음 데이터 8건으로 시작 (안내 문장이 있으면 함께)
function startWithSamples(notice?: string): LoadResult {
  return { achievements: [...SAMPLE_ACHIEVEMENTS], notices: notice ? [notice] : [] }
}

// 꺼낸 값이 일반 객체인지(null·배열이 아닌) — 모르는 값(unknown)을 객체로 좁혀 칸을 읽을 수 있게
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// 정해 둔 4가지 유형인지
function isAchievementType(value: unknown): value is AchievementType {
  return TYPES.some((type) => type === value)
}

// 안내 문장에 값을 보여 주기 위한 글자 (없으면 "없음")
function show(value: unknown): string {
  return value === undefined ? '없음' : JSON.stringify(value)
}

// 항목 하나 검사: 필수 칸(번호·유형·제목·날짜)이 틀리면 빼고, 선택 칸이 없으면 빈 값으로 채워 살린다
function checkItem(item: unknown, position: number, seenIds: Set<number>): ItemCheck {
  const where = `${position}번째 항목`
  const drop = (reason: string): ItemCheck => ({ achievement: null, notices: [`${where}을 뺐어요: ${reason}`] })

  if (!isRecord(item)) return drop('성과 형식(객체)이 아니에요.')

  const { id, type, title, achievedOn } = item
  if (typeof id !== 'number' || !Number.isInteger(id) || id < 1) {
    return drop(`번호가 1 이상의 정수가 아니에요 (값: ${show(id)}).`)
  }
  if (seenIds.has(id)) return drop(`앞의 항목과 번호가 겹쳐요 (번호 ${id}).`)
  if (!isAchievementType(type)) return drop(`유형 ${show(type)}은 없는 유형이에요 (번호 ${id}).`)
  if (typeof title !== 'string' || title.trim() === '') return drop(`제목이 비어 있어요 (번호 ${id}).`)
  if (typeof achievedOn !== 'string' || !DATE_PATTERN.test(achievedOn)) {
    return drop(`날짜가 YYYY-MM-DD 형식이 아니에요 (번호 ${id}, 값: ${show(achievedOn)}).`)
  }

  // 여기부터는 살린다 — 빠지거나 형식이 다른 선택 칸만 채우고 안내
  const name = `${where}(번호 ${id})`
  const notices: string[] = []
  const text: Record<OptionalTextKey, string> = { authors: '', advisors: '', venue: '', doi: '', link: '' }
  for (const { key, label } of OPTIONAL_TEXT_FIELDS) {
    const value = item[key]
    if (typeof value === 'string') {
      text[key] = value
    } else {
      notices.push(
        value === undefined
          ? `${name}에 ${label} 칸이 없어 빈 값으로 채웠어요.`
          : `${name}의 ${label} 칸이 글자가 아니어서 빈 값으로 바꿨어요.`,
      )
    }
  }
  let isSample = false
  if (typeof item.isSample === 'boolean') {
    isSample = item.isSample
  } else {
    notices.push(`${name}에 예시 여부 칸이 없어 "실제 성과"로 채웠어요.`)
  }

  return { achievement: { id, type, title, achievedOn, ...text, isSample }, notices }
}

// 불러오기: 저장된 게 없으면 처음 데이터, 깨졌거나 목록이 아니면 처음 데이터 + 안내,
// 목록이면 항목마다 검사해 올바른 것만 남긴다. 빈 목록([])은 사용자가 다 지운 것이므로 그대로 (P164)
export function loadAchievements(): LoadResult {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return startWithSamples('저장소를 읽을 수 없어(브라우저가 막음) 처음 데이터로 시작했어요.')
  }
  if (raw === null) return startWithSamples()

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return startWithSamples('저장된 값이 깨져 있어(JSON이 아님) 처음 데이터로 시작했어요.')
  }
  if (!Array.isArray(data)) {
    return startWithSamples('저장된 값이 목록 형식이 아니어서 처음 데이터로 시작했어요.')
  }

  const items: unknown[] = data // 배열인 것만 확인됐을 뿐 항목 내용은 아직 모름 — any 대신 unknown으로
  const achievements: Achievement[] = []
  const notices: string[] = []
  const seenIds = new Set<number>() // 살린 항목의 번호 — 번호 겹침 확인 (P165)
  items.forEach((item, index) => {
    const result = checkItem(item, index + 1, seenIds)
    notices.push(...result.notices)
    if (result.achievement) {
      achievements.push(result.achievement)
      seenIds.add(result.achievement.id)
    }
  })
  return { achievements, notices }
}

// 저장하기: 성공하면 true, 실패(용량 초과·브라우저가 막음)하면 false.
// 2-5에서 "저장 먼저, 성공하면 화면 반영"(EX-12)을 하려고 결과를 돌려준다
export function saveAchievements(list: Achievement[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

// 원본 백업: 문제가 있던 저장 값을 고친 목록으로 덮어쓰기 전에 백업 칸에 그대로 옮겨 둔다 (P167 A안).
// 뺀 항목도 원본은 남는다. 저장된 값이 없으면 할 일이 없으므로 true. 실패하면 false
export function backupRawData(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) localStorage.setItem(BACKUP_KEY, raw)
    return true
  } catch {
    return false
  }
}
