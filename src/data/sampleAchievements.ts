import type { Achievement } from '../types.ts'

// 처음 데이터 8건 (spec/02 2-2, test-cases TD-A).
// 브라우저에 저장된 성과가 없을 때(처음 방문 등) 이 목록으로 시작한다. 저장된 뒤에는 이 파일이 아니라 저장소 값을 쓴다.
//
// - 위쪽 4건: 실제 성과 (isSample: false) — 내용을 고치려면 여기를 고치세요
// - 아래쪽 4건: 임시 예시 성과 (isSample: true) — 화면에 "예시" 배지가 붙는다. 실제 성과가 생기면 지우거나 바꾸세요
//
// 번호(id): 같은 날짜면 번호가 큰 것이 목록 위로 온다 (BR-10).
//   논문(6)을 우수논문상(5)보다 크게 해서 둘이 나란히, 논문이 위에 보이게 했다 (P100).
//   예시는 1~4번으로 가장 오래된 쪽.
export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  // ===== 실제 성과 4건 — 여기를 고치세요 =====
  {
    id: 8,
    type: 'CONTEST',
    title: '스마트폰 연동 택시 비상 경고·위치 전송 시스템 설계',
    achievedOn: '2026-10-11', // 응모 마감일 (P150) — 결과는 쓰지 않고 출품한 성과로만
    authors: '나병준·윤승빈·정수빈',
    advisors: '박정규·백영미',
    venue: '2026 한국산학기술학회 캡스톤디자인 경진대회',
    doi: '',
    link: '',
    isSample: false,
  },
  {
    id: 7,
    type: 'CONTEST',
    title: '온도·전류 감지 기반 전원 차단 및 플러그 자동 분리 시스템 설계',
    achievedOn: '2026-10-11',
    authors: '정수빈·나병준·윤승빈',
    advisors: '박정규·백영미',
    venue: '2026 한국산학기술학회 캡스톤디자인 경진대회',
    doi: '',
    link: '',
    isSample: false,
  },
  {
    id: 6,
    type: 'PAPER',
    title: '비대면 배달 허위 미수령 신고 억제를 위한 증거 검증 및 단계적 제재 시스템 설계',
    achievedOn: '2026-07-06', // 학회 첫날 (학회 2026.7.6~8, P150)
    authors: '심유승·나병준·정수빈·윤승빈',
    advisors: '박정규·백영미',
    venue: '2026 한국혁신산업학회·한국디지털정책학회 공동학술발표대회',
    doi: '', // 소논문이라 DOI 없음 (P149)
    link: '',
    isSample: false,
  },
  {
    id: 5,
    type: 'AWARD',
    title: '우수논문상 — 「비대면 배달 허위 미수령 신고 억제를 위한 증거 검증 및 단계적 제재 시스템 설계」',
    achievedOn: '2026-07-06', // 논문과 같은 날 — 목록에서 논문 바로 아래에 나란히
    authors: '심유승·나병준·정수빈·윤승빈',
    advisors: '박정규·백영미',
    venue: '2026 한국혁신산업학회·한국디지털정책학회 공동학술발표대회',
    doi: '',
    link: '',
    isSample: false,
  },
  // ===== 실제 성과 끝 =====

  // ===== 임시 예시 성과 4건 (isSample: true → 화면에 "예시" 배지) =====
  // 통계를 논문 3·수상 2·특허 1·공모전 2로 맞추려고 AI가 지어낸 것 (P099). 실제 사람·학회 이름은 쓰지 않음.
  // 링크는 예시 전용으로 예약된 주소(example.com). 실제 성과가 생기면 이 4건은 지우거나 바꾸세요
  {
    id: 4,
    type: 'PAPER',
    title: '대용량 로그 데이터의 실시간 처리 구조 연구',
    achievedOn: '2026-05-15',
    authors: '홍길동·김예시',
    advisors: '',
    venue: '예시 학술대회 2026',
    doi: '',
    link: 'https://example.com/paper-1',
    isSample: true,
  },
  {
    id: 3,
    type: 'PATENT',
    title: '데이터 중복 제거 장치 및 방법',
    achievedOn: '2026-04-08',
    authors: '홍길동',
    advisors: '',
    venue: '특허 출원 예시',
    doi: '',
    link: '',
    isSample: true,
  },
  {
    id: 2,
    type: 'PAPER',
    title: '분산 저장 시스템의 캐시 교체 정책 비교',
    achievedOn: '2026-03-20',
    authors: '김예시·이샘플',
    advisors: '',
    venue: '예시 학회 논문지',
    doi: '',
    link: 'https://example.com/paper-2',
    isSample: true,
  },
  {
    id: 1,
    type: 'AWARD',
    title: '교내 소프트웨어 경진대회 장려상',
    achievedOn: '2026-02-10',
    authors: '홍길동 외 2명',
    advisors: '',
    venue: '예시 대학교',
    doi: '',
    link: '',
    isSample: true,
  },
  // ===== 임시 예시 성과 끝 =====
]
