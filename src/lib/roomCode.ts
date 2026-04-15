/** 숫자만 남기고 최대 4자리, 부족하면 앞을 0으로 채웁니다. */
export function normalizeRoomCode(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.padStart(4, "0");
}

export function isValidRoomCode(code: string): boolean {
  return /^\d{4}$/.test(code);
}

export function randomRoomCode(): string {
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}
