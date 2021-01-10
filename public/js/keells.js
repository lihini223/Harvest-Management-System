const userLocationLat = document.getElementById('userLocationLat');
const userLocationLng = document.getElementById('userLocationLng');

const center = { lat: 6.8454, lng: 80.1038 };
const zoom = 10;

function initMap(){
    const map = new google.maps.Map(document.getElementById("map"), { center, zoom });

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