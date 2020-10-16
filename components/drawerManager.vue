<template>
  <v-navigation-drawer permanent app clipped width="200">
    <v-list dense nav>
      <v-list-item link @click.stop="linkUrl(`/scene`)">
        <v-list-item-action>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>My Experiment</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click.stop="linkUrl(`/user`)">
        <v-list-item-action>
          <v-icon>mdi-account</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click.stop="linkUrl(`/group`)">
        <v-list-item-action>
          <v-icon>mdi-account-supervisor</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Groups</v-list-item-title>
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
  methods: {
    linkUrl: function (url) {
      this.$router.push({path: url})
    },
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
