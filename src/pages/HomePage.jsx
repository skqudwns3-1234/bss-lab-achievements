import './HomePage.css'

// ④ 지원 안내(연락 상자) 표시 스위치 — 부원 모집 기간에만 true, 기간이 끝나면 false로 바꾼다
const SHOW_RECRUIT_BOX = true

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

      {/* ===== ④ 지원 안내 시작 — 맨 위 SHOW_RECRUIT_BOX로 켜고 끔. 아예 없애려면 여기부터 ===== */}
      {/* 회색 큰 상자 — 위치·이메일은 푸터에 있으니 제목과 버튼만 (P071) */}
      {SHOW_RECRUIT_BOX && (
        <section className="home__contact" aria-label="지원 안내">
          <div className="home__contact-box">
            <div className="home-placeholder home-placeholder--contact">
              ④ 지원 안내
              <small>제목 두 줄 · 버튼 2개 (연구실 소개, 이메일 보내기)</small>
            </div>
          </div>
        </section>
      )}
      {/* ===== ④ 지원 안내 끝 — 아예 없애려면 여기까지 지우고, 맨 위 SHOW_RECRUIT_BOX 줄도 지운다 ===== */}
    </div>
  )
}
