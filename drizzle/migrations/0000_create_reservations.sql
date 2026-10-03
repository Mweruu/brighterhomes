CREATE TABLE public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service_type text not null,
  property_size text,
  preferred_date date not null,
  preferred_time text not null,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

GRANT INSERT ON public.reservations TO anon, authenticated;
GRANT ALL ON public.reservations TO service_role;

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit a reservation"
  ON public.reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);