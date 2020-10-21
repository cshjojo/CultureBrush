<template>
  <v-container class="py-0 px-4">
    <v-row class="fill-height px-6" style="width: 100%;">
      <v-layout align-center>
        <v-flex>
          <v-list class="py-0" color="rgba(0, 0, 0, 0)" dark>
            <v-list-item class="py-0">
              <v-list-item-content class="py-0">
                <v-list-item-subtitle>
                  <h2 class="text-left v-size&#45;&#45;large">Insert Video</h2>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-row class="text-center">
                  <v-btn class="mr-5 md2" color="#1FC779" @click.stop="saveVideo" rounded dark>SAVE</v-btn>
                  <v-btn @click="linkUrl('/manage/video')" class="mr-5" color="blue-grey" rounded dark>CANCLE</v-btn>
<!--                  <v-btn class="mr-5" color="error" rounded dark>DELETE</v-btn>-->
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
              v-model="title"
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
              v-model="description"
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
            <v-img v-if="image_url" :src="image_url" style="height: 240px;" contain></v-img>
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
            <vimeo-player ref="player" :video-id="vimeoId" player-width="480" player-height="240"/>
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
              v-model="category1"
              label="Category 1"
              dark
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              :items="categories.filter(i => i.group == 2)"
              item-text="name"
              item-value="id"
              v-model="category2"
              label="Category 2"
              dark
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              :items="categories.filter(i => i.group == 3)"
              item-text="name"
              item-value="id"
              v-model="category3"
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
                    <v-list-item v-for="(award, i) in awards" :key="i" class="py-0">
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
                          <span>Delete</span>
                        </v-tooltip>
                        <v-tooltip v-if="award.state == 'd'" bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon  class="ml-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="cancelAward(award, i)">mdi-cancel</v-icon>
                          </template>
                          <span>Cancel</span>
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
                    <v-list-item v-for="(link, i) in links" :key="i" class="py-0">
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
  </v-container>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'
import Player from '@vimeo/player'
//168067174 mr.night
export default {
  components: {
    'video_preview': require('@/components/video/video.vue').default,
  },
  data () {
    return {
      title: '',
      description: '',
      rules: {
        required: value => !!value || 'Required.'
      },
      url: '',
      vimeo_inserted: null,
      vimeoId: 465731694,
      main_image: null,
      category1:null,
      category2:null,
      category3:null,
      awards: [],
      links: [],
      image_file: null,
      image_url: "/image/empty.png",
      categories: [],
      files: [],
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
          this.vimeoId = this.vimeo_inserted.substring(this.vimeo_inserted.lastIndexOf('/')+1);
        }else{ // id
          this.vimeoId = this.vimeo_inserted
        }
      }
    },
    changeImage: function(e){
        this.image_url = (this.image_file)? URL.createObjectURL(this.image_file) : "/image/empty.png";
    },
    addAward: function(){
      let award = {id:null, name:''}
      this.awards.push(award);
    },
    deleteAward: function(award, i){
      // this.awards = this.awards.filter(i => i.id != id );
      this.awards.splice(i, 1);
      if(award.id){
        let _award = Object.assign(award, {state: 'd'});
        this.awards.push(_award);
      }
    },
    cancelAward: function(award, i){
      // this.awards = this.awards.filter(i => i.id != id );
      this.awards.splice(i, 1);
      if(award.id){
        let _award = Object.assign(award, {state: ''});
        this.awards.push(_award);
      }
      //award.state = '';
    },
    addLink: function(){
      let link = {id:null, url:''}
      this.links.push(link);
    },
    deleteLink: function(link, i){
      // this.links = this.links.filter(i => i.id != id );
      this.links.splice(i, 1);
      if(link.id){
        let _link = Object.assign(link, {state: 'd'});
        this.links.push(_link);
      }
    },
    cancelLink: function(link, i){
      // this.links = this.links.filter(i => i.id != id );
      this.links.splice(i, 1);
      if(link.id){
        let _link = Object.assign(link, {state: ''});
        this.links.push(_link);
      }
    },
    saveVideo: async function(){
      // clear blanks
      this.awards = this.awards.filter(i => i.name.replace(/ /gi, '') != "" );
      this.links = this.links.filter(i => i.url.replace(/ /gi, '') != "" );

      if(this.title){
        let categories = ((this.category1)?`, category1:${this.category1}`:'')+((this.category2)?`, category2:${this.category2}`:'')+((this.category3)?`, category3:${this.category3}`:'');
        if(this.image_file && this.image_file.type.indexOf('image') > -1){
          let formData = new FormData();
          formData.append("file", this.image_file);
          formData.append("title", this.title);
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
            return this.createVideo([`title:"${this.title}", url:"${this.url}", vimeo_id:${this.vimeoId}, desc:"${this.description.replace(/\n/gi, '<br>')}",
             main_image:"${result.name}", awards:${JSON.stringify(JSON.stringify(this.awards))}, links:${JSON.stringify(JSON.stringify(this.links))}`+categories])
          }).then((result) => {
            if(result){
              this.linkUrl('/manage/video');
            }
          })
        }else{
          let result = await this.createVideo([`title:"${this.title}", url:"${this.url}", vimeo_id:${this.vimeoId}, desc:"${this.description.replace(/\n/gi, '<br>')}",
          awards:${JSON.stringify(JSON.stringify(this.awards))}, links:${JSON.stringify(JSON.stringify(this.links))}`+categories])
          if(result)this.linkUrl('/manage/video');
        }
      }
    },
    saveImage: async function(){

    },
    ...mapActions({
      setUser: 'setUser',
      getCategories: 'getCategories',
      createVideo: 'createVideo'
    })
  },
  mounted: async function () {
    if(!this.user || !this.user.is_admin)return this.$router.push({path: `/`});
    let copied_categories = await this.getCategories();
    this.categories = copied_categories.map(i => Object.assign(i, { id: parseInt(i.id+"") }));
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

