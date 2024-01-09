export default async function getNearbyGyms(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=gym&key=AIzaSyARolGi2KoKY1iFVwhGATk_UWHp2lrMmvo`;
  let res = await fetch(url);
  let json = await res.json();
  let gyms = [];
  for (let gym in json.results) {
    gyms.push(json.results[gym]);
  }
  return gyms;
}
