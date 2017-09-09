<template>
  <div id="app">
    <div id="top_div" style="height: 100%">
      <v-map :zoom="zoom" :center="center">
        <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
         <v-marker v-for="item in filteredIncidents" :key="item.id" :lat-lng="item.latlng" :icon="item.icon">
          <v-popup :content="item.message"></v-popup>
        </v-marker>
      </v-map>
      <button id="modal_button" @click="showModal = true">List view</button>
      <modal name="hello-world"
        v-if="showModal" @close="showModal = false"
        id ="list-events"
        v-bind:markers="filteredIncidents">
      </modal>
    </div>
  </div>
</template>

<script>

import Vue2Leaflet from 'vue2-leaflet';
// import Glyph from 'leaflet.icon.glyph';
import Modal from './components/Modal.vue';
import { EventBus } from './eventbus.js';

/*
  somehow the shadow wasn't rendering from default settings
  icon settings taken from https://github.com/Leaflet/Leaflet/blob/3fae3befd33da47ec6061c861c74ca9538ec9273/src/layer/marker/Icon.Default.js
*/
const customIcon = L.icon({
  // iconUrl: './marker-icon.png',
  // iconRetinaUrl: './marker-icon-2x.png',
  // shadowUrl: './marker-shadow.png',
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
    'v-tilelayer': Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-popup': Vue2Leaflet.Popup,
    'modal': Modal
  },
  data () {
    return {
      zoom: 13,
      center: [1.3521, 103.8198],
      marker: L.latLng(1.3521, 103.8198),
      minZoom: 8,
      maxZoom: 15,
      // url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', // .fr tileset seems to load faster
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'vue2-leaflet',
      title: 'traffic incidents in sg',
      opacity: 1,
      draggable: true,
      attributionControl: false,
      markers: [],
      showModal: false,
      checkedIncidentTypes: ["Vehicle breakdown", "Roadwork", "Accident", "Heavy Traffic", "Roadblock"]
    }
  },
  computed: {
    filteredIncidents: function() {
      const data = this.$data.markers;
      var _this = this;
      if (!data) return [];
      const filtered = data.filter((d) => _this.$data.checkedIncidentTypes.includes(d.incidentType));
      return filtered;
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
          _this.$data.markers.push({latlng: L.latLng(e.Latitude, e.Longitude), message: e.Message, incidentType: e.Type, icon: customIcon})
        })
      }).catch(function(err) {
        console.log(err)
      });
    },
    updateFilterCategories: function(val) {
      this.$data.checkedIncidentTypes = val
    }
  },
  mounted() {
    var _this = this
    this.getTrafficInfo()
    EventBus.$on('filter-category', function (payLoad) {
      _this.updateFilterCategories(payLoad)
    });
  }
}
</script>

<style lang="scss">
@import '../node_modules/leaflet/dist/leaflet.css';

$button_offset: 5%;

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}

html, body, #map, #next {
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
}

#modal_button {
  position: fixed;
  top: $button_offset;
  right: $button_offset;
  z-index: 9999;
}

</style>
