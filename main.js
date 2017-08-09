var singaporeMap;

document.addEventListener('DOMContentLoaded', function() {
  singaporeMap = new L.map('mapid').setView([1.3521, 103.8198], 12);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 17,
  }).addTo(singaporeMap);

  getTrafficInfo()

});

var LeafIcon = L.Icon.extend({
  options: {
    iconUrl: 'images/leaf-green.png',
    shadowUrl: 'images/leaf-shadow.png',
    iconSize: new L.Point(50, 50),
    shadowSize: new L.Point(0, 0),
    iconAnchor: new L.Point(22, 94),
    popupAnchor: new L.Point(-3, -76)
  }
});

const iconsFolderPath = "assets/images/";
const roadBlockIcon = new LeafIcon({iconUrl: iconsFolderPath + "road_block.png"}),
      roadWorksIcon = new LeafIcon({iconUrl: iconsFolderPath + "roadworks.png"}),
      vehicleBreakdownIcon = new LeafIcon({iconUrl: iconsFolderPath + "vehicle_breakdown.png"}),
      accidentIcon = new LeafIcon({iconUrl: iconsFolderPath + "accident.png"}),
      heavyTrafficIcon = new LeafIcon({iconUrl: iconsFolderPath + "heavy_traffic.png"}),
      miscIcon = new LeafIcon({iconUrl: iconsFolderPath + "misc.png"});

function getTrafficInfo() {
  var request = new Request('http://localhost:8001/traffic', {
    method: 'GET'
  });

  fetch(request).then(function(response) {
    return response.json()
  }).then(function(parsed) {
    parsed.trafficStatus["value"].forEach((e) => {
      /*var icon = miscIcon;
      switch (e.Type) {
        case "Road Block":
          icon = roadBlockIcon
          break;

        case "Roadwork":
          icon = roadWorksIcon
          break;

        case "Vehicle breakdown":
          icon = vehicleBreakdownIcon
          break;

        case "Accident":
          icon = accidentIcon
          break;

        case "Heavy Traffic":
          icon = heavyTrafficIcon
          break;

        default:
          icon = miscIcon;
      }*/
      L.marker([e.Latitude, e.Longitude]).addTo(singaporeMap).bindPopup(e.Message);
    })
  }).catch(function(err) {
    console.log(err)
  });

}

// instanciate new modal
var modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ['overlay', 'button', 'escape'],
  closeLabel: "Close",
  onOpen: function() {
    console.log('modal open');
  },
  onClose: function() {
    console.log('modal closed');
  },
  beforeClose: function() {
    // here's goes some logic
    // e.g. save content before closing the modal
    return true; // close the modal
    return false; // nothing happens
  }
});
modal.setContent(document.getElementById("help_content").innerHTML)

const helpIcon = document.getElementById("help_icon");
helpIcon.addEventListener("click", () => {
  modal.open()
});
