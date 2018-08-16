const BASE_URL = "../server/backend/yelp_server.php";

class Yelp {
  static getLocalBusinesses({ lat: latitude, lng: longitude }, term = "food") {
    const config = {
      method: "POST",
      url: BASE_URL,
      data: {
        latitude,
        longitude,
        term,
        sort_by: 'distance',
        limit: 3
      }
    };

    return $.ajax(config);
  }
}

function YelpMap(response = { lat: 33.633985, lng: -117.733393 }, businesses = [{ name: "Learning Fuze", coordinates: { latitude: 33.633985, longitude: -117.733393 } }]) {
  let myLatLng = { lat: response.lat, lng: response.lng };
  const map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 1
  });
  let bounds = new google.maps.LatLngBounds();
  let infowindow = new google.maps.InfoWindow();

  for (let i = 0; i < businesses.length; i++) {
    let businessesLocation = { lat: businesses[i].coordinates.latitude, lng: businesses[i].coordinates.longitude };
    let marker = new google.maps.Marker({
      position: businessesLocation,
      map: map,
      title: businesses[i].name
    });
    bounds.extend(marker.position);
  }
  map.fitBounds(bounds);
  let listener = google.maps.event.addListener(map, "idle", function () {
    google.maps.event.removeListener(listener);
  });
}









