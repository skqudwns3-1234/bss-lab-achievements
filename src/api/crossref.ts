import type { AchievementInput } from '../types.ts'
import { isValidYmd } from '../utils/date.ts'
import { doiUrl } from '../utils/links.ts'

// Crossref 연동 — DOI로 논문 정보 불러오기 (spec/03 C-3, P230–P231, design 8절, FR-13).
// 외부 Open API 필수 요건. 브라우저에서 바로 불러도 되는지(CORS)는 P219에 확인함 (TC-40).
// 이 파일은 "묻고 받은 값을 폼 모양으로 바꾸기"만 한다. DOI 정리·모양 검사는 utils/doi.ts,
// 버튼·상태 문장·10초 시간 초과는 C-4 화면(DoiLookup)이 맡는다.

// 불러온 값 — 폼 값 중 Crossref가 채우는 5칸 (유형·지도교수·DOI는 폼에 있던 그대로)
export type CrossrefWork = Pick<AchievementInput, 'title' | 'authors' | 'venue' | 'achievedOn' | 'link'>

// 결과 묶음 — 오류를 던지지 않고 경우를 값으로 돌려준다 (사용자 결정 ②, P230).
// 화면은 ok로 먼저 나누고, 실패면 reason으로 문장을 고른다 — TypeScript가 빠진 경우를 잡아 줌
export type CrossrefResult =
  | { ok: true; work: CrossrefWork }
  | { ok: false; reason: 'not-found' | 'failed' | 'aborted' } // 없는 DOI(EX-03) / 그 밖의 실패(EX-04) / 취소됨

const API_URL = 'https://api.crossref.org/works/'

// Crossref에 DOI 하나를 묻는다. doi는 이미 normalizeDoi·isValidDoi를 거친 번호 (C-4가 먼저 확인).
// signal: 화면이 보내는 취소 신호 — 화면을 떠나거나 10초가 지나면 C-4가 취소한다 (사용자 결정 ③).
// 이메일(mailto)은 붙이지 않는다 — 개인 정보를 외부로 보내지 않는 규칙 (P230)
export async function fetchCrossrefWork(doi: string, signal?: AbortSignal): Promise<CrossrefResult> {
  let response: Response
  try {
    // 주소 만들기도 try 안 — 짝 없는 특수 문자면 encodeURIComponent가 오류를 던져서 (UT-60과 같은 경우).
    // encodeURIComponent: DOI의 "/"·"<"·";" 같은 글자를 주소에 넣어도 되는 모양(%2F 등)으로 바꿈
    response = await fetch(`${API_URL}${encodeURIComponent(doi)}`, { signal })
  } catch {
    // 취소 신호로 멈췄으면 aborted, 아니면 인터넷 끊김 등 (EX-04)
    return { ok: false, reason: signal?.aborted ? 'aborted' : 'failed' }
  }
  if (response.status === 404) return { ok: false, reason: 'not-found' } // Crossref에 없는 DOI (EX-03)
  if (!response.ok) return { ok: false, reason: 'failed' } // 500·429(요청이 너무 많음) 등

  let body: unknown
  try {
    body = await response.json()
  } catch {
    return { ok: false, reason: signal?.aborted ? 'aborted' : 'failed' } // 깨진 JSON, 읽는 도중 취소
  }
  const work = toCrossrefWork(body, doi)
  return work ? { ok: true, work } : { ok: false, reason: 'failed' } // 모양이 다른 응답
}

// ── 응답 → 폼 값 (design 8절, EX-05) ──
// 응답은 밖에서 온 값이라 모양을 믿지 않는다(unknown). 객체·배열·글자인지 하나씩 확인하며 필요한 칸만 꺼내고,
// 없거나 모양이 다른 칸은 빈칸 — any를 쓰지 않는다 (NFR-01)

