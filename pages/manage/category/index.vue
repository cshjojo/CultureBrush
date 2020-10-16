<template>
  <v-container class="pa-4 text-center">
    <v-row style="width: 100%;">
      <h2 class="text-left v-size--large">Category List</h2>
    </v-row>
    <v-row class="fill-height mt-3" style="width: 100%;">
      <v-col v-for="(_i) in 3" :key="_i" class="pl-10 pr-lg-12" cols="4">
        <v-row align="center">
          <h3 class="text-left ml-2">Category {{_i}}</h3>
          <v-spacer/>
          <v-btn v-if="!newCategory[_i].is_add" @click.stop="newCategory[_i].is_add = true" icon right>
            <v-icon style="color: white">
              mdi-plus
            </v-icon>
          </v-btn>
          <v-btn v-if="newCategory[_i].is_add" @click.stop="newCategory[_i].is_add = false" icon right>
            <v-icon style="color: white">
              mdi-minus
            </v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <v-layout align-center>
            <v-flex>
              <v-list color="rgba(0, 0, 0, 0)" dark>
                <v-list-item class="py-0" v-if="newCategory[_i].is_add">
                  <v-list-item-content class="py-0">
                    <v-list-item-subtitle>
                      <v-text-field
                        class="pa-0 ma-0"
                        placeholder="Category"
                        outlined
                        hide-details
                        v-model="newCategory[_i].name"
                      ></v-text-field>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon  class="ml-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="_saveCategory(newCategory[_i])">mdi-content-save</v-icon>
                      </template>
                      <span>저장</span>
                    </v-tooltip>
                  </v-list-item-action>
                </v-list-item>

                <template v-for="(category, i) in categories.filter(i => i.group == _i)">
                  <v-hover v-slot:default="{ hover }" :key="i">
                    <v-list-item class="py-0" style="width: 100%; min-height: 50px;margin-bottom: 2px;">
                      <v-list-item-content class="py-0">
                        <v-list-item-title>
                          <v-text-field
                            class="pa-0"
                            placeholder="Category"
                            hide-details
                            :readonly="!category.is_edit"
                            :outlined="category.is_edit"
                            v-model="category.name"
                          ></v-text-field>
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <template v-if="hover || category.is_edit" class="mr-2">
                          <v-row>
                            <v-col cols="6" class="pa-0">
                              <v-tooltip v-if="!category.is_edit" bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon  class="mr-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="category.is_edit = true">mdi-pencil</v-icon>
                                </template>
                                <span>수정</span>
                              </v-tooltip>
                              <v-tooltip v-if="category.is_edit" bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon  class="mr-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="_setCategory(category)">mdi-content-save</v-icon>
                                </template>
                                <span>저장</span>
                              </v-tooltip>
                            </v-col>

                            <v-col cols="6" class="pa-0">
                              <v-tooltip v-if="!category.is_edit" bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon  class="mr-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="_deleteCategory(category)">mdi-delete</v-icon>
                                </template>
                                <span>삭제</span>
                              </v-tooltip>
                              <v-tooltip v-if="category.is_edit" bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon  class="mr-2 c-hand" color="grey lighten-1" v-on="on" @click.stop="category.is_edit = false">mdi-cancel</v-icon>
                                </template>
                                <span>취소</span>
                              </v-tooltip>
                            </v-col>
                          </v-row>
                        </template>
                      </v-list-item-action>
                    </v-list-item>
                  </v-hover>
                </template>

              </v-list>
            </v-flex>
          </v-layout>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

export default {
  components: {
    Swiper,
    SwiperSlide,
    'video_preview': require('@/components/video/video.vue').default,
  },
  data () {
    return {
      newCategory: {1:{name: "", group: 1, is_add: false},
        2:{name: "", group: 2, is_add: false},
        3:{name: "", group: 3, is_add: false}},
      categories: [],
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
    editCategory: function(category){
      category.is_edit = true;
    },
    _setCategory: async function(category){
      if(category.id && category.name){
        await this.setCategory([`id:${category.id}, name:"${category.name}"`]);
        this._categories();
      }
    },
    _deleteCategory: async function(category){
      if(category.id){
        await this.deleteCategory([`id:${category.id}`]);
        this._categories();
      }
    },
    _saveCategory: async function(category){
      if(category.name){
        await this.createCategory([`name:"${category.name}", group:${category.group}`]);
        category.is_add = false;
        category.name = '';
        this._categories();
      }
    },
    _categories: async function() {
      let copied_categories = await this.getCategories();
      this.categories = copied_categories.map(i => Object.assign(i, { is_edit: false }));
    },
    ...mapActions({
      setUser: 'setUser',
      getCategories: 'getCategories',
      createCategory: 'createCategory',
      setCategory: 'setCategory',
      deleteCategory: 'deleteCategory'
    })
  },
  mounted: async function () {
    if(!this.user || !this.user.is_admin)return this.$router.push({path: `/`});
    this._categories();
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

