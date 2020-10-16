<template>
  <v-app>
    <v-container>
      <div class="ma-12"></div>
      <h1><i class="xi-school" style="font-size: 15rem;"></i></h1>
      <div class="ma-1"></div>
      <h2>
        Culture Brush
      </h2>
      <div class="ma-8"></div>
      <v-row>
<!--        <v-form style="display: flex; flex-direction: column; align-items: center;" ref="form_login" v-model="is_valid" lazy-validation>-->
<!--          <v-text-field type="text" v-model="email" label="이메일" :rules="rules_email" outlined clearable required></v-text-field>-->
<!--          <v-text-field type="password" v-model="password" label="비밀번호" :rules="rules_password" outlined clearable required-->
<!--                        @keyup.enter="login"></v-text-field>-->
<!--          <v-btn color="primary" @click.stop="login" :disabled="!is_valid">로그인</v-btn>-->
<!--        </v-form>-->
        <v-img class="c-hand" src="/image/btn_google_signin.png" alt="구글로그인" @click.stop="loadGoogle"></v-img>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: '',
      is_valid: false,
      rules_email: [
        (val) => val !== '' || 'Please input your email.'
      ],
      rules_password: [
        (val) => val !== '' || 'Please input your password.'
      ]
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
    login: async function () {
      if (this.$refs.form_login.validate()) {
        let {data} = await axios.post(this.$api_url, {
          query: `{
            login_cognitive(email:"${this.email}", password:"${this.password}") {
              id email name etc
            }
          }`
        })
        if (data.data.login_cognitive) {
          this.setUser(data.data.login_cognitive)
          this.$router.push({path: this.goto})
        } else {
          alert('Log in unsuccessful.\nPlease check your password.  ')
          return false
        }
      }
    },
    loadGoogle: async function () {
      //window.gapi.load('client:auth2', this.loginGoogle)
      this.setUser({
        name: 'test',
        email: 'test@test.com'
      })
      /*if (this.goto.startsWith('/scene')) {
        alert('Not a registered user.')
        return false
      }*/
      this.linkUrl(this.goto)
    },
    loginGoogle: function () {
      window.gapi.client.init({
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest'],
        clientId: this.$GOOGLE_KEY.clientID,
        scope: 'https://www.googleapis.com/auth/drive'
      }).then(() => {
        window.gapi.auth2.getAuthInstance().signIn().then(async (googleUser) => {
          let profile = googleUser.getBasicProfile()
          let user = await this.getCognitiveUser(profile.getEmail())
          if (user) {
            this.setUser(user)
            this.linkUrl(`/scene`)
          } else {
            this.setUser({
              name: profile.getName(),
              email: profile.getEmail()
            })
            if (this.goto.startsWith('/scene')) {
              alert('Not a registered user.')
              return false
            }
            this.linkUrl(this.goto)
          }
        }).catch((error) => {
          if (error.error === 'popup_blocked_by_browser') {
            alert('Please allow the popup.')
          }
        })
      })
    },
    getCognitiveUser: async function (email) {
      let {data} = await axios.post(this.$api_url, {
        query: `{
          cognitive_user(email:"${email}") {
            id name email etc
          }
        }`
      })
      return data.data.cognitive_user
    },
    ...mapActions({
      setUser: 'setUser'
    })
  },
  mounted: function () {
    // if (this.user) {
    //   this.$router.push({path: '/scene'})
    // }
  }
}
</script>

<style lang="scss" scoped>
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

