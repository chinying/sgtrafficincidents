<!-- template for the modal component -->
<template id="modal-template">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" @click="$emit('close')">
        <div class="modal-container" @click.stop>

          <div class="modal-header">
            <slot name="header">
              {{modal_header}}
            </slot>
            <br />
            <li v-for="incidentType in incidentTypes" class="filter-list-items">
              <input type="checkbox" v-model="checkedComponents" v-bind:value="incidentType" @click="reportComponents()" /> {{ incidentType }}
            </li>
          </div>

          <div class="modal-body">
            <slot name="body">
              <table>
                <tr v-for="item in markers">
                  <td> {{item.message}} </td>
                </tr>
              </table>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { EventBus } from '../eventbus.js';

export default {
  name: 'modal',
  props: ['markers', 'checked'],
  data() {
    return {
      modal_header: "Filter by",
      modal_footer: "footer",
      incidentTypes: ["Vehicle breakdown", "Roadwork", "Accident", "Heavy Traffic", "Road Block"],
      checkedComponents: this.$props.checked
    }
  },
  methods: {
    reportComponents: function() {
      const checkedComponents = this.$data.checkedComponents
      EventBus.$emit('filter-category', checkedComponents);
    }
  }
}
</script>

<style lang="scss">
.modal-inner-component {
  padding: 10px 30px;
}

.modal-header, .modal-footer, .modal-body {
  @extend .modal-inner-component;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  h3 {
    margin-top: 0;
    color: #42b983;
  }
  background: #eee;
}

.modal-body {
  margin: 20px 0;
  max-height: 50vh;
  height: 50vh;
  overflow-y: auto;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/* custom */
.filter-list-items {
  list-style-type: none;
  display: inline;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
}

.modal-default-button {
  padding: 10px 20px;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  color: #222;
  background: #2ECC71;
  -webkit-transition: none;
  -moz-transition: none;
  transition: ease .5s;
  border-radius: 5px;
  font-weight: 700;
  font-size: .75em;
  &:hover {
    background: #296F61;
    color: #FFF;
  }
}

</style>
