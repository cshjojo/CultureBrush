<template>
  <v-container class="pa-4">
    <v-row class="my-5" style="width: 100%" justify="start">
      <h1>Profile</h1>
    </v-row>
    <v-row class="my-10" style="width: 60%" align="center" justify="center">
      <v-col cols="6">
        <v-row justify="center">
          <v-avatar
            size="200">
            <img :src="user.profile.picture">
          </v-avatar>
        </v-row>
        <v-row class="my-8" justify="center">
          <v-btn @click="editProfile"
                 rounded
                 color="primary"
                 dark
                 class="mr-5"
          >
            <v-icon style="color: white">
              mdi-pencil
            </v-icon>
            Edit
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row class="mb-8" justify="start">
          <h1>{{user.name}}</h1>
        </v-row>
        <v-row class="ma-1" justify="start">
          <p>
            <v-icon class="theme--dark">mdi-email</v-icon>
            Email :
            {{user.email}}</p>
        </v-row>
        <v-row class="ma-1" justify="start">
          <p>
            <v-icon class="theme--dark">mdi-calendar-blank</v-icon>
            Birthday :</p>
        </v-row>
        <v-row class="ma-1" justify="start">
          <p>
            <v-icon class="theme--dark">mdi-map-marker</v-icon>
            Country :</p>
        </v-row>
      </v-col>
    </v-row>
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
      name: 'Thomas',
      email: 'asdwer@gmail.com',
      picture: 'https://lh3.googleusercontent.com/-5aWRMvla0Wo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucm4aMfO4gT4PkmjCGhWUcU8ecD-bg/s96-c/photo.jpg'
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
    editProfile: function () {
    },
    ...mapActions({
      setUser: 'setUser'
    })
  },
  mounted: async function () {
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

