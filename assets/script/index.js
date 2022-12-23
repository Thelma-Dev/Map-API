'use strict';

// Utility functions
function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function select(selector, parent = document) {
    return parent.querySelector(selector);
}

const track = select('.track');
const mapStructure = document.getElementById('map');

let fadeElements = document.querySelectorAll('.scrollFade');

function scrollFade() {
	let viewportBottom = window.scrollY + window.innerHeight;

	for (let i = 0; i < fadeElements.length; i++) {
		let fadeElement = fadeElements[i];
		let rect = fadeElement.getBoundingClientRect();

		let elementFourth = rect.height/4;
		let fadeIn = window.innerHeight - elementFourth;
		let fadeOut = -(rect.height/2);

		if (rect.top <= fadeIn) {
			fadeElement.classList.add('is-visible');
			fadeElement.classList.remove('scrollFade-hidden');
		} else {
			fadeElement.classList.remove('is-visible');
			fadeElement.classList.add('scrollFade-hidden');
		}

		if (rect.top <= fadeOut) {
			fadeElement.classList.remove('is-visible');
			fadeElement.classList.add('scrollFade-hidden');
		}
	}
}

document.addEventListener('scroll', scrollFade);
window.addEventListener('resize', scrollFade);
document.addEventListener('DOMContentLoaded', () => {
    scrollFade();
});

mapboxgl.accessToken = 'pk.eyJ1IjoidGhlbG1hLWRldiIsImEiOiJjbGJncnJqc2wwaXhjM29xd2liMXYzbmE4In0.c2LzFGTr8v0YUQlSfSe3mQ';

function getLocation(position) {
    const { latitude, longitude } = position.coords;
    setUpMap([longitude,latitude]);
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
        Marker: false,
        pitch: 50,
    });

    map.addControl(new mapboxgl.NavigationControl());
    for (const feature of geojson.features) {

        const marker = new mapboxgl.Marker({
            color: '#3898ff'
        })
         
        new mapboxgl.Marker(marker)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
                )
        .addTo(map);
    }

    map.dragPan.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
}


// Event listeners

onEvent('click', track, () => { 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocation, errorHandler, options);
    } else {
        console.log('Geolocation is not supported by your browser');
    }
})