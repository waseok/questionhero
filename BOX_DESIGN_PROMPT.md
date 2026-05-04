# 질문히어로 — 실물 박스 디자인 프롬프트

이 문서는 **질문히어로 (나를 구해줘!)** 보드게임의 실물 패키지 디자인을 AI 이미지 생성 도구(Midjourney, DALL·E, Firefly 등) 또는 디자이너와 협업할 때 사용하는 프롬프트 모음입니다.

---

## 1. 게임 아이덴티티 요약

| 항목 | 내용 |
|------|------|
| 게임 이름 | 질문히어로 / 나를 구해줘! |
| 장르 | 협력형 SAFE 질문 보드게임 |
| 인원 | 3~4인 |
| 연령 | 초등 고학년~성인 |
| 주제 | 안전 상황 판단, 질문의 힘 |
| 핵심 오브젝트 | 3색 주사위(파랑·빨강·노랑), 질문 토큰 3종, 코인 |
| 분위기 | 따뜻하고 긴장감 있는 어드벤처 / 학교·일상 배경 |

---

## 2. 비주얼 아이덴티티

### 2-1. 톤앤매너
- **키워드**: 용기, 협력, 질문, 구출, 따뜻한 긴장감
- **레퍼런스 장르**: 클래식 유럽 보드게임(Catan, Ticket to Ride) + 일본 교육용 게임 일러스트
- **금지**: 과도한 공포·폭력적 표현, 지나치게 유아적인 캐릭터

### 2-2. 컬러 팔레트

```
박스 배경(양피지)   #EBE0D2  — 따뜻한 크림
목재 테두리         #4A3428  — 짙은 갈색
금색 장식           #E8C547  — 황금
파란 주사위 강조    #2563EB  — 장소(Place)
빨간 주사위 강조    #B91C3C  — 위협(Threat)
노란 주사위 강조    #F59E0B  — 행동(Action)
히어로 강조         #7C3AED  — 보라 (질문의 힘)
```

### 2-3. 타이포그래피 방향
- 제목: 손글씨 느낌의 굵은 서체 (한글 — 검은고딕 계열 / 영문 — Playfair Display Bold)
- 부제: 둥근 고딕 (Noto Sans KR SemiBold)
- 박스 정보(인원·시간·연령): 픽토그램 + 작은 고딕

---

## 3. 박스 앞면 디자인 프롬프트

### 3-1. 핵심 구성 요소
```
[레이아웃]
상단: 게임 로고 "질문히어로" + 부제 "나를 구해줘!"
중앙: 메인 일러스트 (아래 이미지 프롬프트 참고)
하단: 인원(3-4인) · 시간(40분) · 연령(10+) 픽토그램
좌하단: 출판사/브랜드 로고
우하단: 박스 측면 정보 유도 화살표 또는 아이콘
```

### 3-2. AI 이미지 생성 프롬프트 (영문, Midjourney·DALL·E용)

**버전 A — 학교 복도 씬 (핵심 추천)**
```
Board game box cover illustration, four diverse middle school student heroes 
standing confidently in a dramatic school hallway, holding glowing question 
mark tokens (blue, red, yellow dice floating around them), warm parchment 
and wood color palette, golden light rim, heroic composition, one student 
raising a glowing magnifying glass token, illustrated in a style between 
Studio Ghibli and classic European board game art, rich textures, deep 
shadows, cinematic framing, no text, 16:9 crop for box top --style raw --q 2
```

**버전 B — 캐릭터 집합 씬**
```
Board game cover art, four cartoon heroes (student characters) grouped 
together in defensive poses around three oversized colorful dice (blue, red, 
yellow), background shows an urban neighborhood with subtle danger symbols, 
warm golden hour lighting, thick outlines, textured parchment background, 
board game illustration style, vibrant but not garish, cooperative theme, 
no text, square format --style raw --q 2
```

**버전 C — 심볼릭 디자인 (캐릭터 없음)**
```
Board game box cover, centered composition, large glowing question mark 
emerging from three colored dice (cobalt blue, crimson red, golden yellow), 
surrounded by medieval-style decorative border with wood grain texture, 
parchment background #EBE0D2, gold metallic accents, dramatic spotlight 
lighting from above, three token badges (magnifying glass, puzzle piece, 
scale of justice) floating around, flat illustration with subtle depth, 
no characters, no text, 4:3 ratio --style raw --q 2
```

---

## 4. 박스 뒷면 디자인 프롬프트

### 4-1. 레이아웃 구조
```
┌────────────────────────────────────┐
│  [게임 소개 문구 — 2~3줄]          │
│                                    │
│  [게임 방법 요약 — 아이콘+텍스트]  │
│  1. 주사위 굴리기  2. 상황 만들기  │
│  3. 질문 토큰 배정 4. 투표·선택    │
│                                    │
│  [구성품 목록]                     │
│  • 3색 주사위 각 1개              │
│  • 질문 토큰 카드                 │
│  • 코인 칩                        │
│  • 라운드 트래커                  │
│                                    │
│  [인원/시간/연령 픽토그램]         │
│  [바코드]  [ISBN/제품번호]         │
└────────────────────────────────────┘
```

### 4-2. 게임 소개 카피 (초안)
```
위기의 순간, 올바른 질문 하나가 모두를 구할 수 있습니다.

「질문히어로」는 3색 주사위로 위험 상황을 만들고,
확인·원인·판단 질문으로 스토리텔러를 도와 문제를 해결하는
협력형 안전 교육 보드게임입니다.

당신의 질문이 히어로가 됩니다.
```

