module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'CultureBrush',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '교육용 동영상 플랫폼' },
    ],
    script: [
      {src: 'https://apis.google.com/js/platform.js'},
      {src: 'https://apis.google.com/js/api.js'},
      {src: 'https://apis.google.com/js/client.js'},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {rel: 'stylesheet', href: '//cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css'},
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/plugins/vue-handsontable.js',
      'axios',
      'vue-vimeo-player'
    ],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  css: [
    '~/static/css/handsontable.full.css',
    '~/static/css/global.scss'
  ],
  plugins: [
    {src: '~/plugins/vue-konva.js', ssr: false},
    {src: '~/plugins/vue-handsontable.js', ssr: false},
    {src: '~/plugins/global.js', ssr: false},
    {src: '@/plugins/vue-awesome-swiper', mode: 'client'},
    { src: `~plugins/vue-vimeo-player`, ssr: false }
  ],
  modules: [
    ['@nuxtjs/vuetify']
  ],
  vuetify:{
    theme: {
      themes: {
        dark: {
          primary: "#5755d9",
          secondary: "#f1f1fc",
          accent: "#444291",
          error: "#f44336",
          warning: "#ffeb3b",
          info: "#2196f3",
          success: "#4caf50"
        }
      }
    }
  }
}

