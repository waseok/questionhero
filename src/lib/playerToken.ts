/** 플레이어 id → 토큼 링 색 (p1~p4 고정) */
export function playerTokenClass(playerId: string): string {
  const base = "player-token ";
  if (playerId === "p1") return base + "player-token--p1";
  if (playerId === "p2") return base + "player-token--p2";
  if (playerId === "p3") return base + "player-token--p3";
  if (playerId === "p4") return base + "player-token--p4";
  return base + "player-token--p1";
}

/** 이름 첫 글자(비어 있으면 ?) — 토큰 안 글자 */
export function playerInitial(name: string): string {
  const t = name.trim();
  if (!t) return "?";
  return t[0]!.toUpperCase();
}