---

## 5. 박스 측면 디자인 프롬프트

### 5-1. 긴 측면 (스파인)
```
세로 배치:
- 상단: 게임 로고 세로쓰기
- 중앙: 3색 주사위 아이콘 스택
- 하단: 브랜드명
```

### 5-2. 짧은 측면
```
- 인원·시간·연령 픽토그램 세로 배치
- 바코드 또는 QR코드 (온라인 룰북 링크)
```

---

## 6. 주요 일러스트 에셋 프롬프트

### 6-1. 캐릭터 4인 세트
```
Four distinct student hero characters for a board game, 
full body standing poses, each holding a different glowing token:
- Character 1 (P1): confident leader, holding blue magnifying glass (확인 질문)
- Character 2 (P2): thoughtful girl, holding yellow puzzle piece (원인 질문)  
- Character 3 (P3): energetic boy, holding red scale/balance (판단 질문)
- Character 4 (P4): calm observer, holding golden coin
Consistent art style, warm board game illustration, thick outlines, 
diverse ethnicities, school uniform variations, parchment texture background,
individual portrait cards format, no text --style raw
```

### 6-2. 3색 주사위 세트
```
Three stylized oversized dice for board game illustration:
- Blue die with location/place icons (school, bus stop, kitchen, stove)
- Red die with threat/danger icons (fire, shadow figure, car)
- Yellow die with action/behavior icons (running person, helmet, phone eye)
Wooden texture surface, gold number pips, soft drop shadow, 
isometric 3/4 view, warm lighting from upper left, 
isolated on transparent/white background, no text --style raw
```

### 6-3. 질문 토큰 3종
```
Three circular token badge designs for a board game:
1. Blue badge: magnifying glass icon, label area at bottom (확인 질문)
2. Purple badge: interlocking puzzle pieces icon (원인 질문)
3. Gold badge: balance scale / justice scale icon (판단 질문)
Engraved metallic finish, beveled edges, parchment color center,
board game component style, top-down flat view, no text --style raw
```

---

## 7. 박스 규격 참고 (표준 미들박스 기준)

```
외부 사이즈:  297 × 210 × 60 mm  (A4 미들 박스)
인쇄 방식:    CMYK 오프셋 or 디지털
코팅:         유광 라미네이팅 (표지) + 유광 스팟 UV (로고·금색 장식)
박스 재질:    두꺼운 회색보드 (2mm 이상 권장)
내부:         인서트 트레이 (EVA 폼 or 골판지 파티션)
```

---

## 8. Figma / Adobe 작업 지시 프롬프트

디자이너에게 전달할 때 아래를 그대로 사용하세요.

```
질문히어로 보드게임 박스 패키지 디자인을 제작해 주세요.

[브리프]
- 게임: 3~4인 협력형 안전 교육 보드게임, 40분 소요
- 타깃: 초등 고학년~성인, 교육 현장/가정 모두 사용
- 톤: 따뜻하고 용감한 어드벤처 — 무섭지 않되 긴장감 있게
- 핵심 메시지: "올바른 질문이 위기를 구한다"

[디자인 요소]
- 메인 컬러: 크림(#EBE0D2), 다크브라운(#4A3428), 골드(#E8C547)
- 포인트 컬러: 블루(#2563EB), 레드(#B91C3C), 옐로우(#F59E0B)
- 3색 주사위와 질문 토큰이 반드시 박스 앞면에 등장할 것
- 게임 로고는 손글씨 느낌의 두꺼운 서체로 상단 배치
- 뒷면에는 게임 방법 4단계 요약 아이콘 포함

[산출물]
1. 박스 앞면 (297×210mm 기준 전개도 기준)
2. 박스 뒷면
3. 측면 스파인 2종
4. Mockup 렌더링 1컷 (3D 박스 투시)
5. 컬러/폰트 가이드 1페이지

[참고 레퍼런스]
- Ticket to Ride 박스 (클래식한 보드게임 레이아웃)
- Dixit 박스 (따뜻한 일러스트 톤)
- 한국 교육 보드게임 느낌 (과도한 캐릭터 상품화 지양)
```

---

## 9. 품질 체크리스트

박스 디자인 완성 전 확인사항:

- [ ] 게임 이름(질문히어로 / 나를 구해줘!)이 앞면 상단에 명확히 보이는가
- [ ] 3색 주사위(파랑·빨강·노랑)가 한눈에 구분되는가
- [ ] 인원(3-4인), 소요시간(40분), 연령(10+) 픽토그램이 있는가
- [ ] 뒷면에 게임 방법 요약이 4단계 이내로 설명되어 있는가
- [ ] 골드/목재 질감의 테두리 장식으로 보드게임 느낌이 나는가
- [ ] 어린이가 봐도 공포감이 없는 온화한 톤인가
- [ ] CMYK 인쇄 기준 색상이 보정되었는가
- [ ] 바코드·ISBN 영역이 뒷면 하단에 확보되어 있는가

---

## 10. QR코드 / 온라인 연결

박스 뒷면 또는 측면에 QR코드를 넣어 온라인 버전으로 연결할 수 있습니다.

```
QR 코드 링크 대상:
- 온라인 플레이: https://questionhero.vercel.app
- 룰북 PDF: (별도 업로드 후 연결)
- 튜토리얼 영상: (제작 후 연결)

QR 코드 디자인:
- 질문마크(?) 형태로 커스텀 QR 디자인 권장
- 배경: 크림색(#EBE0D2), 도트: 다크브라운(#4A3428)
```
