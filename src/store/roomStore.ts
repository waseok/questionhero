import { create } from "zustand";

export type RoomConnectionKind = "portal" | "local" | "online";
export type ConnectedUser = { clientId: string; name: string };

const STORAGE_KIND = "qh-room-kind";
const STORAGE_CODE = "qh-room-code";
const STORAGE_HOST = "qh-is-host";
const STORAGE_NAME = "qh-my-name";
const STORAGE_CLIENT = "qh-client-id";

const makeClientId = () => {
  const fromSession = sessionStorage.getItem(STORAGE_CLIENT);
  if (fromSession) return fromSession;
  const next = `u_${crypto.randomUUID().slice(0, 8)}`;
  sessionStorage.setItem(STORAGE_CLIENT, next);
  return next;
};

interface RoomState {
  kind: RoomConnectionKind;
  /** 온라인일 때만 4자리 코드 */
  roomCode: string | null;
  isHost: boolean;
  myName: string;
  myClientId: string;
  connectedUsers: ConnectedUser[];
  /** 방 만들기/입장 중 오류 메시지 */
  roomError: string | null;
  setRoomError: (msg: string | null) => void;
  setConnectedUsers: (users: ConnectedUser[]) => void;
  setMyName: (name: string) => void;
  /** 오프라인 연습: Supabase 없이 기존 단일 기기 플로우 */
  enterLocalPractice: () => void;
  /** 온라인 방 입장 후 sessionStorage에 저장 */
  enterOnlineRoom: (code: string, isHost: boolean, myName: string) => void;
  /** 포털로 복귀 + 스토리지 정리 */
  leaveToPortal: () => void;
  /** 새로고침 시 복원 */
  restoreFromSession: () => void;
}

function persistOnline(code: string, isHost: boolean, myName: string) {
  sessionStorage.setItem(STORAGE_KIND, "online");
  sessionStorage.setItem(STORAGE_CODE, code);
  sessionStorage.setItem(STORAGE_HOST, isHost ? "1" : "0");
  sessionStorage.setItem(STORAGE_NAME, myName);
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_KIND);
  sessionStorage.removeItem(STORAGE_CODE);
  sessionStorage.removeItem(STORAGE_HOST);
  sessionStorage.removeItem(STORAGE_NAME);
}

export const useRoomStore = create<RoomState>((set) => ({
  kind: "portal",
  roomCode: null,
  isHost: false,
  myName: "",
  myClientId: makeClientId(),
  connectedUsers: [],
  roomError: null,
  setRoomError: (msg) => set({ roomError: msg }),
  setConnectedUsers: (users) => set({ connectedUsers: users }),
  setMyName: (name) => {
    sessionStorage.setItem(STORAGE_NAME, name);
    set({ myName: name });
  },
  enterLocalPractice: () => {
    clearSession();
    set({ kind: "local", roomCode: null, isHost: true, connectedUsers: [], roomError: null });
  },
  enterOnlineRoom: (code, isHost, myName) => {
    persistOnline(code, isHost, myName);
    set({ kind: "online", roomCode: code, isHost, myName, roomError: null });
  },
  leaveToPortal: () => {
    clearSession();
    set({ kind: "portal", roomCode: null, isHost: false, myName: "", connectedUsers: [], roomError: null });
  },
  restoreFromSession: () => {
    const k = sessionStorage.getItem(STORAGE_KIND);
    const c = sessionStorage.getItem(STORAGE_CODE);
    const h = sessionStorage.getItem(STORAGE_HOST);
    const n = sessionStorage.getItem(STORAGE_NAME) ?? "";
    if (k === "online" && c && /^\d{4}$/.test(c)) {
      set({ kind: "online", roomCode: c, isHost: h === "1", myName: n, roomError: null });
    }
  },
}));