// 응답 전체에서 message를 꺼내 5칸으로. message가 객체가 아니면 응답 전체를 믿을 수 없어 null
function toCrossrefWork(body: unknown, doi: string): CrossrefWork | null {
  if (!isRecord(body) || !isRecord(body.message)) return null
  const message = body.message
  return {
    title: cleanText(firstString(message.title)),
    authors: joinAuthors(message.author),
    venue: cleanText(firstString(message['container-title'])),
    achievedOn: issuedDate(message.issued),
    // 링크는 응답의 URL(http://dx.doi.org/… 로 오기도 함) 대신 직접 — 늘 https://doi.org/…, 팝업 링크와 같은 모양 (사용자 결정 ⑥)
    link: doiUrl(doi) ?? '',
  }
}

// 이름표가 붙은 값 묶음(객체)인지 — 배열·null은 아님
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// ['제목'] 모양의 첫 글자. Crossref는 제목·학술지를 배열로 준다
function firstString(value: unknown): string {
  return Array.isArray(value) && typeof value[0] === 'string' ? value[0] : ''
}

// 제목·학술지 다듬기 (사용자 결정 ④, 새 EX 후보) — 실제 Crossref 제목에 <i>E. coli</i>, &amp; 가 종종 있다.
// React는 태그를 글자 그대로 보여 주므로 그대로 두면 목록·팝업에 "<i>"가 보임.
// 순서: ① 태그 지우기 → ② 표기 되돌리기 → ③ 공백 하나로.
// 태그를 먼저 지워야 원래 글자였던 "&lt;b&gt;"가 "<b>"로 바뀐 뒤 태그로 오해받아 지워지지 않는다
function cleanText(text: string): string {
  return decodeEntities(text.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim()
}

// 자주 쓰는 표기: &amp; &lt; &gt; &quot; &#39; &apos; + 숫자 표기(&#8211; &#x2013;)
const NAMED_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === '#') {
      const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      // 글자 번호로 만들 수 없는 값(너무 큼 등)이면 원래 표기를 그대로 둔다
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : whole
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? whole // 모르는 이름이면 그대로
  })
}

// 저자는 처음 3명까지만 넣고 나머지는 " 외 N명" (C-4 사용자 결정 P235) — 진짜 Crossref 확인에서
// 저자 1012명 논문(중력파 관측)이 나와 모두 넣으면 저자 칸·목록 줄·팝업에 수천 글자가 들어가서 (EX-24)
const MAX_AUTHORS = 3

// 저자 목록: 사람은 "given family"(given이 없으면 family만), 단체는 name → ", "로 이음 (Q-C5)
function joinAuthors(value: unknown): string {
  if (!Array.isArray(value)) return ''
  const names = value.map((author: unknown) => {
    if (!isRecord(author)) return ''
    const given = typeof author.given === 'string' ? author.given : ''
    const family = typeof author.family === 'string' ? author.family : ''
    const person = `${given} ${family}`.replace(/\s+/g, ' ').trim()
    if (person !== '') return person
    return typeof author.name === 'string' ? author.name.replace(/\s+/g, ' ').trim() : ''
  })
  const valid = names.filter((name) => name !== '')
  if (valid.length <= MAX_AUTHORS) return valid.join(', ')
  return `${valid.slice(0, MAX_AUTHORS).join(', ')} 외 ${valid.length - MAX_AUTHORS}명`
}

// 날짜: issued.date-parts[0] = [연, 월?, 일?] → 'YYYY-MM-DD', 빠진 월·일은 01 (EX-05, 사용자 결정 ⑤ — issued만).
// 실제 없는 날짜([2015, 2, 30])·[[null]]·issued 없음이면 빈칸 → 사용자가 달력으로 고르고, 저장할 때 검사가 잡음
function issuedDate(issued: unknown): string {
  if (!isRecord(issued) || !Array.isArray(issued['date-parts'])) return ''
  const parts: unknown = issued['date-parts'][0]
  if (!Array.isArray(parts)) return ''
  const [year, month = 1, day = 1] = parts
  if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') return ''
  const ymd = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return isValidYmd(ymd) ? ymd : ''
}
