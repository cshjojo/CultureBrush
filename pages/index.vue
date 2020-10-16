<template>
  <v-container class="theme--dark">
    <div class="ma-12">
      <img :src="require('../assets/culturebrush_icon.PNG')"/>
    </div>
    <h2>
      Culture Brush
    </h2>
    <div class="ma-8"></div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      name: 'name',
      description: 'desc'
    }
  },
  computed: {
    user () { return this.$store.state.user }
  },
  mounted: function () {
      this.$router.push({path: `/main`})
  }
}
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .links {
      a {
        color: white;
        text-decoration: none;
      }
    }
  }
</style>

