// 지금 보고 있는 페이지의 링크(로고·메뉴)를 누르면 맨 위로 부드럽게 올린다 (P117–P119).
// 같은 주소라 React Router는 이동하지 않으므로 스크롤만 직접 올린다.
export function scrollToTopIfCurrent(targetPath: string, currentPath: string) {
  if (targetPath === currentPath) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
