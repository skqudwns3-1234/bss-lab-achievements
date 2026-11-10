import { normalizeDoi } from './doi.ts'

// 성과의 링크·DOI를 화면에 걸기 전에 안전하게 만드는 함수 (spec/01 1-9, P182–P183, 체크리스트 4절).

// 원문 링크: http:// 또는 https:// 주소일 때만 돌려주고, 아니면 null → "원문 보기" 버튼 숨김.
// javascript:·ftp: 같은 주소나 주소가 아닌 글자를 막는다. 대문자 HTTPS도 허용
export function safeLink(url: string): string | null {
  const value = url.trim()
  if (value === '') return null
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null
  } catch {
    return null // 주소 형식이 아님
  }
}

const DOI_PREFIX = 'https://doi.org/'

// DOI 주소: 'https://doi.org/…'. 비어 있으면 null → DOI 줄 숨김.
// 사람들이 "https://doi.org/10…", "doi:10…"처럼 붙여 넣는 경우도 있어 앞부분을 떼고, 이상한 글자는 encodeURI로 안전하게
export function doiUrl(doi: string): string | null {
  // 앞의 주소·doi: 떼기는 DOI 불러오기와 같은 함수로 (C-3에서 합침, P231)
  const value = normalizeDoi(doi)
  if (value === '') return null
  try {
    return `${DOI_PREFIX}${encodeURI(value)}`
  } catch {
    // 짝이 안 맞는 특수 문자(예: '\ud800')가 있으면 encodeURI가 오류를 던진다 — 잡지 않으면 팝업을 여는 순간
    // 앱 전체가 하얗게 사라짐(홈 점검 P187에서 재현). 주소로 만들 수 없는 DOI라 줄을 숨긴다 (P188)
    return null
  }
}

// 화면에 보일 DOI 번호만: '10.1038/nature14539' (주소째·'doi:'를 붙여 저장했어도 번호만).
// doiUrl을 거치므로 비었거나 깨진 DOI면 똑같이 null → 숨김. 팝업(1-9)과 성과 목록 줄(B-1)이 같이 쓴다 (P192–P193)
export function doiLabel(doi: string): string | null {
  const link = doiUrl(doi)
  // encodeURI로 만든 글자라 decodeURI는 오류 없이 원래 글자로 되돌린다
  return link === null ? null : decodeURI(link.slice(DOI_PREFIX.length))
}
