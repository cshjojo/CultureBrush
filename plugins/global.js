import os from 'os';
import Vue from 'vue';

if (os.hostname().includes('15.164.104.197') || os.hostname().includes('172.30.1.39') || os.hostname() === 'localhost') {
  console.log("@@@@@@@@@@@@@@TESTSERVER@@@@@@@@@@@@@@@")
  Vue.prototype.$GOOGLE_KEY = {
    oauthID: 'AIzaSyDdbI5SM3yBa_ZAztfKFNWRyBIV1HDQdBU',
    clientID: '430483591498-c0cltc6gp3n50ls6sh7tbcjjsasbctvu.apps.googleusercontent.com'
  }

  Vue.prototype.$api_url = 'http://13.209.125.186:8080/'
  Vue.prototype.$socket_url = 'ws://13.209.125.186:8000/'
  Vue.prototype.$media_url = 'http://13.209.125.186:8080/media/'
  /*Vue.prototype.$api_url = 'http://115.68.230.12:8000/'
  Vue.prototype.$socket_url = 'ws://115.68.230.12:8000/'*/
}else{
  Vue.prototype.$GOOGLE_KEY = {
    oauthID: 'AIzaSyDdbI5SM3yBa_ZAztfKFNWRyBIV1HDQdBU',
    clientID: '430483591498-c0cltc6gp3n50ls6sh7tbcjjsasbctvu.apps.googleusercontent.com'
  }

  Vue.prototype.$api_url = 'http://13.209.125.186:8080/'
  Vue.prototype.$socket_url = 'ws://13.209.125.186:8080/'
  Vue.prototype.$media_url = 'http://13.209.125.186:8080/media/'
}
// else {
//   console.log("@@@@@@@@@@@@@@SERVER@@@@@@@@@@@@@@@")
//   // 본서버
//   Vue.prototype.$GOOGLE_KEY = {
//     oauthID: 'AIzaSyDdWIJRDvw9arQGYTBrvfAGBCxbqmBr0AY',
//     clientID: '727500411038-1j20shd1e8uoorr13p2ap437q57t46hv.apps.googleusercontent.com'
//   }
//
// Vue.prototype.$GOOGLE_KEY = {
//   oauthID: 'AIzaSyDdbI5SM3yBa_ZAztfKFNWRyBIV1HDQdBU',
//   clientID: '980479432460-aq9fn2kremi0ofa8allrk9aopdb7sir6.apps.googleusercontent.com'
// }
//   Vue.prototype.$api_url = 'http://13.209.77.66:8000/'
//   Vue.prototype.$socket_url = 'ws://13.209.77.66:8000/'
//   /*Vue.prototype.$api_url = 'https://api.rootall.org/'
//   Vue.prototype.$socket_url = 'wss://api.rootall.org/'*/
// }
