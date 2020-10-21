<template>
  <v-container class="pa-4 text-center">
    <v-row style="width: 100%;">
      <h2 class="text-left v-size--large">Continue Watching</h2>
    </v-row>
    <v-row class="fill-height mb-3" align="center" justify="center" style="width: 1250px;">
      <video_preview v-for="(item, i) in continue_videos"
             :key="i" :video="item" :openVideo="openVideo" class="ma-2 mx-5" style="width: 200px; height: 150px;"/>
    </v-row>
    <v-row style="width: 100%;">
      <h2 class="text-left v-size--large">Recommended for you</h2>
    </v-row>
    <v-row class="mb-4" style="width: 1250px;" justify="center">
      <div class="px-4" align="center" justify="center" style="position:relative; width: 1200px;">
        <swiper :options="swiperOption">
          <swiper-slide
            v-for="(item, i) in recommended_videos"
            :key="i"
          >
            <video_preview :video="item" :openVideo="openVideo" style=" height: 150px;" />
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
    <v-row class="fill-height" align="center" justify="center" style="width: 1250px;">
      <video_preview v-for="(item, i) in recent_videos"
                     :key="i" :video="item" :openVideo="openVideo" class="ma-2 mx-5" style="width: 200px; height: 150px;"/>
    </v-row>

    <v-overlay
      opacity="0.7"
      :value="overlay"
    >
      <v-layout style="width: 1000px;">
        <v-col cols="6" class="pa-0">
          <v-row
            class="ma-0"
            align="center"
            justify="center"
            style="width:640px;height: 600px;"
          >
            <v-card class="rec-card fill-height">
              <v-img
                class="white--text fill-height align-end"
                :src="video.main_image"
                width="640"
              >
                <v-card-title></v-card-title>

                <v-card-text class="text--primary">
                </v-card-text>
              </v-img>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="6" class="pa-0" style="z-index: 4;">
          <v-row
            class="ma-0"
            align="center"
            style="width: 100%; height: 600px; color: white;"
          >
            <v-col cols="3" class="fill-height back-gradient">
            </v-col>
            <v-col cols="9" class="fill-height black">
              <v-btn @click="overlay = false"
                     text
                     class="pa-0"
                     style="position: absolute;right:0;"
              >
                <v-icon style="color: white">
                  mdi-close
                </v-icon>
              </v-btn>
              <v-row class="mb-4" justify="center">
                <h1 class="my-4">{{video.title}}</h1>
              </v-row>
              <v-row class="mx-3 text-left" justify="start" style="max-height: 250px;overflow-y: auto;word-break: break-all;">
                <p v-html="video.description"></p>
              </v-row>
              <v-row class="mx-3" justify="end">
                <p class="font-weight-medium font-italic ma-2" style="font-size: 16px">
                  <v-icon>mdi-play</v-icon>
                  {{ Math.floor(video.length/60) +':'+ (((video.length%60) &lt; 10)?'0'+video.length%60:video.length%60) }}
                </p>
              </v-row>
              <v-row class="mx-3 grey--text" justify="start">
                <h3>Category</h3>
              </v-row>
              <v-row class="mx-6" justify="start">
                <p>{{(video.category1)? video.category1.name : ""}}</p>
                <p>{{(video.category2)? "&nbsp;"+video.category2.name : ""}}</p>
                <p>{{(video.category3)? "&nbsp;"+video.category3.name : ""}}</p>
              </v-row>
              <v-row class="mx-3 grey--text" justify="start">
                <h3>Awards</h3>
              </v-row>
              <v-row class="mx-6" justify="start">
                <template v-for="(award, i) in video.Video_Awards">
                  <p :key="i">{{ (i == 0)? award.name : ', '+award.name }}</p>
                </template>
              </v-row>
              <v-row class="mx-3 grey--text" justify="start">
                <h3>More</h3>
              </v-row>
              <v-row class="mx-6" justify="start">
                <template v-for="(link, i) in video.Video_Links">
                  <p :key="i">{{ (i == 0)? link.url : ', '+link.url }}</p>
                </template>
              </v-row>
              <v-row class="my-2" justify="end">
                <v-btn @click="playVideo"
                       rounded
                       color="primary"
                       dark
                       class="mr-5"
                       style="position: absolute; bottom: 20px;"
                >
                  <v-icon style="color: white">
                    mdi-play
                  </v-icon>
                  Play
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-layout>
    </v-overlay>

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
      },
      overlay: false,
      video: {
        id: null,
        title: '',
        description: '',
        vimeo_id: 465731694,
        main_image: "/image/empty.png",
        url: '',
        category1: {
          id: null,
          name: '',
          group: 1
        },
        category2: {
          id: null,
          name: '',
          group: 2
        },
        category3: {
          id: null,
          name: '',
          group: 3
        },
        Video_Awards:[],
        Video_Links:[]
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
    openVideo: function(_video){
      this.video = _video;
      this.overlay = true;
    },
    playVideo: function(){
      let _router = this.$router.resolve({path: `/video/${this.video.id}`});
      window.open(_router.href, '_blank');
    },
    ...mapActions({
      setUser: 'setUser',
      getVideos: 'getVideos'
    })
  },
  mounted: async function () {
    let copied_list = await this.getVideos();
    this.recommended_videos = copied_list.filter(i => i.category3 === 17);
    this.continue_videos = copied_list.filter(i => i.category3 === 16);
    this.recent_videos = copied_list.filter(i => i.category3 === 15);
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

