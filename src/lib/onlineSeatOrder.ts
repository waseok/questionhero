import { useGameStore } from "../store/gameStore";
import type { ConnectedUser } from "../store/roomStore";

const PLAYER_IDS = ["p1", "p2", "p3", "p4"] as const;

/** Presence track() 페이로드에서 join 순서 정렬용 */
export type PresenceJoinRow = { clientId: string; name: string; onlineAt: string };

/**
 * 같은 clientId는 하나만 남기고, onlineAt 오름차순(같으면 clientId)으로 접속 순서를 만듭니다.
 * 1번째 = P1(방장 슬롯), 2번째 = P2 …
 */
export function sortConnectedByJoinOrder(rows: PresenceJoinRow[]): ConnectedUser[] {
  const uniq = new Map<string, PresenceJoinRow>();
  for (const r of rows) {
    const name = r.name.trim();
    if (!name) continue;
    uniq.set(r.clientId, { clientId: r.clientId, name, onlineAt: r.onlineAt });
  }
  return Array.from(uniq.values())
    .sort((a, b) => {
      const t = a.onlineAt.localeCompare(b.onlineAt);
      if (t !== 0) return t;
      return a.clientId.localeCompare(b.clientId);
    })
    .map(({ clientId, name }) => ({ clientId, name }));
}

/**
 * 온라인 대기(setup)일 때만, 접속 순서대로 P1~P4 이름을 덮어씁니다.
 * 빈 자리는 플레이어1 … 기본값과 동일한 규칙으로 둡니다.
 */
export function applyJoinOrderToSetupPlayers(sorted: ConnectedUser[]): void {
  useGameStore.setState((s) => {
    if (s.step !== "setup") return {};
    const nextPlayers = PLAYER_IDS.map((id, i) => ({
      id,
      name: sorted[i]?.name ?? `플레이어${i + 1}`,
    }));
    const unchanged =
      s.players.length === 4 &&
      s.players.every((p, i) => p.id === nextPlayers[i]!.id && p.name === nextPlayers[i]!.name);
    if (unchanged) return {};
    return { players: nextPlayers };
  });
}
