import type { Achievement } from '../types.ts'

// DOI 글자 규칙 (spec/03 C-3, P230–P231, design 8절).
// 팝업·목록 줄의 DOI 링크(links.ts의 doiUrl)와 폼의 DOI 불러오기(api/crossref.ts, C-4)가 같은 규칙을 쓰도록 한곳에 둔다
// (체크리스트 4절 "DOI 정리를 한곳에" — 둘이 따로 고치다 규칙이 어긋나지 않게, EX-26과 같은 이유)

// 사람들이 붙여 넣는 앞부분 — https://doi.org/, http://dx.doi.org/, doi: (대소문자 무시)
const DOI_URL_PREFIX = /^https?:\/\/(dx\.)?doi\.org\//i
const DOI_SCHEME = /^doi:\s*/i

// DOI 번호만 남기기 (BR-05, AC-13-2): ' https://doi.org/10.1038/nature14539 ' → '10.1038/nature14539'
export function normalizeDoi(input: string): string {
  return input.trim().replace(DOI_URL_PREFIX, '').replace(DOI_SCHEME, '').trim()
}

// DOI 모양인지 — "10." + 숫자 4~9자리 + "/" + 공백 없는 글자 (EX-02, design 8절 [AI 설계]).
// 모양이 아니면 C-4 화면이 Crossref에 묻지 않고 바로 형식 오류 문장을 보여 준다
export function isValidDoi(doi: string): boolean {
  return /^10\.\d{4,9}\/\S+$/.test(doi)
}

// 같은 DOI를 가진 다른 성과 찾기 (Q-C7 — 경고만, 저장은 막지 않음). 수정 중인 자기 자신(exceptId)은 뺀다.
// DOI는 대소문자를 가리지 않는 규칙이라 정리한 번호를 소문자로 비교 — 주소째 저장된 옛 값도 같은 DOI로 봄
export function findDuplicateDoi(list: Achievement[], doi: string, exceptId: number | null): Achievement | null {
  const target = normalizeDoi(doi).toLowerCase()
  if (target === '') return null
  return list.find((achievement) => achievement.id !== exceptId && normalizeDoi(achievement.doi).toLowerCase() === target) ?? null
}
