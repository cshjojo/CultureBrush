<template>
  <v-container class="pa-4 text-center">
    <v-row class="fill-height mb-3" align="center" justify="center">
      <no-ssr>
        <vimeo-player ref="player" :video-id="video.vimeo_id" player-width="1000" player-height="640"/>
      </no-ssr>
      <v-overlay
        opacity="1"
        :value="overlay"
        absolute
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
  },
  data () {
    return {
      transparent: 'rgba(255, 255, 255, 0)',
      overlay: true,
      copied_main_image: "/image/empty.png",
      video_length: null,
      video_description: '',
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
    playVideo: function () {
      this.overlay = false;
      this.$refs.player.play();
    },
    ...mapActions({
      setUser: 'setUser',
      getVideo: 'getVideo'
    })
  },
  mounted: async function () {
    let copied_video = await this.getVideo([`id:${this.$route.params.id}`]);
    await fetch('http://vimeo.com/api/v2/video/'+copied_video.vimeo_id+'/json').then(res => res.json())
      .then(data => {
        if(copied_video.main_image){
          copied_video.main_image = this.$media_url + copied_video.main_image;
        }else{
          copied_video.main_image = data[0].thumbnail_large;
        }
        if(!copied_video.description)copied_video.description = data[0].description;
        this.video = Object.assign(this.video, copied_video, {length: data[0].duration});
      });




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

  .back-gradient{
    background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))
  }


</style>

