<template>
  <div class="ele" v-if="element" :id="element.id" :style="style" :title="is_run ? null : '더블클릭으로 편집'">
    <button class="ele-btn" :value="real_value" :value_type="element.value_type"
            @dblclick="is_run ? null : openElementModal(element)">{{display_value}}</button>
  </div>
</template>
<script>
  export default {
    props: ['element', 'openElementModal', 'is_run', 'real_value', 'hidden'],
    computed: {
      style () {
        if (this.element) {
          return {
            left: `${this.element.x}px`,
            top: `${this.element.y}px`,
            width: `${this.element.width}px`,
            height: `${this.element.height}px`,
            'font-size': `${this.element.style.fontSize}px`,
            color: this.element.style.color,
            opacity: this.hidden ? this.is_run ? 0 : 0.5 : 1
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
  .ele-btn {
    background: transparent;
    border: 1px solid #999;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    padding: 5px 10px;
    width: 100%;
    height: 100%;
    cursor: inherit;
  }
</style>
