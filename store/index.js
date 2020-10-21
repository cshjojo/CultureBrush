import axios from "axios";
import Vue from 'vue';

export const state = () => ({
    user: null,
    history: null,
    drawerRight: false,
    table_page_num:1,
    row_num:20,
    parent: false,
    users: null,
    tests: null
})

export const mutations = {
    setUser: function (state, user) {
        state.user = user
    },
    setUsers: function (state, users) {
        state.users = users
    },
    setHistory: function (state, history) {
        state.history = history
    },
    setDrawerRight: function (state, _toggle) {
        state.drawerRight = _toggle
    },
    setTablePageNum:function(state,table_page_num){
        state.table_page_num=table_page_num
    },
    setParent: function(state, parent){
        state.parent = parent
    },
    setTests: function (state, val) {
        state.tests = val
    }
}

export const actions = {
    setUser ({commit}, query) {
        commit('setUser', query)
        /*if (query) {
            dispatch('getTests', [`email:"${query.email}"`])
            dispatch('test/setIsOwner', false)
        }*/
        return true
    },
    setUsers({commit}, query) {
        commit('setUsers', query)
        return true
    },
    setHistory({commit}, query) {
        commit('setHistory', query)
        return true
    },
    setDrawerRight ({commit}, query) {
        commit('setDrawerRight', query)
    },
    setTablePageNum({commit},query){
        commit('setTablePageNum',query)
    },
    setParent: function({commit}, query){
        commit('setParent', query)
    },
    async getUser ({commit, dispatch}, query) {
        let {data} = await axios.post(Vue.prototype.$api_url, {
            query: `{
              user(${query.join(',')}) {
                id name email is_admin is_superuser
               }
            }`
        })
        if (data.data.user) {
            // commit('setUser', data.data.user)
            return data.data.user
        }
        return false
    },
    async getUsers({commit, dispatch}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                        users {
                          id name email is_admin is_superuser
                        }
               }`
      })
      if (data.data.users) {
        return data.data.users
      }
      return false
    },
    async createUser({commit, dispatch}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                  create_user(${query.join(',')}){
                    id
                  }
               }`
      })
      if (data.data.create_user) {
        return true
      }
      return false
    },
    async updateUser({commit, dispatch}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                  update_user(${query.join(',')}){
                    id
                  }
               }`
      })
      if (data.data.update_user) {
        return true
      }
      return false
    },
    async deleteUser({commit, dispatch}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                    delete_user(${query.join(',')})
                 }`
      })
      if (data.data.delete_user) {
        return true
      }
      return false
    },
    async _login({commit, dispatch}, query) {
        let {data} = await axios.post(Vue.prototype.$api_url, {
            query: `{
  login_parent(${query.join(',')}) {
    id full_name email
    profile {
        picture
    }
  }
}`
        })
        if (data.data.login_parent) {
            // commit('setFolders', data.data.login_parent)
            data.data.login_parent.name = data.data.login_parent.full_name
            delete data.data.login_parent.full_name
            commit('setUser', data.data.login_parent)
            return true
        }
        return false
    },
    async checkAdmin({commit}, query) {
        let {data} = await axios.post(Vue.prototype.$api_url, {
            query: `{
  if_evaluation_admin(${query.join(',')})
}`
        })
        if (data.data.if_evaluation_admin)
            return true
        return false
    },
    async getTests ({commit, dispatch}, query) {
        let {data} = await axios.post(Vue.prototype.$api_url, {
            query: `{
        cognitive_tests(${query.join(",")}) {
          id title max_turn ordering width height json is_registered date_created result_length
        }
      }`
        })
        if (data.data.cognitive_tests) {
            commit('setTests', data.data.cognitive_tests)
            // dispatch('setDirectories', [{id: 0, title: '인지검사', to: '/cognitive/scene'}], {root: true})
            return true
        }
        return false
    },
    async getVideo({commit}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                    video(${query.join(',')}) {
                      id title description vimeo_id main_image
                      category1 category2 category3
                      Video_Awards {
                        id name
                      }
                      Video_Links {
                        id url
                      }
                    }
                  }`
      })
      if(data.data.video) {
        return data.data.video
      }
      return false
    },
    async getVideos({commit}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                  videos {
                    id title description vimeo_id main_image
                    category1 category2 category3
                    Video_Awards {
                      id name
                    }
                    Video_Links {
                      id url
                    }
                  }
                }`
      })
      if(data.data.videos) {
        return data.data.videos
      }
      return false
    },
    async createVideo({commit}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                  create_video(${query.join(',')}){
                    id
                  }
              }`
      })
      if(data.data.create_video) {
        return true
      }
      return false
    },
    async setVideo ({commit, state}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                  set_video(${query.join(',')}){
                    id
                  }
        }`
      })
      if(data.data.set_video) {
        return true
      }
      return false
    },
    async deleteVideo({commit}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                        delete_video(${query.join(',')})
                    }`
      })
      if(data.data.delete_video) {
        return true
      }
      return false
    },
    async getCategories({commit}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                    categories{
                      id name group
                    }
                }`
      })
      if(data.data.categories) {
        return data.data.categories
      }
      return false
    },
    async createCategory({commit}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                    create_category(${query.join(',')}){
                      id
                    }
                }`
      })
      if(data.data.create_category) {
        return true
      }
      return false
    },
    async setCategory({commit}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                      set_category(${query.join(',')}){
                        id
                      }
                  }`
      })
      if(data.data.set_category) {
        return true
      }
      return false
    },
    async deleteCategory({commit}, query) {
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
                      delete_category(${query.join(',')}){
                        id
                      }
                  }`
      })
      if(data.data.delete_category) {
        return true
      }
      return false
    }
}
