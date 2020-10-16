<template>
  <div class="ele" v-if="element" :id="element.id" :style="style" :title="is_run ? null : '더블클릭으로 편집'">
    <img class="ele-image" :class="{'op-40': element.value_type === 'data'}" :src="display_value" :alt="real_value"
         :value="real_value" :value_type="element.value_type"
         @dblclick="is_run ? null : openElementModal(element)"/>
    <div v-if="element.value_type === 'data' && !is_run" class="text-overlay"
         @dblclick="is_run ? null : openElementModal(element)">
      ({{$store.state.data[0][this.element.value]}})
    </div>
  </div>
</template>
<script>
  export default {
    props: ['element', 'openElementModal', 'is_run', 'real_value'],
    computed: {
      style () {
        if (this.element) {
          return {
            left: `${this.element.x}px`,
            top: `${this.element.y}px`,
            width: `${this.element.width}px`,
            height: `${this.element.height}px`
          }
        }
      },
      display_value () {
        if (this.element) {
          if (this.element.value_type === 'data') {
            if (this.is_run) return this.real_value
            return '/image/empty.png'
          } else {
            return this.element.value
          }
        }
      }
    }
  }
</script>
<style lang="scss">
  .ele-image {
    width: 100%;
    height: 100%;

    &.op-40 {
      opacity: 0.4;
    }
  }

  .text-overlay {
    position: absolute;
    top: 45%;
    font-size: 20px;
    left: 35%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
