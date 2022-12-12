'use strict';

const track = document.querySelector('.track');
const mapStructure = document.getElementById('map');


mapboxgl.accessToken = 'pk.eyJ1IjoidGhlbG1hLWRldiIsImEiOiJjbGJncnJqc2wwaXhjM29xd2liMXYzbmE4In0.c2LzFGTr8v0YUQlSfSe3mQ';

function getLocation(position) {
    const { latitude, longitude } = position.coords;
    setUpMap([-97.19318,49.81453]);
}

function errorHandler() {
    setUpMap([-97.19318,49.81453])
}

const options = {
    enableHighAccuracy: true
}

const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-97.19318,49.81453]
        },
        properties: {
          title: 'Location',
          description: 'MITT Henlow Campus'
        }
      },
    ]
};


function setUpMap(center) {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 15,
        attributionControl: false,
        Marker: false
    });

    map.addControl(new mapboxgl.NavigationControl());
    for (const feature of geojson.features) {

        const el = document.createElement('div');
        el.classList.add('marker');
         
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
                )
        .addTo(map);
    }
}

// Event listeners

track.addEventListener('click', () => { 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocation, errorHandler, options);
    } else {
        console.log('Geolocation is not supported by your browser');
    }
})