<template>
  <v-container class="pa-4 text-center">
    <v-row style="width: 100%;">
      <h2 class="text-left v-size--large">Continue Watching</h2>
    </v-row>
    <v-row class="fill-height mb-3" align="center" justify="center">
      <video_preview v-for="(item, i) in continue_videos"
             :key="i" :video="item" class="ma-2 mx-5" style="width: 200px; height: 150px;"/>
    </v-row>
    <v-row style="width: 100%;">
      <h2 class="text-left v-size--large">Recommended for you</h2>
    </v-row>
    <v-row class="mb-4">
      <div class="px-4" align="center" justify="center" style="position:relative; width: 1200px;">
        <swiper :options="swiperOption">
          <swiper-slide
            v-for="(item, i) in recommended_videos"
            :key="i"
          >
            <video_preview :video="item" style=" height: 150px;" />
          </swiper-slide>
        </swiper>
        <div class="swiper-button-prev ml-4" slot="button-prev" style="color: white;z-index: 4;"></div>
        <div class="swiper-button-next mr-4" slot="button-next" style="color: white;z-index: 4;"></div>
        <div class="fill-height ml-4" style="position: absolute; left:0;top:0; width: 50px;background: black; opacity: 0.6;z-index: 3;"></div>
        <div class="fill-height mr-4" style="position: absolute; top:0;right:0; width: 50px;background: black; opacity: 0.6;z-index: 3;"></div>
      </div>
    </v-row>
    <v-row style="width: 100%;">
      <h2 class="text-left v-size--large">Recently Videos</h2>
    </v-row>
    <v-row class="fill-height" align="center" justify="center">
      <video_preview v-for="(item, i) in recent_videos"
                     :key="i" :video="item" class="ma-2 mx-5" style="width: 200px; height: 150px;"/>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
//import {video} from video

export default {
  components: {
    Swiper,
    SwiperSlide,
    'video_preview': require('@/components/video/video.vue').default,
  },
  data () {
    return {
      transparent: 'rgba(255, 255, 255, 0)',
      model: null,
      continue_videos: [],
      recommended_videos: [],
      recent_videos: [],
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 30,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
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
    let copied_list = await this.getVideos();
    this.recommended_videos = copied_list.filter(i => i.category3 && i.category3.id === '12');
    this.continue_videos = copied_list.filter(i => i.category3 && i.category3.id === '13');
    this.recent_videos = copied_list.filter(i => i.category3 && i.category3.id === '14');
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
  .v-card {
    transition: opacity .4s ease-in-out;
  }

  .video-info:not(.on-hover) {
    opacity: 0;
  }
  .on-hover {
    transition: .4s;
    opacity: 1;
  }

  .video-back:not(.on-hover-back) {
    opacity: 0;
  }
  .on-hover-back {
    transition: .4s;
    opacity: 0.6;
  }

  .show-btns {
    color: rgba(255, 255, 255, 1) !important;
  }


</style>

