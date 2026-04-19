/**
 * 보드게임 느낌의 짧은 효과음 (Web Audio API, 별도 mp3 없음).
 * 브라우저 정책상 첫 재생은 사용자 클릭 이후에만 안정적으로 들립니다.
 */

let audioCtx: AudioContext | null = null;

/** 사용자 제스처 직후 호출해 컨텍스트를 깨웁니다. */
export function resumeGameAudio(): void {
  if (typeof window === "undefined") return;
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
  } catch {
    /* 지원 안 되는 환경은 조용히 무시 */
  }
}

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function reducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** 짧은 노이즈 + 밴드패스 = 주사위가 굴러가는/책상에 닿는 느낌 */
function playFilteredNoiseBurst(
  c: AudioContext,
  when: number,
  duration: number,
  centerHz: number,
  peakGain: number,
): void {
  const n = Math.floor(c.sampleRate * duration);
  const buf = c.createBuffer(1, n, c.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.sin(Math.PI * t) ** 1.4;
    ch[i] = (Math.random() * 2 - 1) * env;
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = centerHz;
  bp.Q.value = 0.85;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(peakGain, when + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  src.connect(bp);
  bp.connect(g);
  g.connect(c.destination);
  src.start(when);
  src.stop(when + duration + 0.02);
}

/** 짧은 톤 클릭 — UI 선택·라디오 등 */
function playToneClick(
  c: AudioContext,
  when: number,
  freq: number,
  duration: number,
  peakGain: number,
  type: OscillatorType = "triangle",
): void {
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(peakGain, when + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(when);
  osc.stop(when + duration + 0.015);
}

/** 주사위 «던짐» 직후: 여러 번 짧게 부딪히는 소리 */
export function playDiceRollStart(): void {
  const c = ctx();
  if (!c) return;
  const t0 = c.currentTime;
  const light = reducedMotion();
  const bursts = light ? 2 : 6;
  for (let i = 0; i < bursts; i++) {
    const when = t0 + i * (light ? 0.07 : 0.028) + Math.random() * 0.02;
    const hz = 500 + Math.random() * 900;
    playFilteredNoiseBurst(c, when, light ? 0.04 : 0.055, hz, light ? 0.07 : 0.11);
  }
}

/** 슬롯 돌아갈 때 아주 작은 틱 (과하지 않게) */
export function playDiceTick(): void {
  if (reducedMotion()) return;
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;
  playToneClick(c, t, 520 + Math.random() * 180, 0.022, 0.04, "square");
}

/** 면이 멈췄을 때: 세 번 떨어지는 느낌 */
export function playDiceLand(): void {
  const c = ctx();
  if (!c) return;
  const t0 = c.currentTime;
  const light = reducedMotion();
  const delays = light ? [0, 0.12] : [0, 0.09, 0.18];
  const freqs = light ? [380, 300] : [520, 400, 310];
  const gains = light ? [0.1, 0.08] : [0.11, 0.095, 0.085];
  delays.forEach((d, i) => {
    playToneClick(c, t0 + d, freqs[i]!, light ? 0.1 : 0.085, gains[i]!, "sine");
  });
}

/** 드롭다운·모드 버튼·라디오 등 일반 선택 */
export function playUiSelect(): void {
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;
  playToneClick(c, t, 660, 0.06, 0.07, "triangle");
}

/** 무작위 배정·다음 단계 등 긍정적 액션 */
export function playUiConfirm(): void {
  const c = ctx();
  if (!c) return;
  const t = c.currentTime;
  playToneClick(c, t, 523, 0.07, 0.09, "sine");
  playToneClick(c, t + 0.07, 659, 0.06, 0.065, "sine");
}
