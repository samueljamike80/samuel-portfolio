-- ============================================================================
-- Samuel Charles Portfolio — Supabase schema
-- ============================================================================
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor
-- → New query → paste this whole file → Run). See README.md for the full
-- setup walkthrough, including creating the storage bucket and admin user
-- (those two steps use the Dashboard UI, not SQL, so they're not in this
-- file).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Content table
-- ---------------------------------------------------------------------------
-- The whole site's content (hero, about, stats, social links, contact, and
-- every list section) is stored as one JSON blob in a single row. This
-- mirrors the app's existing TypeScript `SiteContent` shape exactly, so no
-- component code has to change — only where the data comes from.

create table if not exists public.site_content (
  id smallint primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

-- Row Level Security: this is what actually enforces "public visitors can
-- read, only a signed-in admin can write" — it's enforced by Postgres
-- itself, not by anything in the app's JavaScript, so it can't be bypassed
-- by calling Supabase directly with the public anon key.
alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can update site content" on public.site_content;
create policy "Authenticated users can update site content"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);

-- INSERT is only needed once, to create the row below — but included for
-- completeness / in case you ever delete and reseed the row from the app.
drop policy if exists "Authenticated users can insert site content" on public.site_content;
create policy "Authenticated users can insert site content"
  on public.site_content for insert
  to authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- 2. Seed the single content row
-- ---------------------------------------------------------------------------
-- This is the exact contents of data/site-content.json, so the site has
-- real starting content instead of an empty shell. Edit any of it afterward
-- from /admin, or re-run this INSERT (with your own JSON) to reset it.

