import type { Member, Professor } from '../types.ts'

// 부원 페이지 데이터 (spec/04 D-1, P242–P243). 화면에서 고치지 않는 고정 데이터 — 바뀌면 이 파일만 고친다.
// 고칠 때 실수(번호 겹침·졸업 연도·이메일 모양)는 utils/members.test.ts의 데이터 검사가 알려 준다.
//
// 개인정보 (NFR-10): 실제 부원 이름·학교 이메일은 본인 동의를 받은 경우에만 넣는다. 개인 연락처는 넣지 않는다.
// 부원은 실제 학부연구생 3명 (P257·P259, 2026-11-11) — 학교 메일 아이디가 학번이라, 사용자가 본인(나병준)과
// 두 분(윤승빈·정수빈)의 동의를 받았다고 확인함 (P260). 예시 부원 7명은 이때 지움 (실제와 섞이면 헷갈려서)

// 담당 교수 — 탭과 상관없이 페이지 맨 위에 따로, 크게 보인다 (P240·P242).
// 이름은 사용자가 정한 실제 지도교수 (성과 데이터에도 지도교수 실명으로 있음 — 학교 내부망 운영이라 허용, P150).
// 연구 분야·학교 이메일은 사용자가 교수님 이력에서 옮겨 줌 (P248). 처음엔 지어내지 않으려고 빈칸이었음(P243).
// 사진·전화·전공·학회·학력·경력·논문·학술활동은 사용자가 준 이력 원문(spec/04_professor-profile.md)을 그대로 옮김 (D-3, P251–P252).
// 논문을 더할 때는 date를 'YYYY.MM' 모양으로 — utils/members.test.ts 데이터 검사가 확인한다
export const PROFESSORS: Professor[] = [
  {
    name: '박정규',
    title: '지도교수',
    researchField: '운영체제, 인공지능&지능형 시스템, 로보틱스',
    email: 'jkpark@daejin.ac.kr',
    isSample: false,
    // public/images/ 아래 — public/members/에 두면 빌드 후 dist/members 폴더가 생겨 /members 주소와 겹치고,
    // 흔한 서버 설정에서 /members 새로고침이 403이 됨 (spec/04 점검 P268–P269)
    photoUrl: '/images/professor.jpg',
    phone: '031-539-1969',
    major: '[컴퓨터공학전공] 로보틱스',
    societies: ['한국정보처리학회', '한국컴퓨터정보학회', '한국혁신산업학회', 'IEEE Consumer Technology Society'],
    education: ['박사 · 홍익대학교 컴퓨터시스템 전공 · 2013'],
    careers: [
      { place: '창신대학교', position: '부교수', period: '2018.03~2024.08' },
      { place: '서울여자대학교', position: '초빙강의교수', period: '2017.03~2018.02' },
      { place: '울산과학기술원', position: '연구원', period: '2015.10~2017.02' },
      { place: '단국대학교', position: '조교수', period: '2014.01~2016.02' },
    ],
    papers: [
      {
        title:
          'Temporal Variability and Compositional Shifts in Natural Disaster Impacts in South Korea: An Analysis of Economic Damage and Recovery Costs (2015–2024)',
        venue: 'Sustainability',
        grade: 'SCIE',
        role: '교신저자',
        date: '2026.03',
      },
      { title: '텍스트 마이닝을 활용한 외국인 근로자 안전사고 언론 보도 방식 비교 연구', venue: '차세대융합기술학회논문지', grade: '', role: '교신저자', date: '2026.02' },
      { title: 'MARS Memory-Aware Metadata Management for Scalable Hadoop Systems', venue: 'WSEAS Transactions on Computer Research', grade: 'SCOPUS', role: '교신저자', date: '2026.02' },
      { title: 'ALEX: Adaptive Log-Embedded Extent Layer for Low-Amplification SQLite Writes on Flash Storage', venue: 'Applied Sciences', grade: 'SCIE', role: '교신저자', date: '2026.01' },
      { title: '대규모 시계열 데이터 마이그레이션을 위한 MongoDB와 InfluxDB 성능 비교 연구', venue: '사물인터넷융복합논문지', grade: '', role: '교신저자', date: '2025.12' },
      { title: 'NVMe 기반 리눅스 파일시스템(ext4, XFS, Btrfs)의 성능 비교 분석 연구', venue: '차세대융합기술학회논문지', grade: '', role: '제1저자', date: '2025.12' },
      { title: '모델 컨텍스트 프로토콜(MCP) 환경에서 퍼징 기반 보안 취약점 검출 방법', venue: '사물인터넷융복합논문지', grade: '', role: '제1저자', date: '2025.10' },
      { title: '텍스트 마이닝 기반의 2021-2025년 조선일보 안전·재난 보도의 키워드 및 네트워크 구조 분석', venue: '차세대융합기술학회논문지', grade: '', role: '교신저자', date: '2025.09' },
      { title: 'Reducing Network Congestion in SAN Environments through Dedicated FC-Based Backup Architecture', venue: 'Tehnički glasnik', grade: 'SCOPUS', role: '제1저자', date: '2025.09' },
      { title: 'Implementation of a Hydroponic Cultivation Nutrient Supply System Using IoT', venue: 'WSEAS Transactions on Computer Research', grade: 'SCOPUS', role: '교신저자', date: '2025.08' },
      { title: '디지털전환시대의 민관군 통합 사이버보안시스템 구축 필요성 연구', venue: '융합과 통섭', grade: '', role: '교신저자', date: '2025.07' },
      { title: 'Implementation of RPL Protocol Modifications to Improve IoT Communication Performance', venue: 'WSEAS Transactions on Systems', grade: 'SCOPUS', role: '교신저자', date: '2025.05' },
      { title: 'Fast Path Generation Algorithm for Mobile Robot Navigation Using Hybrid Map', venue: 'Applied Sciences', grade: 'SCIE', role: '교신저자', date: '2025.02' },
      { title: 'Real-Time Adaptive and Lightweight Anomaly Detection Based on a Chaotic System in Cyber–Physical Systems', venue: 'Electronics', grade: 'SCIE', role: '제1저자', date: '2025.02' },
      { title: '홈 오토메이션을 위한 음성 인식 시스템 구현', venue: '국제차세대융합기술학회논문지', grade: '', role: '제1저자', date: '2024.12' },
      { title: 'Performance Evaluation of Large-scale Storage Systems with iSCSI for Big Data', venue: '한국산업융합학회논문집', grade: '', role: '제1저자', date: '2024.12' },
      { title: 'Implementation of NDAS-based Large-Scale Storage Systems for Big Data', venue: '차세대융합기술학회논문지', grade: '', role: '제1저자', date: '2024.12' },
      { title: 'Implementation and Analysis of Automation using IoT Based on MQTT Protocol', venue: '차세대융합기술학회논문지', grade: '', role: '교신저자', date: '2024.10' },
      { title: 'Defect Detection of Scroll Fixed Using AI Machine Vision Inspection', venue: 'International Journal of Precision Engineering and Manufacturing', grade: 'SCIE', role: '교신저자', date: '2024.10' },
      { title: 'Thermal phenomena and size effects of Mg powder in combustion process', venue: 'PLOS ONE', grade: 'SCI', role: '교신저자', date: '2024.09' },
      { title: 'Implementation of surveillance system through face recognition using HOG algorithm', venue: 'Library Progress International', grade: 'SCOPUS', role: '제1저자', date: '2024.07' },
    ],
    activities: [
      // 원문 "공동(제1)" → 논문과 같은 표기 '제1저자'로 맞춤
      { title: 'Implementation of an Improved SAN Framework to Improve Backup Storage Performance', venue: 'AIT2025-Proceeding', grade: '', role: '제1저자', date: '2025.01' },
    ],
  },
]

