<template>
  <div id="app">
    <div id="top_div" style="height: 100%">
      <v-map :zoom="zoom" :center="center">
        <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
         <v-marker v-for="item in markers" :key="item.id" :lat-lng="item.latlng" :icon="item.icon">
          <v-popup :content="item.message"></v-popup>
        </v-marker>
      </v-map>
    </div>
  </div>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet';
// import Glyph from 'leaflet.icon.glyph';

/*
  somehow the shadow wasn't rendering from default settings
  icon settings taken from https://github.com/Leaflet/Leaflet/blob/3fae3befd33da47ec6061c861c74ca9538ec9273/src/layer/marker/Icon.Default.js
*/
const customIcon = L.icon({
  iconUrl: '../node_modules/leaflet/dist/images/marker-icon.png',
  iconRetinaUrl: '../node_modules/leaflet/dist/images/marker-icon-2x.png',
  shadowUrl: '../node_modules/leaflet/dist/images/marker-shadow.png',
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:  [41, 41]
});

export default {
  name: 'example',
  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer' :Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-popup': Vue2Leaflet.Popup
  },
  data () {
    return {
      zoom: 13,
      center: [1.3521, 103.8198],
      marker: L.latLng(1.3521, 103.8198),
      minZoom: 8,
      maxZoom: 15,
      url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', // .fr tileset seems to load faster
      attribution: 'vue2-leaflet',
      title: 'traffic incidents in sg',
      opacity: 1,
      draggable: true,
      attributionControl: false,
      markers: []
    }
  },
  methods: {
    getTrafficInfo: function() {
      var request = new Request('http://localhost:8001/traffic', {
        method: 'GET'
      });

      var _this = this;
      fetch(request).then(function(response) {
        return response.json()
      }).then(function(parsed) {
        parsed.trafficStatus["value"].forEach((e) => {
          _this.$data.markers.push({latlng: L.latLng(e.Latitude, e.Longitude), message: e.Message, icon: customIcon})
        })
      }).catch(function(err) {
        console.log(err)
      });
    }
  },
  mounted() {
    this.getTrafficInfo()
  }
}
</script>

<style lang="scss">
@import '../node_modules/leaflet/dist/leaflet.css';

#app {
  width: 100%;
  height: 100%;
}
#map,
#next {
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
}
</style>
