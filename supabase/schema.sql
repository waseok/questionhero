-- 질문 히어로 온라인 방 (Supabase SQL Editor에서 실행 후,
-- Dashboard → Database → Replication 에서 public.rooms 테이블 Realtime 활성화)

create table if not exists public.rooms (
  code text primary key check (char_length(code) = 4 and code ~ '^[0-9]{4}$'),
  game_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists rooms_updated_at_idx on public.rooms (updated_at desc);

alter table public.rooms enable row level security;

-- 파티 게임 MVP: 익명 키로 코드만 알면 읽기/쓰기 가능 (코드 공유가 곧 초대장)
create policy "rooms_select" on public.rooms for select using (true);
create policy "rooms_insert" on public.rooms for insert with check (true);
create policy "rooms_update" on public.rooms for update using (true) with check (true);

-- Realtime: SQL 에디터에서 아래가 권한 오류 나면
-- Dashboard → Database → Replication → public.rooms 를 켜 주세요.
alter publication supabase_realtime add table public.rooms;
