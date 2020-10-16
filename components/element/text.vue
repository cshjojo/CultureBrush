<template>
  <div class="ele" v-if="element" :id="element.id" :style="style" :title="is_run ? null : '더블클릭으로 편집'">
    <p class="ele-text" 
       :value="real_value" :value_type="element.value_type"
       @dblclick="is_run ? null : openElementModal(element)">
      {{display_value}}
    </p>
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
            height: `${this.element.height}px`,
            'font-size': `${this.element.style.fontSize}px`,
            color: this.element.style.color
          }
        }
      },
      display_value () {
        if (this.element) {
          if (this.element.value_type === 'data') {
            if (this.is_run) return this.real_value
            return `(${this.$store.state.test.data[0][this.element.value]})`
          } else {
            return this.element.value
          }
        }
      }
    }
  }
</script>
<style lang="scss">
  .ele-text {
    width: 100%;
    height: 100%;
    padding: 5px;
    margin: unset;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