// 부원 — 직위는 '박사과정' · '석사과정' · '학부연구생' 중에서 고르기를 권장 (자동 완성에 뜸, 다른 글자도 됨).
// 순서는 상관없다 — 화면은 utils/members.ts의 sortedMembers가 직위 → 연도 → 이름 순으로 정렬해 보여 준다.
// 이름은 성과의 저자 칸과 똑같이 쓰기를 권장 — P306에 부원 카드의 참여 성과는 뺐지만, 기말에 achievementsOf로 다시 붙일 때 맞아야 해서.
// 졸업생이 생기면 status: 'GRADUATED', endYear: 졸업한 해 로 바꾼다 (UT-83이 검사)
// 카드 그림(P307–P308): 사용자가 고른 그림을 public/images/avatars/에 두고 photoUrl로. 둘레 여백이 많은 그림은 photoScale로 키움
export const MEMBERS: Member[] = [
  {
    id: 1,
    name: '나병준',
    position: '학부연구생 · 랩장', // 정렬은 글자 안의 "학부"로 학부연구생 자리 (P257)
    researchField: '', // 없음 — 카드에서 숨김
    email: '20231298@daejin.ac.kr', // 본인 (푸터 연구실 연락처로도 씀, P113)
    status: 'ENROLLED',
    startYear: 2026,
    endYear: null,
    isSample: false,
    photoUrl: '/images/avatars/member-1.webp',
    photoScale: 1.25,
  },
  {
    id: 2,
    name: '윤승빈',
    position: '학부연구생',
    researchField: '',
    email: '20221355@daejin.ac.kr', // 본인 동의 (P260)
    status: 'ENROLLED',
    startYear: 2026,
    endYear: null,
    isSample: false,
    photoUrl: '/images/avatars/member-2.jpg',
    photoScale: 1.7,
  },
  {
    id: 3,
    name: '정수빈',
    position: '학부연구생',
    researchField: '',
    email: '20240841@daejin.ac.kr', // 본인 동의 (P260)
    status: 'ENROLLED',
    startYear: 2026,
    endYear: null,
    isSample: false,
    photoUrl: '/images/avatars/member-3.png',
    photoScale: 1.12,
  },
]

