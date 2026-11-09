-- Run after setup.sql. Users can submit spots; they land here as 'pending'
-- and are reviewed before being added to the spots table.
create table submissions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  category text not null check (category in ('Bakery', 'Cafe', 'Restaurant', 'Bar', 'Other')),
  address text check (char_length(address) <= 200),
  why_viral text check (char_length(why_viral) <= 500),
  status text not null default 'pending' check (status = 'pending')
);

alter table submissions enable row level security;

create policy "Anyone can submit"
  on submissions for insert
  with check (true);
