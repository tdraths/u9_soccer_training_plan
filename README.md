# U9 Soccer Coaching Plan

32-week coaching plan for Under 9 soccer. 1-hour sessions, 14–24 players.
Built with Vite + React. Edits persist to localStorage per device.

---

## Deploy to Vercel (5 minutes, free)

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```
Follow the prompts. You'll get a URL like `u9-soccer-plan.vercel.app`.

### Option B — GitHub + Vercel dashboard

1. Push to GitHub:
   ```bash
   git init && git add . && git commit -m "Initial"
   gh repo create u9-soccer-plan --public --push
   ```
2. Go to vercel.com → Add New Project → import the repo
3. Vercel auto-detects Vite → Deploy

---

## Local dev

```bash
npm install
npm run dev
```

---

## Adding Supabase later (shared edits across all coaches)

1. Create a Supabase project at supabase.com

2. Run this SQL:
   ```sql
   create table week_overrides (
     id text primary key,
     rotation int not null,
     week int not null,
     data jsonb not null,
     updated_at timestamptz default now()
   );
   alter table week_overrides enable row level security;
   create policy "Public read/write" on week_overrides for all using (true);
   ```

3. Add to .env.local:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In src/hooks/useStorage.js, replace the lsGet/lsSet calls with Supabase
   client calls. The hook signature stays identical — no component changes needed.

---

## Structure

```
src/
  data/data.js          — 32 weeks + drill library
  lib/diagrams.jsx      — SVG pitch diagrams
  hooks/useStorage.js   — persistence (localStorage now, Supabase later)
  components/
    WeekGrid.jsx        — the card grid
    SessionModal.jsx    — week detail + edit mode
    DrillPicker.jsx     — swap-a-drill bottom sheet
  App.jsx               — state + layout
```
