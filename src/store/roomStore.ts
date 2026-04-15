import { create } from "zustand";

export type RoomConnectionKind = "portal" | "local" | "online";

const STORAGE_KIND = "qh-room-kind";
const STORAGE_CODE = "qh-room-code";
const STORAGE_HOST = "qh-is-host";

interface RoomState {
  kind: RoomConnectionKind;
  /** 온라인일 때만 4자리 코드 */
  roomCode: string | null;
  isHost: boolean;
  /** 방 만들기/입장 중 오류 메시지 */
  roomError: string | null;
  setRoomError: (msg: string | null) => void;
  /** 오프라인 연습: Supabase 없이 기존 단일 기기 플로우 */
  enterLocalPractice: () => void;
  /** 온라인 방 입장 후 sessionStorage에 저장 */
  enterOnlineRoom: (code: string, isHost: boolean) => void;
  /** 포털로 복귀 + 스토리지 정리 */
  leaveToPortal: () => void;
  /** 새로고침 시 복원 */
  restoreFromSession: () => void;
}

function persistOnline(code: string, isHost: boolean) {
  sessionStorage.setItem(STORAGE_KIND, "online");
  sessionStorage.setItem(STORAGE_CODE, code);
  sessionStorage.setItem(STORAGE_HOST, isHost ? "1" : "0");
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_KIND);
  sessionStorage.removeItem(STORAGE_CODE);
  sessionStorage.removeItem(STORAGE_HOST);
}

export const useRoomStore = create<RoomState>((set) => ({
  kind: "portal",
  roomCode: null,
  isHost: false,
  roomError: null,
  setRoomError: (msg) => set({ roomError: msg }),
  enterLocalPractice: () => {
    clearSession();
    set({ kind: "local", roomCode: null, isHost: true, roomError: null });
  },
  enterOnlineRoom: (code, isHost) => {
    persistOnline(code, isHost);
    set({ kind: "online", roomCode: code, isHost, roomError: null });
  },
  leaveToPortal: () => {
    clearSession();
    set({ kind: "portal", roomCode: null, isHost: false, roomError: null });
  },
  restoreFromSession: () => {
    const k = sessionStorage.getItem(STORAGE_KIND);
    const c = sessionStorage.getItem(STORAGE_CODE);
    const h = sessionStorage.getItem(STORAGE_HOST);
    if (k === "online" && c && /^\d{4}$/.test(c)) {
      set({ kind: "online", roomCode: c, isHost: h === "1", roomError: null });
    }
  },
}));
