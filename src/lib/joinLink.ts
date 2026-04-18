/**
 * 포털에서 방 코드 입력칸이 미리 채워지도록 쿼리(`room`)를 붙인 초대 URL입니다.
 */
export function buildJoinGameUrl(roomCode: string): string {
  if (typeof window === "undefined") return roomCode;
  const u = new URL(window.location.href);
  u.searchParams.set("room", roomCode);
  return u.toString();
}
