const userLocationLat = document.getElementById('userLocationLat');
const userLocationLng = document.getElementById('userLocationLng');

const center = { lat: 6.8454, lng: 80.1038 };
const zoom = 10;

function initMap(){
    const map = new google.maps.Map(document.getElementById("map"), { center, zoom });

    // markers
    let marker = new google.maps.Marker({
      position: center,
      title: "Your Location"
    });

    map.addListener("click", (mapsMouseEvent) => {
        const clickedPosition = mapsMouseEvent.latLng.toJSON();

        userLocationLat.value = clickedPosition.lat;
        userLocationLng.value = clickedPosition.lng;

        const pos = new google.maps.LatLng(clickedPosition.lat, clickedPosition.lng);

        marker.setMap(null); // remove existing marker if there is one

        marker.position = pos;

        marker.setMap(map); //  add new marker to the map
    });

    // search box
    // markers
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
}

/*function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 6.8454, lng: 80.1038 },
    zoom: 10,
  });

  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {

    
    const pos = mapsMouseEvent.latLng.toJSON();
    console.log(pos.lat);
    console.log(pos.lng);
    //position: mapsMouseEvent.latLng,
    
    //JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
  });
}*/

/*
// Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
*/