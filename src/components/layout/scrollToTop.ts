// 지금 보고 있는 페이지의 링크(로고·메뉴)를 누르면 맨 위로 부드럽게 올린다 (P117–P119).
// 같은 주소라 React Router는 이동하지 않으므로 스크롤만 직접 올린다.
// "동작 줄이기"를 켠 사용자에게는 부드럽게 움직이지 않고 바로 올린다 — 물방울(1-8)과 같은 기준 (홈 점검 P187–P188)
export function scrollToTopIfCurrent(targetPath: string, currentPath: string) {
  if (targetPath !== currentPath) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
}
