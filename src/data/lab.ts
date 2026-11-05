// 연구실 기본 정보 (이름 외 나머지는 5단계에서 실제 내용으로 채움)
// 필드 이름은 기말 API 명세의 GET /api/lab에 맞추고, shortName·department·phone만 더했다.
export const LAB = {
  name: 'BigdataSystemSoftware 연구실(BSS)',
  shortName: 'BSS', // 지원 메일 제목 등 짧게 쓸 때
  department: '[학과 · 대학교]',
  location: '[연구실 위치 — 건물·호수]',
  contactEmail: 'lab@example.com',
  phone: '[전화번호]',

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
