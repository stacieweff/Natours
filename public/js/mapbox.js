/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1Ijoid2VmZmVsbXMiLCJhIjoiY2s0OGx0cnBzMTQ5bDNkbXJ3YTNvOGxzcCJ9.KkbXHYzgJVdLU1q4SXgomw';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/weffelms/ck48mmskc4y0s1cqwikbe4oqo',
    scrollZoom: false
    // center: [-118.132986, 34.055439],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach(loc => {
    // create marker
    const el = document.createElement('div')
    el.className = 'marker'

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map)

    // add popup
    new mapboxgl.Popup({
      offset: 30
    }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`).addTo(map)

    // extend map bounds to include current location
    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  })
}
