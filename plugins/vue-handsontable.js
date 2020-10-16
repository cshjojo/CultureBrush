import Vue from 'vue'
import { HotTable } from '@handsontable/vue'

export default () => {
  if (process.client) {
    Vue.component('hot-table', HotTable)
  }
}
