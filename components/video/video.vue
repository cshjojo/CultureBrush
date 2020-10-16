<template>
  <v-hover
    v-slot:default="{ hover }"
  >
    <v-card
      style=""
      class=""
    >
      <v-img
        :src="copied_video.main_image"
        class="fill-height"
      >
        <v-card-title class="title white--text">
          <v-row
            class="fill-height flex-column"
            justify="space-between"
          >
            <p class="mt-4 subheading text-left">{{ copied_video.title }}</p>
          </v-row>
        </v-card-title>
        <div
          class="video-info fill-height"
          :class="{ 'on-hover': hover }"
          style="position: absolute;
                  top: 0;
                  width: 100%;
                  color: white;
                  z-index: 2;
                  cursor: pointer;"
          @click.stop="openVideo()"
        >
          <v-row class="fill-height" align="center" justify="center">
            <v-btn icon x-large class="align-self-center" align="center" justify="center">
              <v-icon style="color: white">
                mdi-play
              </v-icon>
            </v-btn>
            <div
              style="position: absolute;width:100%;height:30px;bottom: 0;background: black;opacity: 0.8;">
              <p class="caption font-weight-medium font-italic text-right ma-2">
                {{ Math.floor(copied_video.length/60) +':'+ (((copied_video.length%60) &lt; 10)?'0'+copied_video.length%60:copied_video.length%60) }}
              </p>
            </div>
          </v-row>
        </div>
        <div
          class="video-back fill-height"
          :class="{ 'on-hover-back': hover }"
          style="background: black;
                  position: absolute;
                  top: 0;
                  width: 100%;
                  z-index: 1;"></div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
  import Player from '@vimeo/player'
  export default {
    props: ['video'],
    data () {
      return {
        fullPath: '',
        copied_video: {
          main_image:'/image/sample01.jpg',
          length:0
        }
      }
    },
    computed: {
    },
    watch: {
      $route: function (_route) {
        this.fullPath = _route.fullPath
      }
    },
    methods: {
      openVideo: function () {
        if(this.$route.fullPath.startsWith('/manage')){
          this.$router.push({path: `/manage/video/edit/${this.copied_video.id}`})
        }else{
          this.$router.push({path: `/video/${this.copied_video.id}`})
        }
      },
    },
    mounted() {
      let _video = Object.assign({}, this.video)
      fetch('http://vimeo.com/api/v2/video/'+_video.vimeo_id+'/json').then(res => res.json())
        .then(data => {
          _video.main_image = (_video.main_image)? this.$media_url + this.video.main_image : data[0].thumbnail_medium;
          this.copied_video = Object.assign(this.copied_video, _video,{length: data[0].duration});
        });
    }
  }
</script>
<style lang="scss">
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
