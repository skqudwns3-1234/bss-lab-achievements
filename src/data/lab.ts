// 연구실 기본 정보 — 푸터·홈·소개에 쓰임. 바뀌면 여기 값만 고친다
// 필드 이름은 기말 API 명세의 GET /api/lab에 맞추고, shortName·fullName·department만 더했다.
// 전화번호는 공용 번호가 없어 넣지 않음 — 개인 휴대폰 번호는 공개하지 않는다 (P113, NFR-10)
export const LAB = {
  name: 'BigdataSystemSoftware 연구실(BSS)',
  shortName: 'BSS', // 지원 메일 제목 등 짧게 쓸 때
  fullName: 'BigdataSystemSoftware', // BSS 풀 네임 — 연구실 소개 첫머리에 쓰임
  koreanName: '빅데이터 시스템 소프트웨어', // 풀 네임의 한글 이름 (P122)
  department: '대진대학교 컴퓨터공학과',
  location: '이공학관 다동 A9-401',
  contactEmail: '20231298@daejin.ac.kr', // 공용 메일이 없어 사용자 본인 학교 메일 (P113). 공용 메일이 생기면 바꾸기

  // ===== 부원 모집 정보 — 홈 ④ 지원 안내에 쓰임. 모집할 때마다 아래 값만 고치면 된다 =====
  // 지원 안내를 홈에 보일지 말지는 pages/HomePage.tsx 맨 위 SHOW_RECRUIT_BOX로 켜고 끈다
  recruitment: {
    // 모집 기간 — 'YYYY-MM-DD' 형식으로 고치기 (지금 값은 예시)
    startDate: '2026-11-01',
    endDate: '2026-11-15',

    // 지원 안내 제목 — 원하는 문구로 고치기
    title: '[지원 안내 제목 — 여기를 고치세요]',

    // 우대사항 — 한 줄에 하나씩. 줄을 추가·삭제하면 화면의 항목 수도 따라 바뀐다
    preferred: [
      '[우대사항 1 — 여기를 고치세요]',
      '[우대사항 2 — 여기를 고치세요]',
    ],

    // 구글 폼 응답용 링크 ("보내기 → 🔗 링크"에서 복사한 주소). 편집용(/edit) 링크는 넣지 않는다
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeYjipjL1C7d_uyuTqIB0L6dDLV1dmI_NN7MmK6iKYaKNQS4Q/viewform',
  },
  // ===== 부원 모집 정보 끝 =====
}
