<template>
  <v-navigation-drawer permanent app clipped width="200">
    <v-list-item color="primary">
      <v-list-item-content>
        <v-list-item-title class="title" @click.stop="linkUrl(back_url)">
          <v-icon style="cursor: pointer;">xi-arrow-left</v-icon>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list dense nav>
<!--      <v-list-item link @click.stop="linkUrl(`/`)">-->
<!--        <v-list-item-action>-->
<!--          <v-icon>mdi-home</v-icon>-->
<!--        </v-list-item-action>-->
<!--        <v-list-item-content>-->
<!--          <v-list-item-title>홈</v-list-item-title>-->
<!--        </v-list-item-content>-->
<!--      </v-list-item>-->
      <v-list-item link @click.stop="linkUrl(`/scene`)">
        <v-list-item-action>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>My Experiment</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click.stop="linkUrl(`/data/${test.id}`)" v-if="is_owner">
        <v-list-item-action>
          <v-icon>mdi-table-large</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Stimuli DB Sheet</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click.stop="linkUrl(`/result/${test.id}`)" v-if="is_owner">
        <v-list-item-action>
          <v-icon>mdi-file-document-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Results DB</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn outlined width="100%" @click.stop="logout">
          <v-icon>xi-log-out</v-icon> Log-Out
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  props: ['linkUrl'],
  computed: {
    test () { return this.$store.state.test.test },
    is_owner () { return this.$store.state.test.is_owner },
    back_url () {
      if (this.test) {
        if (this.$route.fullPath.startsWith('/scene')) return `/scene`
        return `/scene/${this.test.id}`
      }
      return `/scene`
    }
  },
  methods: {
    logout: function () {
      if (!confirm('Would you like to log out?')) return false
      // if (window.gapi) {
      //   window.gapi.auth2.getAuthInstance().signOut().then(() => {
      //     this.setUser(null)
      //     this.linkUrl(`/login`)
      //   }).catch(() => {
      //     this.setUser(null)
      //     this.linkUrl(`/login`)
      //   })
      // }
      this.setUser(null)
      this.linkUrl(`/login`)
    },
    ...mapActions({
      setUser: 'setUser'
    })
  }
}
</script>
