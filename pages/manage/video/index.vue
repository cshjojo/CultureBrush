<template>
  <v-container class="pa-4 text-center">
    <v-row style="width: 100%;">
      <h2 class="text-left v-size--large">Video List</h2>
    </v-row>
    <v-row class="fill-height mb-3" justify="center" style="width: 100%">
      <v-flex align="left">
        <v-row>
          <video_preview v-for="(item, i) in video_list"
                         :key="i" :video="item" class="ma-2 mx-5" style="width: 200px; height: 150px;"/>
        </v-row>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'

export default {
  components: {
    'video_preview': require('@/components/video/video.vue').default,
  },
  data () {
    return {
      video_list: []
    }
  },
  computed: {
    user () { return this.$store.state.user },
    goto () {
      if (this.$route.query.to) {
        return this.$route.query.to
      }
      return `/scene`
    }
  },
  methods: {
    linkUrl: function (url) {
      this.$router.push({path: url})
    },
    ...mapActions({
      setUser: 'setUser',
      getVideos: 'getVideos'
    })
  },
  mounted: async function () {
    if(!this.user || !this.user.is_admin)return this.$router.push({path: `/`});
    let copied_list = await this.getVideos();
    copied_list.map(i => Object.assign(i, { id: parseInt(i.id+"") }));
    this.video_list = copied_list;
  }
}
</script>

<style lang="scss" scoped>
  /*@media screen and (max-width:960px)*/
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

