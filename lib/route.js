// Spots near a route: distance from each spot to the nearest point on the route line.
const R = 3958.8; // Earth radius, miles

function toRad(d) {
  return (d * Math.PI) / 180;
}

// Convert lat/lon to flat x/y miles around a reference latitude (accurate for short distances).
function project(lat, lon, refLat) {
  return {
    x: R * toRad(lon) * Math.cos(toRad(refLat)),
    y: R * toRad(lat),
  };
}

// Distance in miles from point P to the segment A-B.
function pointToSegmentMiles(p, a, b) {
  const refLat = p.latitude;
  const P = project(p.latitude, p.longitude, refLat);
  const A = project(a.latitude, a.longitude, refLat);
  const B = project(b.latitude, b.longitude, refLat);
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const lenSq = dx * dx + dy * dy;
  // t = how far along A->B the closest point is, clamped to the segment (0..1)
  let t = lenSq === 0 ? 0 : ((P.x - A.x) * dx + (P.y - A.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = A.x + t * dx;
  const cy = A.y + t * dy;
  return Math.hypot(P.x - cx, P.y - cy);
}

// Distance in miles from a point to the closest part of a route (array of {latitude, longitude}).
export function distanceToRouteMiles(point, route) {
  if (route.length === 0) return Infinity;
  if (route.length === 1) return pointToSegmentMiles(point, route[0], route[0]);
  let best = Infinity;
  for (let i = 0; i < route.length - 1; i++) {
    best = Math.min(best, pointToSegmentMiles(point, route[i], route[i + 1]));
  }
  return best;
}

// Spots within maxMiles of the route, closest first. Each result gets routeDistance (miles).
export function spotsNearRoute(spots, route, maxMiles) {
  return spots
    .map((s) => ({
      ...s,
      routeDistance: distanceToRouteMiles({ latitude: s.lat, longitude: s.lon }, route),
    }))
    .filter((s) => s.routeDistance <= maxMiles)
    .sort((a, b) => a.routeDistance - b.routeDistance);
}