// 숨은 부원 (이스터에그, P310–P311) — 지금은 부원이 아닌 예전 랩장. 헤더 로고를 2초 안에 5번 누르면 팝업으로 뜬다.
// MEMBERS 밖에 따로 둬서 재학/졸업 탭·인원 수·연구실 소개 재학 부원 수에 섞이지 않는다.
// status는 'ENROLLED' — 졸업(GRADUATED)이면 카드 직위가 "학부연구생 졸업"으로 바뀌는데, 졸업이 아니라 그만둔 것이라 적힌 직위 그대로 보이게.
// 기간은 endYear로 "2025 – 2026". 학교 메일은 사용자가 본인 동의를 받았다고 확인함 (P310)
export const HIDDEN_MEMBER: Member = {
  id: 101,
  name: '심유승',
  position: '학부연구생 · 전 랩장',
  researchField: '',
  email: '20231293@daejin.ac.kr',
  status: 'ENROLLED',
  startYear: 2025,
  endYear: 2026,
  isSample: false,
}

// 명예 부원 (이스터에그 2, P313–P314) — 홈 첫 화면의 큰 물방울을 2초 안에 3번 누르면 물방울이 터지며 팝업으로 뜬다.
// 사용자 친구(유명 정치인과 이름이 같은 동명이인). 사진은 쓰지 않고 첫 글자 동그라미 — 처음 받은 사진이 동명의 정치인 보도 사진이라
// 실제 공인을 명예 부원처럼 보이게 하고 저작권·초상권도 걸려서 뺌 (P313–P314). 메일 대신 "비밀" 글자 (사용자 요청)
export const HONORARY_MEMBER: Member = {
  id: 102,
  name: '홍준표',
  position: '명예 부원',
  researchField: '',
  email: '',
  status: 'ENROLLED',
  startYear: 2025,
  endYear: null,
  isSample: false,
  contactNote: '비밀',
}
