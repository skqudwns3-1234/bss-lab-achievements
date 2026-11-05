import './HomePage.css'

// 홈 뼈대 (spec/01_home.md 1-1). 구역 4개의 자리만 잡고, 내용은 1-2부터 채운다.
export default function HomePage() {
  return (
    <div className="home">
      {/* ① 첫 화면: NEW 알약, 큰 제목, 설명, 버튼 2개, 통계 4칸 (+ D4 물방울 배경) */}
      <section className="home__hero" aria-label="첫 화면">
        <div className="home-placeholder home-placeholder--hero">
          ① 첫 화면
          <small>NEW 알약 · 큰 제목 · 설명 · 버튼 2개 · 통계 4칸</small>
        </div>
      </section>

      {/* ② 연구 분야: RESEARCH AREAS, 분야 칸들 */}
      <section className="home__section" aria-label="연구 분야">
        <div className="home-placeholder home-placeholder--research">
          ② 연구 분야
          <small>RESEARCH AREAS · 번호 · 분야 이름 · 설명</small>
        </div>
      </section>

      {/* ③ 최근 성과: RECENT ACHIEVEMENTS, 카드 4장 */}
      <section className="home__section" aria-label="최근 성과">
        <div className="home-placeholder home-placeholder--recent">
          ③ 최근 성과
          <small>RECENT ACHIEVEMENTS · 전체 성과 보기 · 카드 4장</small>
        </div>
      </section>

      {/* ④ 연락 상자: 회색 큰 상자 — 정보는 푸터에 있으니 제목과 버튼만 (P071) */}
      <section className="home__contact" aria-label="연락">
        <div className="home__contact-box">
          <div className="home-placeholder home-placeholder--contact">
            ④ 연락 상자
            <small>제목 두 줄 · 버튼 2개 (연구실 소개, 이메일 보내기)</small>
          </div>
        </div>
      </section>
    </div>
  )
}
