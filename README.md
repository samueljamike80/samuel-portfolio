# Samuel Charles — Portfolio

A responsive Next.js 14 (App Router) + Tailwind CSS portfolio, with content,
images, and admin access all backed by **Supabase** (Postgres + Storage +
Auth). Content and photos are stored server-side, so every visitor — on any
device, any browser — sees the same thing, and edits made in `/admin` go
live for everyone immediately.

## Quick start

1. Complete the **Supabase setup** below (one-time, ~10 minutes).
2. Copy `.env.example` to `.env.local` and fill in your Supabase values.
3. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000. Edit content at http://localhost:3000/admin,
signing in with the admin email/password you create during setup.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — custom design tokens in `tailwind.config.ts` (a data-science
  themed palette: deep navy/paper surfaces, a "signal" teal accent, and
  JetBrains Mono for stats/labels)
- **lucide-react** for icons
- **next/font** for Space Grotesk (display), Inter (body), JetBrains Mono (data)
- **Supabase** — Postgres (content), Storage (images), Auth (admin login)

## Supabase setup

Everything below happens once, in your own Supabase project. Nothing here
touches the app's UI — it's purely wiring up the backend.

### 1. Create a project

Go to [supabase.com](https://supabase.com), create a free project, and wait
for it to finish provisioning.

### 2. Get your API keys

In your project: **Settings → API**. Copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Paste both into a new `.env.local` file (copy `.env.example` to start).

This key is meant to be public — it's the same key your browser will use
directly. It can only do what your Row Level Security policies allow (set
up in the next step), which is: anyone can read, only a signed-in admin can
write.

### 3. Run the database schema

**SQL Editor → New query**, paste in the entire contents of
[`supabase/schema.sql`](./supabase/schema.sql), and click **Run**.

This one file:
- Creates the `site_content` table (one row holding all your content as JSON)
- Sets up Row Level Security so writes require being signed in
- Seeds that row with the same content as `data/site-content.json`, so the
  site has real content from the start
- Sets up Storage policies for the image bucket (created in the next step)

### 4. Create the image storage bucket

**Storage → New bucket**:
- Name: `portfolio-media` (must match exactly — this is hardcoded in
  `lib/supabase-client.ts`)
- Public bucket: **ON** (so photos load directly in `<img>` tags with no
  auth required to view them)

The read/write policies for this bucket were already created by
`schema.sql` in step 3.

### 5. Create your admin account

**Authentication → Users → Add user**. Set an email and password — this is
the one account that can edit the site. Put that same email into
`NEXT_PUBLIC_ADMIN_EMAIL` in `.env.local`.

Then, **strongly recommended**: go to **Authentication → Sign In / Providers**
(Supabase's UI for this has moved around across versions — look for a
setting named something like *"Allow new users to sign up"*) and turn it
**off**. This site only ever needs the one account you just made by hand;
disabling public sign-up means nobody else can create their own account and
pass the "signed in" check that the RLS policies use to allow writes.

### 6. You're done

`npm run dev`, open `/admin`, and sign in with the email/password from step
5. The passcode field in the UI is unchanged — it's just checking your real
Supabase password now instead of a hardcoded string in the code.

## How content management works

- **Data**: one row in the `site_content` Postgres table, holding the whole
  site's content as a single JSON document — hero, about, stats, social
  links, contact info, and every list section (experience, projects, etc).
  `lib/content-context.tsx` reads/writes this row directly via
  `@supabase/supabase-js`, no custom backend API needed.
- **Images**: uploaded straight from the browser to the `portfolio-media`
  Storage bucket, downsized to a max of 1600px / JPEG quality 0.82 first to
  keep the bucket lean. The bucket returns a public URL, which is what
  actually gets stored in the content JSON — never the image bytes
  themselves.
- **Access control**: enforced by Postgres Row Level Security and Storage
  policies (see `supabase/schema.sql`), not by anything in the app's
  JavaScript. Public `SELECT` is allowed on both, so the live site and
  every visitor's browser can always read content and images with no login.
  `INSERT`/`UPDATE`/`DELETE` require being signed in as the one admin
  account — enforced by Supabase's servers, so it can't be bypassed by
  editing client code or calling the API directly.
- **Export / Import JSON** in `/admin` remain available as a backup/restore
  convenience — Export downloads the current database content as a file;
  Import overwrites the database with a previously exported file (requires
  being signed in, same as any other edit).
- **Reset** in `/admin` restores the database row back to the
  `data/site-content.json` seed.

None of the display components (`Hero`, `About`, `StatsBar`, `Footer`, the
section pages) talk to Supabase directly or know where the data comes from
— they all just call `useContent()`. `lib/content-context.tsx` is the only
file that knows about Supabase specifically.

## Structure

```
app/
  layout.tsx           Root layout: fonts, ThemeProvider, ContentProvider, ContentGate, Navbar, Footer
  page.tsx              Home: Hero + StatsBar + About
  experience/…honors/   One route per dropdown section, all using <SectionPage>
  contact/page.tsx      Contact page (different shape: email/location/availability)
  admin/page.tsx         Admin dashboard (Supabase-Auth-gated, tabbed editor)
components/
  navbar.tsx, hero.tsx, stats-bar.tsx, about.tsx, footer.tsx
  content-gate.tsx        Blocks rendering until content has loaded from Supabase
  section-page.tsx        Shared list/card layout for the 8 content sections
  admin/                  Admin-only editors (image upload, per-section CRUD form, singleton forms)
lib/
  types.ts               Shared TypeScript content model
  supabase-client.ts      The shared Supabase client (anon key) + admin email + table/bucket names
  content-context.tsx    All content state, reads/writes via Supabase, admin auth (signIn/signOut)
  theme-context.tsx       Light/dark mode, persisted to localStorage (unrelated to site content)
  nav.ts                  Dropdown nav items
data/
  site-content.json       Reference copy of the seed content (also embedded in supabase/schema.sql)
supabase/
  schema.sql              One-time setup: table, RLS policies, storage policies, seed data
```

## Theming

Light/dark toggle lives in the navbar and persists via `localStorage`
(`lib/theme-context.tsx`) — this is just a per-browser UI preference, not
site content, so it's fine for it to stay local rather than in Supabase. It
also respects the OS preference on first visit. All colors are defined as
Tailwind tokens (`paper`, `ink`, `signal`, `amber`, `surface`, `border`) so
you can retheme the whole site from `tailwind.config.ts`.

## Deploying

Since all state lives in Supabase rather than on a local disk, this app
deploys cleanly to any host with no persistent filesystem — Vercel, Netlify,
Cloudflare Pages, etc. Just set the three `NEXT_PUBLIC_…` environment
variables from `.env.local` in your host's dashboard.
