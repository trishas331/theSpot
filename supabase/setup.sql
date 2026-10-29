-- theSpot: create the spots table and load the 16 seed venues
create table spots (
  id bigint primary key generated always as identity,
  name text not null,
  category text not null,
  neighborhood text,
  address text,
  lat double precision not null,
  lon double precision not null,
  why_viral text
);

-- Let the app read spots with the public (anon) key. Nobody can write yet.
alter table spots enable row level security;
create policy "Anyone can read spots" on spots for select using (true);

insert into spots (name, category, neighborhood, address, lat, lon, why_viral) values
  ('Roggenart European Bakery', 'Bakery', 'Ballston', '4401 Wilson Blvd, Arlington, VA', 38.8823, -77.1115, 'Known for pastries/croissants frequently featured in DMV foodie content'),
  ('For Five Coffee Roasters', 'Cafe', 'Clarendon', '2800 Clarendon Blvd, Arlington, VA', 38.8871, -77.0947, 'Aesthetic coffee spot popular with DMV creators'),
  ('Tic-Taco', 'Restaurant', 'Arlington', '2333 Wilson Blvd, Arlington, VA', 38.8859, -77.0908, 'Getting local buzz for tacos, likely gaining traction on TikTok'),
  ('Ambar', 'Restaurant', 'Clarendon', '2901 Wilson Blvd, Arlington, VA 22201', 38.8873, -77.0953, 'Balkan small-plates concept, unlimited dining experience, popular DMV foodie spot'),
  ('Hawkers', 'Restaurant', 'Ballston', '4201 Wilson Blvd Suite 0170, Arlington, VA 22203', 38.8821, -77.1118, 'Asian street food chain, known for Roti Canai and Korean Twice Fried Wings'),
  ('Inca Social', 'Restaurant', 'Rosslyn', '1776 Wilson Blvd Unit #1, Arlington, VA 22209', 38.8957, -77.0716, 'Peruvian restaurant with ceviche/Pisco bar, vibrant decor popular for content'),
  ('Skydome Restaurant', 'Restaurant', 'Crystal City', '300 Army Navy Dr, Arlington, VA 22202', 38.8584, -77.0532, 'Rotating rooftop restaurant with 360-degree DC skyline views, one of few on East Coast'),
  ('Chiko', 'Restaurant', 'Shirlington', '4040 Campbell Ave, Arlington, VA 22206', 38.8367, -77.0999, 'Popular DC Chinese-Korean fast-casual concept, first VA location, known for Orange-ish Chicken'),
  ('Ruthie''s All-Day', 'Restaurant', 'South Arlington', '3411 5th St S, Arlington, VA 22204', 38.8603, -77.0918, 'Soul-nourishing neighborhood eatery, #1 Best Breakfast/Brunch Spot in ARLnow Readers'' Choice'),
  ('Yume Sushi', 'Restaurant', 'East Falls Church', '2121 N Westmoreland St Suite A-2, Arlington, VA 22213', 38.8814, -77.1513, 'Award-winning omakase/sushi spot, Instagram-worthy murals, Best Sushi in NoVA 4 years running'),
  ('Brooklyn Bagel Bakery', 'Bakery', 'Courthouse', '2055 Wilson Blvd, Arlington, VA 22201', 38.8913, -77.0847, 'Family-owned since 1995, New York-style bagels, Arlington institution'),
  ('Paris Baguette', 'Bakery', 'Clarendon', '3101 Wilson Blvd, Arlington, VA 22201', 38.8868, -77.0947, 'South Korea-based bakery chain, aesthetic pastries/cakes, newly opened and highly anticipated'),
  ('Tatte Bakery & Cafe', 'Bakery', 'Clarendon', '2700 Clarendon Blvd, Arlington, VA 22201', 38.8875, -77.0933, 'Boston-born bakery known for sleek interiors and tartines, a DMV favorite for aesthetic brunch content'),
  ('MidnighTreats', 'Bakery', 'Ballston', '4238 Wilson Blvd, Arlington, VA 22203', 38.8822, -77.1114, 'Vegan bakery known for giant ''monster'' size cookies, big social buzz at opening'),
  ('Bayou Bakery', 'Bakery', 'Courthouse', '1515 N Courthouse Rd, Arlington, VA 22201', 38.8905, -77.0848, 'Local Courthouse bakery known for seasonal/holiday treats and Mardi Gras events'),
  ('Whino', 'Bar', 'Ballston', '4238 Wilson Blvd Fl 2, Arlington, VA 22203', 38.8822, -77.1114, 'Trendy wine bar with gourmet burgers and an eclectic, artistic vibe popular for group content');
