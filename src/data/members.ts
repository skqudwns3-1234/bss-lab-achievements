import type { Member, Professor } from '../types.ts'

// 부원 페이지 데이터 (spec/04 D-1, P242–P243). 화면에서 고치지 않는 고정 데이터 — 바뀌면 이 파일만 고친다.
// 고칠 때 실수(번호 겹침·졸업 연도·이메일 모양)는 utils/members.test.ts의 데이터 검사가 알려 준다.
//
// 개인정보 (NFR-10): 실제 부원 이름·학교 이메일은 본인 동의를 받은 경우에만 넣는다. 학번·개인 연락처는 넣지 않는다.
// 지금 부원은 모두 지어낸 예시(isSample: true → "예시" 배지, 이메일은 예시 전용 도메인 example.com) —
// 실제 데이터(기간 포함)는 사용자가 나중에 직접 넣기로 함 (Q-D1·D2, P240)

// 담당 교수 — 탭과 상관없이 페이지 맨 위에 따로, 크게 보인다 (P240·P242).
// 이름은 사용자가 정한 실제 지도교수 (성과 데이터에도 지도교수 실명으로 있음 — 학교 내부망 운영이라 허용, P150).
// 연구 분야·학교 이메일은 사용자가 교수님 이력에서 옮겨 줌 (P248). 처음엔 지어내지 않으려고 빈칸이었음(P243)
export const PROFESSORS: Professor[] = [
  {
    name: '박정규',
    title: '지도교수',
    researchField: '운영체제, 인공지능&지능형 시스템, 로보틱스',
    email: 'jkpark@daejin.ac.kr',
    isSample: false,
  },
]

// 부원 — 직위는 '박사과정' · '석사과정' · '학부연구생' 중에서 고르기를 권장 (자동 완성에 뜸, 다른 글자도 됨).
// 순서는 상관없다 — 화면은 utils/members.ts의 sortedMembers가 직위 → 연도 → 이름 순으로 정렬해 보여 준다.
// 같은 직위·같은 해(이도윤·박서준, 최유진·오세린)는 정렬 규칙 확인용으로 일부러 넣음
export const MEMBERS: Member[] = [
  {
    id: 1,
    name: '김하늘',
    position: '박사과정',
    researchField: '온디바이스 음성 인식, 모델 경량화',
    email: 'haneul@example.com',
    status: 'ENROLLED',
    startYear: 2023,
    endYear: null,
    isSample: true,
  },
  {
    id: 2,
    name: '이도윤',
    position: '석사과정',
    researchField: '저자원 언어 음성 데이터셋',
    email: 'doyun@example.com',
    status: 'ENROLLED',
    startYear: 2024,
    endYear: null,
    isSample: true,
  },
  {
    id: 3,
    name: '박서준',
    position: '석사과정',
    researchField: '연합학습, 의료 영상 분류',
    email: 'seojun@example.com',
    status: 'ENROLLED',
    startYear: 2024,
    endYear: null,
    isSample: true,
  },
  {
    id: 4,
    name: '정민서',
    position: '학부연구생',
    researchField: '웹 서비스 개발, 데이터 시각화',
    email: 'minseo@example.com',
    status: 'ENROLLED',
    startYear: 2025,
    endYear: null,
    isSample: true,
  },
  {
    id: 5,
    name: '최유진',
    position: '석사과정',
    researchField: '센서 데이터 이상 탐지',
    email: 'yujin@example.com',
    status: 'GRADUATED',
    startYear: 2022,
    endYear: 2026,
    isSample: true,
  },
  {
    id: 6,
    name: '오세린',
    position: '석사과정',
    researchField: '추천 시스템, 로그 분석',
    email: 'serin@example.com',
    status: 'GRADUATED',
    startYear: 2021,
    endYear: 2026,
    isSample: true,
  },
  {
    id: 7,
    name: '한지우',
    position: '학부연구생',
    researchField: '공공데이터 분석',
    email: 'jiwoo@example.com',
    status: 'GRADUATED',
    startYear: 2023,
    endYear: 2025,
    isSample: true,
  },
]
