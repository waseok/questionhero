import type { DiceColor, DiceItem } from "../types/game";

type DiceThemes = Record<DiceColor, DiceItem[][]>;

export const DICE_DATA: DiceThemes = {
  blue: [
    [{ icon: "📝", label: "칠판" }, { icon: "🛤️", label: "긴 복도" }, { icon: "🪜", label: "계단" }, { icon: "🚰", label: "세면대" }, { icon: "🤸", label: "뜀틀" }, { icon: "🧪", label: "비커" }],
    [{ icon: "🚦", label: "신호등" }, { icon: "🚏", label: "정류장" }, { icon: "🧱", label: "골목길" }, { icon: "🚗", label: "주차된 차" }, { icon: "🚸", label: "스쿨존" }, { icon: "🌉", label: "육교" }],
    [{ icon: "🍳", label: "가스레인지" }, { icon: "🛋️", label: "소파" }, { icon: "🛁", label: "욕조" }, { icon: "🛏️", label: "침대" }, { icon: "🪟", label: "창문" }, { icon: "🚪", label: "엘리베이터" }],
    [{ icon: "🏞️", label: "그네" }, { icon: "🏊", label: "수영장" }, { icon: "⛺", label: "텐트" }, { icon: "🛗", label: "에스컬레이터" }, { icon: "🛒", label: "마트 카트" }, { icon: "🎡", label: "관람차" }],
    [{ icon: "📱", label: "스마트폰" }, { icon: "💬", label: "말풍선" }, { icon: "🎮", label: "게임기" }, { icon: "▶️", label: "재생 버튼" }, { icon: "✉️", label: "편지봉투" }, { icon: "🔒", label: "자물쇠" }],
    [{ icon: "🏚️", label: "흔들리는 집" }, { icon: "🌊", label: "파도" }, { icon: "⛈️", label: "번개구름" }, { icon: "⛄", label: "눈사람" }, { icon: "⛰️", label: "산" }, { icon: "😷", label: "마스크" }],
  ],
  red: [
    [{ icon: "🚙", label: "자동차" }, { icon: "🏍️", label: "오토바이" }, { icon: "🛴", label: "킥보드" }, { icon: "🚲", label: "자전거" }, { icon: "🛼", label: "롤러스케이트" }, { icon: "⚽", label: "구르는 공" }],
    [{ icon: "🔥", label: "불꽃" }, { icon: "🔌", label: "콘센트" }, { icon: "⚡", label: "끊어진 전선" }, { icon: "☕", label: "끓는 주전자" }, { icon: "♨️", label: "난로" }, { icon: "🕯️", label: "라이터" }],
    [{ icon: "👤", label: "수상한 그림자" }, { icon: "🐕", label: "짖는 개" }, { icon: "✋", label: "미는 손바닥" }, { icon: "👥", label: "여러 사람들" }, { icon: "📦", label: "배달통" }, { icon: "🎁", label: "선물 상자" }],
    [{ icon: "🔪", label: "커터칼" }, { icon: "💥", label: "깨진 유리" }, { icon: "💊", label: "알약" }, { icon: "📐", label: "뾰족한 모서리" }, { icon: "🪴", label: "떨어지는 화분" }, { icon: "💧", label: "물웅덩이" }],
    [{ icon: "🗯️", label: "뾰족한 말풍선" }, { icon: "☠️", label: "해골 마크" }, { icon: "❓", label: "물음표 사람" }, { icon: "📺", label: "찌그러진 화면" }, { icon: "🔗", label: "체인 고리" }, { icon: "⚠️", label: "경고창" }],
    [{ icon: "🕳️", label: "열린 맨홀" }, { icon: "🚧", label: "공사 꼬깔" }, { icon: "⚡", label: "금이 간 벽" }, { icon: "🪑", label: "부서진 의자" }, { icon: "🚪", label: "닫힌 문" }, { icon: "💡", label: "꺼진 전구" }],
  ],
  yellow: [
    [{ icon: "👀", label: "폰 보는 눈" }, { icon: "🎧", label: "이어폰" }, { icon: "↪️", label: "뒤돌아보는 화살표" }, { icon: "❓", label: "멍때림" }, { icon: "👄", label: "떠드는 입" }, { icon: "⬇️", label: "바닥 보는 시선" }],
    [{ icon: "🏃", label: "달리는 사람" }, { icon: "👟", label: "점프하는 발" }, { icon: "💥", label: "쾅 부딪힘" }, { icon: "🌀", label: "팽이(회전)" }, { icon: "🧗", label: "매달린 손" }, { icon: "🍌", label: "미끄러진 발" }],
    [{ icon: "⛑️❌", label: "X표시 헬멧" }, { icon: "🛑", label: "멈춤 표지판" }, { icon: "👆", label: "뻗은 손가락" }, { icon: "🍔", label: "모르는 음식" }, { icon: "🚫", label: "출입금지선" }, { icon: "📄", label: "찢어진 종이" }],
    [{ icon: "💦", label: "젖은 손" }, { icon: "📦", label: "무거운 짐" }, { icon: "⚙️", label: "고장난 톱니" }, { icon: "⚾", label: "던지는 손" }, { icon: "🖐️", label: "한 손 운전" }, { icon: "🪢", label: "풀린 신발끈" }],
    [{ icon: "🧊", label: "얼음(굳음)" }, { icon: "😡", label: "화난 얼굴" }, { icon: "😭", label: "우는 얼굴" }, { icon: "💫", label: "뱅글뱅글 눈" }, { icon: "😴", label: "조는 얼굴" }, { icon: "🎈", label: "둥둥 뜬 풍선" }],
    [{ icon: "🪞", label: "거울(따라함)" }, { icon: "💪", label: "알통(허세)" }, { icon: "🤜", label: "부딪히는 주먹" }, { icon: "🤫", label: "쉿(비밀)" }, { icon: "😜", label: "메롱(놀림)" }, { icon: "🤝", label: "악수(내기)" }],
  ],
};

export const flattenColorItems = (color: DiceColor) => DICE_DATA[color].flat();
