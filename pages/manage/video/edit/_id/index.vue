<template>
  <v-container class="py-0 px-4">
    <v-row class="fill-height px-6" style="width: 100%;">
      <v-layout align-center>
        <v-flex>
          <v-list class="py-0" color="rgba(0, 0, 0, 0)" dark>
            <v-list-item class="py-0">
              <v-list-item-content class="py-0">
                <v-list-item-subtitle>
                  <h2 class="text-left v-size&#45;&#45;large">Edit Video</h2>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-row class="text-center">
                  <v-btn class="mr-5 md2" color="#1FC779" @click.stop="saveVideo" rounded dark>SAVE</v-btn>
                  <v-btn @click="linkUrl('/manage/video')" class="mr-5" color="blue-grey" rounded dark>CANCLE</v-btn>
                  <v-btn class="mr-5" color="error" @click.stop="deleteDialog = true" rounded dark>DELETE</v-btn>
                </v-row>
              </v-list-item-action>
            </v-list-item>
            <v-divider class="mx-2"></v-divider>
          </v-list>
        </v-flex>
      </v-layout>
    </v-row>
    <v-row class="fill-height" style="width: 100%;">
      <v-col cols="6" class="px-3" justify="left">
        <v-row>
          <h4 class="text-left ml-2">Title & Description</h4>
        </v-row>
        <v-row>
          <v-col cols="6" class="pa-0 px-3">
            <v-text-field
              v-model="video.title"
              label="Title"
              :rules=[rules.required]
              clearable
              dark
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="11" class="pa-0 px-3">
            <v-textarea
              v-model="video.description"
              label="Description"
              no-resize
              rows="3"
              clearable
              dark
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <h4 class="text-left ml-2">Main Image</h4>
        </v-row>
        <v-row>
          <v-col cols="11">
            <v-img :src="video.main_image" style="height: 240px;" contain></v-img>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="11">
            <v-file-input
              v-model="image_file"
              color="white accent-4"
              dark
              label="Main Image"
              placeholder="Video Main Image"
              prepend-icon="mdi-paperclip"
              :show-size="1000"
              @change="changeImage"
            >
              <template v-slot:selection="{ text }">
                <v-chip
                  dark
                  label
                  small
                >
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" class="px-3" justify="left">
        <v-row>
          <h4 class="text-left ml-2">Video</h4>
        </v-row>
        <v-row class="px-10" align="center" justify="center" style="width: 100%;">
          <no-ssr>
            <vimeo-player ref="player" :video-id="video.vimeo_id" player-width="480" player-height="240"/>
          </no-ssr>
        </v-row>
        <v-row class="px-10" align="center" justify="center">
          <v-text-field
            v-model="vimeo_inserted"
            label="Vimeo ID or URL"
            clearable
            dark
          ></v-text-field>
          <v-btn icon color="white" fab large @click.stop="loadVideo"><v-icon>mdi-archive-arrow-up-outline</v-icon></v-btn>
        </v-row>
        <v-row>
          <h4 class="text-left ml-2">Category</h4>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-select
              :items="categories.filter(i => i.group == 1)"
              item-text="name"
              item-value="id"
              v-model="video.category1"
              label="Category 1"
              dark
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              :items="categories.filter(i => i.group == 2)"
              item-text="name"
              item-value="id"
              v-model="video.category2"
              label="Category 2"
              dark
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              :items="categories.filter(i => i.group == 3)"
              item-text="name"
              item-value="id"
              v-model="video.category3"
              label="Category 3"
              dark
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pr-6" cols="6">
            <v-row align="center">
              <h4 class="text-left ml-2">Awards</h4>
              <v-spacer/>
              <v-btn @click.stop="addAward" icon right>
                <v-icon style="color: white">
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-row>
            <v-row>
              <v-layout align-center>
                <v-flex>
                  <v-list color="rgba(0, 0, 0, 0)" dark>
                    <v-list-item v-for="(award, i) in video.Video_Awards" :key="i" class="py-0">
                      <v-list-item-content class="py-0">
                        <v-list-item-subtitle>
                          <v-text-field
                            :disabled="award.state === 'd'"
                            style="padding: 0;"
                            placeholder="Award"
                            v-model="award.name"
                          ></v-text-field>
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-tooltip v-if="award.state != 'd'" bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon  class="ml-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="deleteAward(award, i)">mdi-delete</v-icon>
                          </template>
                          <span>삭제</span>
                        </v-tooltip>
                        <v-tooltip v-if="award.state == 'd'" bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon  class="ml-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="cancelAward(award, i)">mdi-cancel</v-icon>
                          </template>
                          <span>삭제 취소</span>
                        </v-tooltip>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-row>
          </v-col>
          <v-col class="pr-6" cols="6">
            <v-row align="center">
              <h4 class="text-left ml-2">Links</h4>
              <v-spacer/>
              <v-btn @click.stop="addLink" icon right>
                <v-icon style="color: white">
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-row>
            <v-row>
              <v-layout align-center>
                <v-flex>
                  <v-list color="rgba(0, 0, 0, 0)" dark>
                    <v-list-item v-for="(link, i) in video.Video_Links" :key="i" class="py-0">
                      <v-list-item-content class="py-0">
                        <v-list-item-subtitle>
                          <v-text-field
                            :disabled="link.state === 'd'"
                            style="padding: 0;"
                            placeholder="Link"
                            v-model="link.url"
                          ></v-text-field>
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-tooltip v-if="link.state != 'd'" bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon  class="ml-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="deleteLink(link, i)">mdi-delete</v-icon>
                          </template>
                          <span>삭제</span>
                        </v-tooltip>
                        <v-tooltip v-if="link.state == 'd'" bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon  class="ml-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="cancelLink(link, i)">mdi-cancel</v-icon>
                          </template>
                          <span>삭제 취소</span>
                        </v-tooltip>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <template>
      <div class="text-center">
        <v-dialog
          v-model="deleteDialog"
          width="500"
        >
          <v-card>
            <v-card-title class="headline error white--text font-weight-bold">
              주의
            </v-card-title>

            <v-card-text class="pa-4">
              삭제 하시겠습니까?
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                @click.stop="_deleteVideo"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import {mapActions} from 'vuex'
  export default {
    components: {
    },
    data () {
      return {
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
        },
        rules: {
          required: value => !!value || 'Required.'
        },
        vimeo_inserted: null,
        image_file: null,
        deleteDialog: false,
        categories: [],
        files: [],
        settings:{},
        copied_main_image: null
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
      loadVideo: function () {
        if(this.vimeo_inserted){
          if(this.vimeo_inserted.indexOf('/') > -1){ // url
            if(this.vimeo_inserted.indexOf('vimeo') < 0)return alert('not vimeo url');
            this.url = this.vimeo_inserted;
            this.video.vimeo_id = this.vimeo_inserted.substring(this.vimeo_inserted.lastIndexOf('/')+1);
          }else{ // id
            this.video.vimeo_id = this.vimeo_inserted
          }
        }
      },
      changeImage: function(e){
        this.video.main_image = (this.image_file)? URL.createObjectURL(this.image_file) : "/image/empty.png";
      },
      addAward: function(){
        let award = {id:null, name:'', state:''}
        this.video.Video_Awards.push(award);
      },
      deleteAward: function(award, i){
        if(award.id){
          Object.assign(award, {state: 'd'});
        }else{
          this.video.Video_Awards.splice(i, 1);
        }
      },
      cancelAward: function(award, i){
        if(award.id){
          Object.assign(award, {state: ''});
        }
      },
      addLink: function(){
        let link = {id:null, url:'', state:''}
        this.video.Video_Links.push(link);
      },
      deleteLink: function(link, i){
        if(link.id){
          let _link = Object.assign(link, {state: 'd'});
        }else{
          this.video.Video_Links.splice(i, 1);
        }
      },
      cancelLink: function(link, i){
        if(link.id){
          let _link = Object.assign(link, {state: ''});
        }
      },
      saveVideo: async function(){
        // clear blanks
        this.video.Video_Awards = this.video.Video_Awards.filter(i => i.name.replace(/ /gi, '') != "" );
        this.video.Video_Links = this.video.Video_Links.filter(i => i.url.replace(/ /gi, '') != "" );

        if(this.video.title){
          // if(this.video.category1) this.settings.category1 = this.video.category1;
          // if(this.video.category2) this.settings.category2 = this.video.category2;
          // if(this.video.category3) this.settings.category3 = this.video.category3;
          if(this.image_file && this.image_file.type.indexOf('image') > -1){
            let formData = new FormData();
            formData.append("file", this.image_file);
            formData.append("title", this.video.title);
            formData.append("filename", this.copied_main_image);
            fetch(this.$api_url+"home/upload/", {
              method: 'POST',
              credentials: 'same-origin',
              body: formData,
            }).then(response => {
              if (!response.ok) {
                throw Error(response.statusText);
              }
              return response.text().then((text) => {
                return JSON.parse(text);
              });
            }).then((result) => { // result.name, url
              this.settings = Object.assign({}, this.video);
              this.settings.main_image = result.name;
              return this.setVideo([`settings:${JSON.stringify(JSON.stringify(this.settings))}`]);
            }).then((result) => {
              if(result){
                this.linkUrl('/manage/video');
              }
            })
          }else{
            this.settings = Object.assign({}, this.video);
            this.settings.main_image = this.copied_main_image;
            let result = await this.setVideo([`settings:${JSON.stringify(JSON.stringify(this.settings))}`]);
            if(result)this.linkUrl('/manage/video');
          }
        }
      },
      _deleteVideo: async function(){
        let result = await this.deleteVideo([`id:${this.video.id}`])
        if(result)this.linkUrl('/manage/video')
      },
      ...mapActions({
        setUser: 'setUser',
        getCategories: 'getCategories',
        getVideo: 'getVideo',
        setVideo: 'setVideo',
        deleteVideo: 'deleteVideo'
      })
    },
    mounted: async function () {
      if(!this.user || !this.user.is_admin)return this.$router.push({path: `/`});
      this.categories = await this.getCategories();

      let copied_video = await this.getVideo([`id:${this.$route.params.id}`]);
      if(copied_video.main_image){
        this.copied_main_image = copied_video.main_image;
        copied_video.main_image = this.$media_url + copied_video.main_image;
      }else{
        copied_video.main_image = "/image/empty.png";
      }
      copied_video.Video_Awards.map(i => Object.assign(i, { state: '' }));
      copied_video.Video_Links.map(i => Object.assign(i, { state: '' }));
      this.vimeo_inserted = copied_video.vimeo_id;
      copied_video.description = copied_video.description.replace(/<br>/gi, '\n');
      copied_video.category1 = copied_video.category1+'';
      copied_video.category2 = copied_video.category2+'';
      copied_video.category3 = copied_video.category3+'';
      this.video = Object.assign(this.video, copied_video);
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

