<template>
  <v-dialog v-model="is_visible" max-width="500px">
    <v-card v-if="element && curr_scene">
      <v-card-title class="bg-secondary">
        <span class="font-weight-bold">{{curr_scene.col +1}}-{{curr_scene.row +1}}.{{curr_scene.title}}</span>
        <span class="ml-2">Edit {{type_str}}</span>
        <div class="flex-grow-1"></div>
        <v-icon @click.stop="toggle">xi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-row class="mt-4 text-lg-bold">
          Data
        </v-row>
        <v-radio-group v-model="curr_element.value_type" class="mt-0 mb-0 font-small">
          <v-row class="d-flex align-center">
            <v-radio label="Sheet" value="data"
                     :disabled="!col_headers"
                     :title="!col_headers ? 'There is no data on the sheet.' : null"></v-radio>
            <v-select v-model="value.data" class="mr-2" :items="col_headers" :disabled="curr_element.value_type !== 'data' || !col_headers"
                      :placeholder="!col_headers ? 'There is no data on the sheet.' : null"></v-select>
            <v-checkbox class="mt-0" v-model="curr_element.is_random" label="Randomize" :disabled="curr_element.value_type !== 'data' || !col_headers"
                        :hint="curr_element.value_type === 'data' ? `${col_headers[value.data]} 열의 값 개수와 관계없이 매 실행마다 ${col_headers[value.data]} 열의 랜덤한 값이 설정됩니다.` : null"></v-checkbox>
          </v-row>
          <v-row class="d-flex align-center">
            <v-radio label="Custom Input" value="static"></v-radio>
            <v-text-field type="text" v-model="value.static" :disabled="curr_element.value_type !== 'static'"/>
          </v-row>
        </v-radio-group>
        <v-row class="d-flex align-center">
          <p class="mb-0 mr-6">Textbox Label</p>
          <v-col cols="6">
            <v-text-field type="text" v-model="curr_element.name"/>
          </v-col>
        </v-row>
        <template v-if="element.type === 'text'">
          <v-divider class="mb-6"/>
          <v-row class="text-lg-bold">
            Style
          </v-row>
          <v-row class="d-flex align-center">
            <p class="mb-0 mr-6">Font Size</p>
            <v-col cols="6">
              <v-text-field type="number" v-model.number="curr_element.style.fontSize" suffix="px"/>
            </v-col>
          </v-row>
          <v-row class="d-flex align-center">
            <p class="mb-0 mr-6">Position</p>
            <v-col cols="5">
              <v-text-field type="number" v-model.number="curr_element.x" label="Vertical" suffix="px" :rules="rule_width"/>
            </v-col>
            <v-col cols="5">
              <v-text-field type="number" v-model.number="curr_element.y" label="Horizontal" suffix="px" :rules="rule_height"/>
            </v-col>
          </v-row>
        </template>
        <template v-else-if="element.type === 'button'">
          <v-row class="d-flex align-center mb-10">
            <p class="mb-0 mr-6">Response Key</p>
            <v-text-field type="text" class="text-small" placeholder="Click here and inset the key" persistent-hint
                          hint="Numbers, alphabets, Space, Enter, Ctrl, Shift, Alt, arrow keys are allowed"
                          :value="curr_element.key_text"
                          @keyup="onKeyUpKey($event)"/>
          </v-row>
          <v-divider class="mb-6"/>
          <v-row class="text-lg-bold">Style</v-row>
          <v-row class="d-flex align-center">
            <p class="mb-0 mr-6">Font Size</p>
            <v-col cols="6">
              <v-text-field type="number" v-model.number="curr_element.style.fontSize" suffix="px"/>
            </v-col>
          </v-row>
          <v-row class="d-flex align-center">
            <p class="mb-0 mr-6">Position</p>
            <v-col cols="5">
              <v-text-field type="number" v-model.number="curr_element.x" label="Vertical" suffix="px" :rules="rule_width"/>
            </v-col>
            <v-col cols="5">
              <v-text-field type="number" v-model.number="curr_element.y" label="Horizontal" suffix="px" :rules="rule_height"/>
            </v-col>
          </v-row>
          <v-row class="d-flex align-center">
            <p class="mb-0 mr-6">Hide Button</p>
            <v-checkbox v-model="curr_element.style.visibility" value="hidden" false-value="visible"/>
          </v-row>
        </template>
        <template v-else-if="element.type === 'image'">
          <v-divider class="mb-6"/>
          <v-row class="text-lg-bold">Style</v-row>
          <v-row class="d-flex align-center">
            <p class="mb-0 mr-6">Position</p>
            <v-col cols="5">
              <v-text-field type="number" v-model.number="curr_element.x" label="Vertical" suffix="px" :rules="rule_width"/>
            </v-col>
            <v-col cols="5">
              <v-text-field type="number" v-model.number="curr_element.y" label="Horizontal" suffix="px" :rules="rule_height"/>
            </v-col>
          </v-row>
        </template>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn text color="error" @click.stop="_deleteElement">
            Delete
          </v-btn>
          <v-btn color="primary" @click.stop="_saveElement">
            Save
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    props: ['element', 'is_visible', 'toggle', 'callback', 'saveElement', 'deleteElement'],
    data () {
      return {
        value: {
          data: 0,
          static: ''
        },
        curr_element: {
          name: '',
          value_type: '',
          x: 0,
          y: 0,
          is_random: false,
          key_code: null,
          key_text: null,
          style: {}
        }
      }
    },
    computed: {
      curr_scene () { return this.$store.state.test.curr_scene },
      connectors () { return this.$store.state.test.connectors },
      test () { return this.$store.state.test.test },
      type_str () {
        if (this.element) {
          if (this.element.type === 'text') return 'Textbox'
          else if (this.element.type === 'image') return 'Image'
          else if (this.element.type === 'button') return 'Button'
        }
      },
      col_headers () {
        let _data = this.$store.state.test.data
        if (_data.length === 0) {
          return null
        }
        if (_data[0] && (_data[0].length === 0 || !_data[0][0])) {
          return null
        }
        let result  = []
        for (let idx in _data[0]) {
          if (_data[0][idx]) result.push({text: _data[0][idx], value: Number(idx)})
        }
        return result
      },
      rule_width () {
        if (this.test && this.element) {
          return [
            val => (val > 0 && val < this.test.width - this.element.width) || 'You cannot exceed the screen size.'
          ]
        }
        return []
      },
      rule_height () {
        if (this.test && this.element) {
          return [
            val => (val > 0 && val < this.test.height - this.element.height) || 'You cannot exceed the screen size.'
          ]
        }
        return []
      }
    },
    watch: {
      element (_new) {
        if (_new) {
          this.curr_element = JSON.parse(JSON.stringify(_new))
          this.value[_new.value_type] = _new.value
        }
      }
    },
    methods: {
      _saveElement: function () {
        let value = this.value[this.curr_element.value_type]
        if (value === null || value === undefined) {
          alert('Please enter a valid value.')
          return false
        }
        let changed = {...this.curr_element, ...{value: this.value[this.curr_element.value_type]}}
        this.saveElement({...this.element, ...changed})
      },
      _deleteElement: function () {
        let msg = 'Are you sure you want to delete this item?'
        if (this.element && this.element.type === 'button') {
          for (let cnId in this.connectors) {
            let conn = this.connectors[cnId]
            if (conn.connect_type === 'button' && conn.button_id === this.element.id) {
              msg = 'There is a connection referred to from the current button object. Do you still want to delete it?'
              break
            }
          }
        }
        if (!confirm(msg)) return false
        this.deleteElement(this.element.id)
      },
      getKeyInfo: function (keyCode, location) {
        let keyToChar = {
          13: 'Enter',
          16: 'Shift',
          17: 'Ctrl',
          18: 'Alt',
          32: 'Space',
          37: 'Left direction key',
          38: 'Top direction key',
          39: 'Right direction key',
          40: 'Bottom direction key',
          191: '/'
        }
        let locToChar = {
          1: '(왼쪽)',
          2: '(오른쪽)'
        }
        if (keyCode >= 48 && keyCode <= 57) {   // 0 ~ 9
          return String.fromCharCode(keyCode)
        } else if (keyCode >= 65 && keyCode <= 90) {  // a ~ z
          return String.fromCharCode(keyCode)
        } else if (keyCode >= 37 && keyCode <= 40) {  // arrows
          return keyToChar[keyCode]
        } else if (keyCode === 13 || keyCode === 32) {  // space, enter
          return keyToChar[keyCode]
        } else if (keyCode >= 16 && keyCode <= 18) {  // shift, ctrl, alt
          if (location) return `${keyToChar[keyCode]}${locToChar[location]}`
          return keyToChar[keyCode]
        } else if (keyCode === 191) {  // /
          return keyToChar[keyCode]
        }
        return null
      },
      onKeyUpKey: function (e) {
        if (e.keyCode) {
          let keyInfo = this.getKeyInfo(e.keyCode, e.location)
          if (keyInfo) {
            this.curr_element.key_code = e.keyCode
            this.curr_element.key_text = keyInfo
          } else {
            this.curr_element.key_code = ''
            this.curr_element.key_text = ''
            alert('Key is not available.')
          }
        }
      }
    },
    mounted () {
      if (this.element) {
        this.value[this.element.value_type] = this.element.value
        this.curr_element = JSON.parse(JSON.stringify(this.element))
      }
    }
  }
</script>
<style lang="scss" scoped>
  .bg-secondary {
    background: #f1f1fc;
  }

  .v-text-field {
    padding-top: 0;
  }

  .col {
    padding-bottom: 0;
  }

  .text-lg-bold {
    font-size: 1.1rem;
    font-weight: bold;
  }
</style>
<style lang="scss">
  .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
    margin-bottom: 0 !important;
  }

  .font-small {
    .v-input--radio-group__input {
      label {
        font-size: 14px;
      }
    }
  }
</style>
