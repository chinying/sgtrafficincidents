var singaporeMap;

document.addEventListener('DOMContentLoaded', function() {
  singaporeMap = new L.map('mapid').setView([1.3521, 103.8198], 12);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 17,
  }).addTo(singaporeMap);

  getTrafficInfo()

});

function getTrafficInfo() {
  var request = new Request('http://localhost:8001/traffic', {
    method: 'GET'
  });

  fetch(request).then(function(response) {
    return response.json()
  }).then(function(parsed) {
    parsed.trafficStatus["value"].forEach((e) => {
      //console.log(e.Latitude, e.Longitude)
      L.marker([e.Latitude, e.Longitude]).addTo(singaporeMap).bindPopup(e.Message);
    })
  }).catch(function(err) {
    console.log(err)
  });

}

