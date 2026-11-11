# 2026 운영보고대회 · 제11회 꿈드림 졸업식 모바일 초대장

충주시청소년상담복지센터의 인쇄용 초대장을 바탕으로 제작한 모바일 웹 초대장입니다.

- 일시: 2026년 11월 19일 목요일 14:00–15:20 (대한민국 표준시)
- 장소: 충주시청소년문화의집 숨&뜰
- 주소: 충북 충주시 금봉대로 544
- 문의: 충주시학교밖청소년지원센터 043-856-7804

## 사용하기

별도 설치나 빌드가 필요 없습니다. `index.html`을 열면 미리 볼 수 있습니다.
일정 저장, 전화 연결, 지도 검색, 주소 복사, 휴대폰 기본 공유 기능이 포함되어 있습니다.
공유 기능은 게시된 웹 주소에서 작동합니다. 기본 공유를 지원하지 않는 기기에서는 링크를 복사합니다.

## GitHub Pages에 게시하기

1. GitHub에서 새 공개 저장소를 만듭니다. 예: `chungju-invitation-2026`.
2. 이 폴더 **안의 파일 전체**를 저장소 최상위에 올립니다. `index.html`이 저장소 첫 화면에 보여야 합니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**를 선택하고 **Save**를 누릅니다.
5. 게시가 완료되면 Pages에 표시되는 주소를 공유합니다. 일반적인 주소 형식은 `https://계정명.github.io/chungju-invitation-2026/`입니다.

공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 구성

- `index.html`: 초대 문구, 행사 순서, 달력, 장소 및 주최·주관 정보
- `style.css`: 휴대폰·PC 반응형 디자인
- `script.js`: 공유, 주소 복사, 한국 시간 기준 D-day 표시
- `invitation.ics`: 캘린더 일정 파일
- `location-map.png`: 원본 초대장에서 추출한 수정 약도
- `share-cover.png`: 공유 미리보기 이미지
- `.nojekyll`: 정적 파일을 그대로 게시하는 GitHub Pages 설정

날짜·장소를 바꾸는 경우 HTML, 캘린더 파일, 공유 문구와 이미지를 함께 수정합니다.
공유 미리보기 이미지의 절대 URL이 설정되어 있습니다.


## 글꼴

[Pretendard 1.3.9](https://github.com/orioncactus/pretendard)을 사용했습니다. 글꼴 파일을 함께 제공하므로 기기마다 글꼴이 달라지지 않습니다. SIL Open Font License 1.1: `OFL.txt`.

## 표지 삽화

내장 이미지 생성 도구로 제작했습니다. 제작 지시: “남색 졸업식 초대장 표지에 사용할 금박 판화풍 학사모·술·리본으로 묶은 졸업장·월계수 삽화, 투명 배경, 글자 없음.” `graduation-emblem.webp`에 포함되어 있습니다.

게시 주소: https://chadchad99.github.io/chungju-invitation-2026/
