// 홈 첫 화면 오른쪽의 물방울 장식 (spec/01_home 1-8, 시안 Main.dc.html의 .hero-art, D4).
// 그림 파일 없이 CSS만으로 그린다. 받는 값·상태·훅 없음 — 늘 같은 모양을 보여 주기만 한다.
// 스타일은 HomePage.css의 "물방울 배경" 부분.
export default function HeroArt() {
  return (
    // 장식이라 화면 낭독기는 건너뛰고(aria-hidden), 마우스 클릭도 통과시킨다(CSS pointer-events: none)
    <div className="hero-art" aria-hidden="true">
      {/* 바닥: 옅은 점 무늬 (가장자리로 갈수록 흐려짐) */}
      <div className="hero-art__dots" />

      {/* 바닥에 비친 물방울 그림자 3개 */}
      <div className="hero-art__shadow hero-art__shadow--1" />
      <div className="hero-art__shadow hero-art__shadow--2" />
      <div className="hero-art__shadow hero-art__shadow--3" />

      {/* 물방울 4개: 큰 것(xl 380px, lg 270px)은 하이라이트 3개, 작은 것(md 96px, sm 72px)은 2개 */}
      <div className="droplet droplet--xl">
        <span className="droplet__shine" />
        <span className="droplet__dot" />
        <span className="droplet__glow" />
      </div>
      <div className="droplet droplet--sm">
        <span className="droplet__shine" />
        <span className="droplet__glow" />
      </div>
      <div className="droplet droplet--lg">
        <span className="droplet__shine" />
        <span className="droplet__dot" />
        <span className="droplet__glow" />
      </div>
      <div className="droplet droplet--md">
        <span className="droplet__shine" />
        <span className="droplet__glow" />
      </div>
    </div>
  )
}
