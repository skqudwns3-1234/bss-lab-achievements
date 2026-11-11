import { Link } from 'react-router'
import ResearchAreaList from '../components/home/ResearchAreaList.tsx'
import { useAchievements } from '../context/useAchievements.ts'
import { LAB } from '../data/lab.ts'
import { MEMBERS, PROFESSORS } from '../data/members.ts'
import { countText } from '../utils/lab.ts'
import { countByStatus } from '../utils/members.ts'
import './AboutPage.css'

// 연구실 정보 한 줄 — to가 있으면 줄 전체가 링크
type GlanceItem = {
  label: string
  value: string
  to?: string
}

// 연구실 소개 (spec/05, FR-16). 시안이 없어 지금 사이트 모양(꾸밈 글씨 + 큰 제목, 흰 칸)을 따름.
// 화면에서 사용자가 바꾸는 값이 없어 상태(useState)가 없다. 성과 수만 전역 상태에서 읽음 —
// 관리 모드로 성과를 등록하면 전역 상태가 바뀌어 이 페이지도 다시 그려지고 숫자가 저절로 늘어난다(useEffect 필요 없음).
// 세기는 가볍고 이 페이지는 거의 다시 그려지지 않아 useMemo도 안 씀 (Q-D6과 같은 이유)
export default function AboutPage() {
  const { achievements } = useAchievements()

  // 소개 문단 — 빈 줄은 빼고 (다 비면 풀 네임 줄만)
  const paragraphs = LAB.about.map((paragraph) => paragraph.trim()).filter((paragraph) => paragraph !== '')

  // 연구실 정보 목록 — 값이 없는 줄은 빼고 그림 (E-1 P273, 모양은 P276 B안)
  const professorNames = PROFESSORS.map((professor) => professor.name.trim()).filter((name) => name !== '')
  const enrolledCount = countByStatus(MEMBERS).ENROLLED // 부원 페이지 "재학" 탭 숫자와 같은 함수
  const realCount = achievements.filter((achievement) => !achievement.isSample).length // 홈 통계와 같은 기준(예시 빼고, BR-20)
  const glance: GlanceItem[] = []
  if (LAB.department.trim() !== '') glance.push({ label: '소속', value: LAB.department.trim() })
  if (professorNames.length > 0) {
    glance.push({ label: '지도교수', value: professorNames.map((name) => `${name} 교수`).join(' · '), to: '/members' })
  }
  glance.push({ label: '재학 부원', value: countText(enrolledCount, '명'), to: '/members' })
  glance.push({ label: '등록된 성과', value: countText(realCount, '건'), to: '/achievements' })

  return (
    <section className="about-page" aria-labelledby="about-title">
      <div className="about-page__head">
        <p className="eyebrow">ABOUT</p>
        <h1 id="about-title" className="page-title">
          연구실 소개
        </h1>
      </div>

      {/* 소개 글 + 연구실 정보 목록을 한 묶음으로 (P276 B안 — "AT A GLANCE" 칸이 글과 따로 떠 보인다는 사용자 의견 P275).
          900px 이상은 왼쪽 글 : 오른쪽 목록, 좁으면 글 아래 목록 */}
      <div className="about-page__overview">
        {/* 소개 — 첫 줄은 BSS 풀 네임(다른 곳은 "BSS 연구실"로 짧게 쓰므로 여기서 풀어 줌, P109·P122), 그 아래 lab.ts의 소개 문단 */}
        <div className="about-page__intro">
          <p className="about-page__lead">
            {LAB.shortName}는 <strong>{LAB.fullName}</strong>({LAB.koreanName})의 줄임말입니다.
          </p>
          {paragraphs.map((paragraph, index) => (
            // 같은 문장이 두 번 있어도 key가 겹치지 않게 순서를 붙임
            <p key={`${index}-${paragraph}`} className="about-page__paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 연구실 정보 — 이름표 왼쪽, 값 오른쪽 줄 목록. 지도교수·재학 부원은 /members, 성과는 /achievements (E-1 P273).
            보이는 제목은 없고(P276), 화면 낭독기로 구역을 찾을 수 있게 숨은 제목만 */}
        <section className="about-facts" aria-labelledby="about-facts-title">
          <h2 id="about-facts-title" className="visually-hidden">
            연구실 정보
          </h2>
          <ul className="about-facts__list">
            {glance.map((item) => (
              <li key={item.label} className="about-facts__item">
                {item.to ? (
                  <Link to={item.to} className="about-facts__row about-facts__row--link">
                    {/* 이름표와 값 사이 띄어쓰기 — 화면 낭독기가 "재학 부원3명"으로 붙여 읽지 않게 */}
                    <span className="about-facts__label">{item.label}</span>{' '}
                    <span className="about-facts__value">
                      {item.value}
                      <span className="about-facts__arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </Link>
                ) : (
                  <div className="about-facts__row">
                    <span className="about-facts__label">{item.label}</span>{' '}
                    <span className="about-facts__value">{item.value}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 연구 분야 — 홈과 같은 목록. 제목은 홈과 같은 "우리가 다루는 문제"(사용자: 아직 깊게 파는 분야가 없어서, P273). 0개면 구역째 숨김 (EX-23) */}
      {LAB.researchAreas.length > 0 && (
        <section className="about-page__section" aria-labelledby="about-research-title">
          <div className="about-page__section-head">
            <p className="eyebrow">RESEARCH AREAS</p>
            <h2 id="about-research-title" className="section-title">
              우리가 다루는 문제
            </h2>
          </div>
          <ResearchAreaList areas={LAB.researchAreas} />
        </section>
      )}
    </section>
  )
}
