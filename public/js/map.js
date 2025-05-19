var map = L.map("map").setView(
  [listing.coordinates.lat, listing.coordinates.lng],
  13
);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([listing.coordinates.lat, listing.coordinates.lng])
  .addTo(map)
  .bindPopup("You are here")
  .openPopup();


  var circle = L.circle([listing.coordinates.lat, listing.coordinates.lng], {
    fillOpacity: 0.1,
    radius: 500
}).addTo(map);
