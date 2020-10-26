<template>
  <v-app class="theme--dark">
    <v-navigation-drawer class="no-background theme--dark" width="250" :clipped="true" fixed permanent app floating
                         value="true" v-if="fullPath.startsWith('/manage')">
      <v-list-item dark>
        <v-list-item-content>
          <v-list-item-title class="title">
            Manage
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense dark class="pt-0 mt-3">
        <v-list-item to="/manage/video" active-class="navigation-active">
          <v-list-item-action left>
            <v-icon>mdi-youtube</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Videos</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="fullPath.startsWith('/manage/video')">
            <v-btn to="/manage/video/edit" icon right>
              <v-icon style="color: white">
                mdi-plus
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item to="/manage/category" class="white--text" active-class="navigation-active">
          <v-list-item-action left>
            <v-icon>mdi-television-guide</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/manage/user" class="white--text" active-class="navigation-active">
          <v-list-item-action left>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="#1FC779" :clipped-left="true" fixed app dark style="z-index: 6;">
      <img class="mr-1" :src="require('../assets/culturebrush_icon.PNG')" height="40"/>
      <v-toolbar-title
        class="" :style="{'width':'200px', 'cursor':'pointer'}" @click="$router.push({path: `/`})">
        Culture Brush
      </v-toolbar-title>
      <v-text-field
        append-icon="mdi-magnify"
        label="Search"
        solo-inverted
        class="mt-6"
        rounded
        clearable
        v-model="keyword"
        @keyup.native="searchKeyword"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn text color="white">About</v-btn>

      <v-divider
        class="mx-4"
        inset
        vertical
      ></v-divider>

      <v-menu v-if="user" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on }">
          <v-btn class="mr-3" icon v-on="on">
            <v-avatar size="36px">
              <img :src="user.profile.picture" alt="">
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-avatar class="mr-2">
                <img :src="user.profile.picture" alt="John">
              </v-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ user.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
          <v-list class="text-center">
            <v-list-item to="/user/profile" active-class="navigation-active">
              <v-list-item-action left>
                <v-icon>mdi-youtube</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/" active-class="navigation-active">
              <v-list-item-action left>
                <v-icon>mdi-history</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>History</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="logoutGoogle" active-class="navigation-active">
              <v-list-item-action left>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Sign Out</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="user.is_admin" to="/manage/video" active-class="navigation-active">
              <v-list-item-action left>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Manage</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-btn text color="white" @click.stop="dialog = true" v-else>
        Log In
      </v-btn>
<!--      <v-layout slot="extension">-->
<!--        <toolbar_extension></toolbar_extension>-->
<!--      </v-layout>-->
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt/>
      </v-container>
    </v-content>
    <v-dialog
      v-model="dialog"
      max-width="900"
    >
      <v-layout>
        <v-col cols="6" class="pa-0">
          <v-row
            class="ma-0"
            align="center"
            justify="center"
            style="height: 600px;"
          >
            <v-card class="rec-card fill-height">
              <v-img
                class="white--text fill-height align-end"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              >
                <v-card-title>Culture Brush</v-card-title>

                <v-card-text class="text--primary">
                  <div>Whitsunday Island, Whitsunday Islands</div>
                </v-card-text>
              </v-img>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="6" class="pa-0">
          <v-row
            class="ma-0"
            align="center"
            justify="center"
            style="width: 100%; height: 600px;background: white; color: black;font-size: 12px;"
          >
            <v-col cols="8">
              <v-row class="mb-4">
                <v-img src="/image/login_image.png"></v-img>
              </v-row>
              <v-row class="ma-4" justify="center">
                <p></p>
              </v-row>
              <v-row class="my-6" justify="center">
                <v-col cols="8" justify="center">
                  <v-img class="c-hand" src="/image/btn_google_signin.png" alt="구글로그인"
                         @click.stop="loginGoogle"></v-img>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-layout>
    </v-dialog>
  </v-app>
</template>

<script>
  import {mapActions} from 'vuex'
  import draggable from 'vuedraggable'
  import moment from 'moment'

  export default {
    components: {
      'toolbar_extension': require('~/components/toolbar_extension.vue').default,
      draggable
    },
    data () {
      return {
        fullPath: '',
        draggable_list: [],
        keyword: "",
        dialog: false,
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      },
      directories () {
        return this.$store.state.directories
      },
      drawerRight: {
        set: function (_set) {
        },
        get: function () {
          return this.$store.state.drawerRight
        }
      }
    },
    watch: {
      $route: function (_route) {
        this.fullPath = _route.fullPath
      }
    },
    methods: {
      moment: function (_date) {
        return moment(_date)
      },
      searchKeyword: function (e) {
        if (e.keyCode == 13) {
          if (this.fullPath.startsWith('/question')) {
            this.$router.push({path: `/question/`, query: {search: this.keyword}})
            this.keyword = ""
          } else if (this.fullPath.startsWith('/paper_list/my_evaluation')) {
            this.$router.push({path: `/paper_list/my_evaluation/`, query: {search: this.keyword}})
            this.keyword = ""
          } else if (this.fullPath.startsWith('/paper')) {
            this.$router.push({path: `/paper/`, query: {search: this.keyword}})
            this.keyword = ""
          } else if (this.fullPath.startsWith('/report')) {
            this.$router.push({path: `/report/`, query: {search: this.keyword}})
            this.keyword = ""
          } else if (this.fullPath.startsWith('/submitted_paper')) {
            this.$router.push({path: `/submitted_paper/`, query: {search: this.keyword}})
            this.keyword = ""
          }
        }
      },
      logoutGoogle: function () {
        window.gapi.auth2.getAuthInstance().signOut().then(function () {
          history.go(0)
        })
      },
      loginGoogle: function () {
        var updateSigninStatus = async (isSignedIn) => {
          if (isSignedIn) {
            var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4'
            window.gapi.client.load(discoveryUrl)
            let email = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail()
            let name = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName()
            let picture = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl()
            let _user = await this.getUser([`email: "${email}"`])
            this.setUser({
              id: (_user)? _user.id : null,
              name: name,
              email: email,
              is_admin: (_user)? _user.is_admin : false,
              profile: {
                picture: picture,
              }
            })
            this.dialog = false;
          } else {
            window.gapi.auth2.getAuthInstance().signIn().catch((error) => {
              if (error.error === 'popup_blocked_by_browser') {
                alert('팝업을 해제해주세요.')
              }
            })
          }
        }
        window.gapi.client.init({
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest'],
          clientId: this.$GOOGLE_KEY.clientID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile'
        }).then(function () {
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
          updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
        })
      },
      ...mapActions({
        setUser: 'setUser',
        getUser: 'getUser'
      })
    },
    mounted: function () {
      //window.gapi.load('client:auth2', this.loginGoogle)
      this.fullPath = this.$route.fullPath
    }
  }
</script>

<style lang="scss">
  .navigation-active {
    background-color: rgba(0, 0, 0, .05) !important;

    .list__tile__title {
      color: rgba(0, 0, 0, .87) !important;
      font-weight: 700;
    }
  }

  .list {

    .sortable-ghost {
      display: none;
    }
  }

  .rec-card{
    border-radius: 0;
  }
</style>

<style scoped lang="scss">
  .no-background {
    background-color: transparent;
  }

  /*html, body, div {*/
  /*  height: auto;*/
  /*}*/
</style>
