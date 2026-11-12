// 연구실 소개 페이지(/about)에서 쓰는 작은 계산 (spec/05)

// 연구실 정보 목록의 숫자 글자 — 0이면 "아직 없음", 아니면 "3명"·"12건" (E-1, P273 사용자 결정)
// "0건"보다 덜 비어 보이고, 예시 성과만 있을 때(실제 성과 0)도 맞는 말이라서
export function countText(count: number, unit: string): string {
  if (!Number.isFinite(count) || count <= 0) return '아직 없음'
  return `${Math.floor(count)}${unit}`
}

// 카카오맵 검색 결과로 바로 여는 주소 (E-2, P279) — 카카오가 공개한 "검색 결과 열기" 주소라 앱 키가 필요 없다.
// 검색어는 encodeURIComponent로 바꿔 /·#·& 같은 글자가 주소를 깨지 않게 (오류를 던지지 않는 함수, EX-33). 비면 null → 링크 없음
export function mapSearchUrl(query: string): string | null {
  const text = query.trim()
  if (text === '') return null
  return `https://map.kakao.com/link/search/${encodeURIComponent(text)}`
}
