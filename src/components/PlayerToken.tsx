import { useState } from "react";
import { playerInitial, playerTokenClass } from "../lib/playerToken";

/** `public/tokens/` 안 파일 확장자 순서대로 시도 */
const TOKEN_EXTS = ["png", "webp", "jpg", "jpeg"] as const;

type PlayerTokenSize = "md" | "lg";

const sizeClass: Record<PlayerTokenSize, string> = {
  md: "h-10 w-10 min-h-10 min-w-10",
  lg: "h-14 w-14 min-h-14 min-w-14",
};

export type PlayerTokenProps = {
  playerId: string;
  name: string;
  /** 점수판·셋업은 md, 종료 화면 강조는 lg */
  size?: PlayerTokenSize;
  className?: string;
};

/**
 * 플레이어 말: `public/tokens/p1.png` … `p4.(png|webp|jpg|jpeg)` 가 있으면 이미지로 표시.
 * 없거나 전부 실패하면 기존 그라데이션 동그라미 + 이니셜.
 */
export function PlayerToken({ playerId, name, size = "md", className = "" }: PlayerTokenProps) {
  /** 스토어 플레이어 id(p1~p4)와 파일명을 맞춤 */
  const fileIdOk = /^p[1-4]$/.test(playerId);
  const [tryIndex, setTryIndex] = useState(0);

  const failedAll = !fileIdOk || tryIndex >= TOKEN_EXTS.length;
  const ext = !failedAll ? TOKEN_EXTS[tryIndex] : null;
  const src = ext ? `/tokens/${playerId}.${ext}` : "";

  if (failedAll) {
    return (
      <span className={`${playerTokenClass(playerId)} ${className}`} title={name} aria-hidden>
        {playerInitial(name)}
      </span>
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt=""
      title={name}
      loading="lazy"
      decoding="async"
      onError={() => setTryIndex((i) => i + 1)}
      className={`player-token-img shrink-0 ${sizeClass[size]} ${className}`}
    />
  );
}