insert into public.site_content (id, data)
values (1, '{"hero": {"name": "Samuel Charles", "role": "AI / DATA SCIENTIST", "greeting": "HI, I''M SAMUEL CHARLES", "description": "I build machine learning systems that turn messy, real-world data into decisions people can trust \u2014 from research prototypes to production pipelines.", "profileImage": "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=800&auto=format&fit=crop", "cvUrl": "/cv/samuel-charles-cv.pdf"}, "stats": [{"id": "s1", "label": "Projects Completed", "value": 42, "suffix": "+"}, {"id": "s2", "label": "Hackathons Completed", "value": 15, "suffix": "+"}, {"id": "s3", "label": "Awards Won", "value": 8, "suffix": ""}, {"id": "s4", "label": "Certifications Earned", "value": 12, "suffix": "+"}], "about": {"shortText": "Data scientist and ML engineer focused on applied AI \u2014 I like problems where the model has to survive contact with real data.", "longText": "I''m a data scientist with a background spanning statistical modeling, deep learning, and production ML infrastructure. My work sits at the intersection of research and engineering: I prototype quickly, validate rigorously, and ship systems that hold up outside the notebook. Over the past few years I''ve worked across NLP, computer vision, and forecasting problems, and I care a lot about reproducibility, clear evaluation, and building tools other engineers actually want to use. Outside of client and research work, I mentor at hackathons, write about applied ML, and contribute to open-source data tooling.", "secondaryImage": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", "infoChips": [{"id": "c1", "label": "Location", "value": "Lagos, Nigeria", "icon": "map-pin"}, {"id": "c2", "label": "Education", "value": "B.Sc. Data Science", "icon": "graduation-cap"}, {"id": "c3", "label": "Focus Areas", "value": "NLP \u00b7 MLOps \u00b7 Forecasting", "icon": "target"}, {"id": "c4", "label": "Contact", "value": "hello@samuelcharles.dev", "icon": "mail"}]}, "social": {"linkedin": "https://linkedin.com/in/samuelcharles", "github": "https://github.com/samuelcharles", "twitter": "https://x.com/samuelcharles", "instagram": "https://instagram.com/samuelcharles", "mail": "mailto:hello@samuelcharles.dev", "linktree": "https://linktr.ee/samuelcharles"}, "contact": {"email": "hello@samuelcharles.dev", "phone": "", "location": "Lagos, Nigeria (open to remote)", "availability": "Open to select freelance and full-time opportunities"}, "experience": [{"id": "e1", "title": "Machine Learning Engineer", "subtitle": "Northwind Analytics", "description": "Lead development of forecasting and anomaly-detection models used across the company''s core reporting product; own the ML platform''s training and deployment pipeline.", "date": "2024 \u2014 Present", "tags": ["Python", "PyTorch", "MLOps"], "featured": true}, {"id": "e2", "title": "Data Scientist", "subtitle": "Fieldstone AI Lab", "description": "Built NLP pipelines for document classification and information extraction, and ran A/B tests to validate model impact on downstream product metrics.", "date": "2022 \u2014 2024", "tags": ["NLP", "scikit-learn", "SQL"]}], "projects": [{"id": "p1", "title": "Cascade \u2014 Time Series Forecasting Toolkit", "subtitle": "Open Source", "description": "A lightweight Python library for probabilistic time-series forecasting with built-in backtesting and drift monitoring.", "date": "2025", "link": "https://github.com/samuelcharles/cascade", "linkLabel": "View on GitHub", "tags": ["Python", "Forecasting", "Open Source"], "featured": true}, {"id": "p2", "title": "ClauseLens", "subtitle": "Contract Analysis Assistant", "description": "An LLM-backed tool that flags risky clauses in vendor contracts and summarizes obligations for non-legal teams.", "date": "2024", "link": "https://github.com/samuelcharles/clauselens", "linkLabel": "View on GitHub", "tags": ["LLMs", "RAG", "Next.js"]}], "certifications": [{"id": "cert1", "title": "TensorFlow Developer Certificate", "subtitle": "Google", "description": "Certified in building and training neural networks with TensorFlow for computer vision, NLP, and time series tasks.", "date": "2023", "link": "#", "linkLabel": "View credential"}, {"id": "cert2", "title": "AWS Certified Machine Learning \u2013 Specialty", "subtitle": "Amazon Web Services", "description": "Validated expertise in building, training, tuning, and deploying ML models on AWS.", "date": "2023", "link": "#", "linkLabel": "View credential"}], "blog": [{"id": "b1", "title": "Why Your Forecasting Model Is Lying to You", "subtitle": "Personal Blog", "description": "A practical look at leakage and backtesting mistakes that make time-series models look better than they are.", "date": "Jun 2026", "link": "#", "linkLabel": "Read post", "tags": ["Forecasting", "MLOps"]}], "research": [{"id": "r1", "title": "Robust Drift Detection for Streaming Tabular Data", "subtitle": "Workshop Paper, DataML 2025", "description": "Proposes a lightweight statistical test for detecting covariate drift in high-throughput tabular pipelines.", "date": "2025", "link": "#", "linkLabel": "Read paper", "tags": ["Research", "Drift Detection"]}], "community": [{"id": "com1", "title": "Mentor, Lagos AI Hackathon", "subtitle": "Volunteer", "description": "Mentored five teams on model selection and evaluation strategy across a 48-hour hackathon.", "date": "2025"}], "talks": [{"id": "t1", "title": "Shipping ML Models Without Losing Sleep", "subtitle": "PyData Lagos", "description": "A talk on monitoring, rollback strategy, and on-call practices for teams running ML in production.", "date": "2025", "link": "#", "linkLabel": "Watch talk"}], "honors": [{"id": "h1", "title": "Best Applied ML Project", "subtitle": "National Data Science Challenge", "description": "Awarded first place for a fraud-detection system judged on accuracy, latency, and explainability.", "date": "2024"}]}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Storage bucket policies
-- ---------------------------------------------------------------------------
-- Create the bucket itself first, from the Dashboard (Storage → New bucket):
--   Name:   portfolio-media
--   Public: ON  (so <img> tags can load photos directly, with no auth)
--
-- Then run the policies below, which allow anyone to *read* files in this
-- bucket, but only a signed-in admin to upload/replace/delete them.

drop policy if exists "Public read access to portfolio media" on storage.objects;
create policy "Public read access to portfolio media"
  on storage.objects for select
  to public
  using (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated users can upload portfolio media" on storage.objects;
create policy "Authenticated users can upload portfolio media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated users can update portfolio media" on storage.objects;
create policy "Authenticated users can update portfolio media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated users can delete portfolio media" on storage.objects;
create policy "Authenticated users can delete portfolio media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media');

-- ---------------------------------------------------------------------------
-- 4. Admin account
-- ---------------------------------------------------------------------------
-- Not done in SQL — create this from the Dashboard instead:
--   Authentication → Users → Add user → set an email + password.
-- Put that same email in NEXT_PUBLIC_ADMIN_EMAIL in .env.local.
--
-- Also recommended: Authentication → Settings (or Providers → Email) →
-- turn OFF "Allow new users to sign up". This site only ever needs the one
-- account you just created by hand; disabling public sign-ups means nobody
-- else can register their own "authenticated" account and pass the RLS
-- checks above.
