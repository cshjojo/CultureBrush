import Vue from 'vue'
import axios from 'axios'

export const state = () => ({
  test: null,
  is_owner: false,
  scenes: {},
  scene_ids: [],
  curr_scene: null,
  connectors: {},
  elements: {},
  data: [],
  result: []
})

export const mutations = {
  setTest: function (state, val) {
    state.test = val
  },
  setTestJson: function (state, val) {
    Vue.set(state.test, 'json', val)
  },
  setIsOwner: function (state, val) {
    state.is_owner = val
  },
  setScenes: function (state, val) {
    state.scenes = val
  },
  setScene: function (state, val) {
    Vue.set(state.scenes, val.id, val)
  },
  deleteScene: function (state, val) {
    Vue.delete(state.scenes, val)
  },
  setSceneIds: function (state, val) {
    state.scene_ids = val
  },
  insertSceneId: function (state, val) {
    state.scene_ids.push(val)
  },
  deleteSceneId: function (state, val) {
    let idx = state.scene_ids.indexOf(val)
    if (idx !== -1) state.scene_ids.splice(idx, 1)
  },
  setCurrScene: function (state, val) {
    state.curr_scene = val
  },
  setConnectors: function (state, val) {
    state.connectors = val
  },
  setConnector: function (state, val) {
    Vue.set(state.connectors, val.id, val)
  },
  deleteConnector: function (state, val) {
    Vue.delete(state.connectors, val)
  },
  deleteConnectors: function (state, val) {
    for (let _id of val) {
      if (state.connectors[_id]) Vue.delete(state.connectors, _id)
    }
  },
  setElements: function (state, val) {
    state.elements = val
  },
  setElement: function (state, val) {
    Vue.set(state.elements, val.id, val)
  },
  deleteElement: function (state, val) {
    Vue.delete(state.elements, val)
  },
  deleteElements: function (state, val) {
    for (let _id of val) {
      if (state.elements[_id]) Vue.delete(state.elements, _id)
    }
  },
  setData: function (state, val) {
    state.data = val
  },
  setResult: function (state, val) {
    if (val.result && typeof val.result === 'string') val.result = JSON.parse(val.result)
    state.result = val
  }
}

export const actions = {
  setTest ({commit, rootState}, query) {
    if (query.json) {
      if (typeof query.json === 'string') {
        query.json = JSON.parse(query.json)
      }
      if (query.json.scenes) commit('setScenes', query.json.scenes)
      if (query.json.scene_ids) commit('setSceneIds', query.json.scene_ids)
      if (query.json.connectors) commit('setConnectors', query.json.connectors)
      if (query.json.elements) commit('setElements', query.json.elements)
      if (query.json.data) commit('setData', query.json.data)
    }
    if (rootState.user && query.user) {
      commit('setIsOwner', Number(rootState.user.id) === Number(query.user.id))
    }
    commit('setTest', query)
    return true
  },
  async getTest ({commit, rootState, dispatch}, query) {
    let {data} = await axios.post(Vue.prototype.$api_url, {
      query: `{
        cognitive_test(${query.join(',')}) {
          id title max_turn ordering width height json
          user {
            id email name etc
          }
        }
      }`
    })
    if (data.data.cognitive_test) {
      dispatch('setTest', data.data.cognitive_test)
      return true
    }
    return false
  },
  async saveJson ({commit, state}, query) {
    if (state.test) {
      let json = JSON.parse(JSON.stringify(query))
      if (typeof json === 'string') json = JSON.parse(json)
      delete json.test
      delete json.id
      delete json.curr_scene
      delete json.result
      delete json.is_owner
      if (!json.json) json = {json: json}
      commit('setTestJson', json)
      let {data} = await axios.post(Vue.prototype.$api_url, {
        query: `{
          set_cognitive_test(id:${state.test.id}, settings:${JSON.stringify(JSON.stringify(json))}) {
            id
          }
        }`
      })
      return !!data.data.set_cognitive_test
    }
    return false
  },
  setIsOwner ({commit}, query) {
    commit('setIsOwner', query)
    return true
  },
  setScenes ({commit, state, dispatch}, query) {
    commit('setScenes', query)
    dispatch('saveJson', state)
    return true
  },
  setScene ({commit, state, dispatch}, query) {
    commit('setScene', query)
    dispatch('saveJson', state)
    return true
  },
  insertScene ({commit, state, dispatch}, query) {
    if (query.id) {
      commit('setScene', query)
      commit('insertSceneId', query.id)
      dispatch('saveJson', state)
      return true
    }
  },
  deleteScene ({commit, state, dispatch}, query) {
    if (state.scenes[query]) {
      commit('deleteElements', state.scenes[query].elements)
      let _connectors = {}
      for (let cnId in state.connectors) {
        let connector = state.connectors[cnId]
        if (connector.to === query || connector.from === query) {
          _connectors[cnId] = true
        }
      }
      commit('deleteConnectors', Object.keys(_connectors))
      commit('deleteSceneId', query)
      commit('deleteScene', query)
      dispatch('saveJson', state)
    }
  },
  setSceneTitle ({commit, state, dispatch}, query) {
    if (query.id && query.title && state.scenes[query.id]) {
      commit('setScene', {...state.scenes[query.id], ...{title: query.title}})
      dispatch('saveJson', state)
      return true
    }
  },
  setSceneIds ({commit, state, dispatch}, query) {
    commit('setSceneIds', query)
    dispatch('saveJson', state)
    return true
  },
  setCurrScene ({commit, state, dispatch}, query) {
    commit('setCurrScene', query)
    dispatch('saveJson', state)
    return true
  },
  setConnectors ({commit, state, dispatch}, query) {
    commit('setConnectors', query)
    dispatch('saveJson', state)
    return true
  },
  setConnector ({commit, state, dispatch}, query) {
    commit('setConnector', query)
    dispatch('saveJson', state)
    return true
  },
  insertConnector ({commit, state, dispatch}, query) {
    if (query.id) {
      commit('setConnector', query)
      dispatch('saveJson', state)
      return true
    }
  },
  deleteConnector ({commit, state, dispatch}, query) {
    commit('deleteConnector', query)
    dispatch('saveJson', state)
    return true
  },
  setElements ({commit, state, dispatch}, query) {
    commit('setElements', query)
    dispatch('saveJson', state)
    return true
  },
  setElement ({commit, state, dispatch}, query) {
    commit('setElement', query)
    dispatch('saveJson', state)
    return true
  },
  updateElements ({commit, state, dispatch}, query) {
    if (query.elements && query.scene && state.scenes[query.scene]) {
      if (query.deleted && query.deleted.length > 0) {
        let relatedConnectors = {}
        for (let cnId in state.connectors) {
          let conn = state.connectors[cnId]
          if (conn.connect_type === 'button') {
            relatedConnectors[conn.button_id] = cnId
          }
        }
        for (let _id of query.deleted) {
          commit('deleteElement', _id)
          if (relatedConnectors[_id]) {
            commit('deleteConnector', relatedConnectors[_id])
          }
        }
      }
      commit('setElements', {...state.elements, ...query.elements})
      let _scene = JSON.parse(JSON.stringify(state.scenes[query.scene]))
      _scene.elements = query.element_ids
      commit('setScene', _scene)
      dispatch('saveJson', state)
      return true
    }
  },
  addElement ({commit, state, dispatch}, query) {
    if (query.id && query.scene && state.scenes[query.scene]) {
      commit('setElement', query)
      let _scene = JSON.parse(JSON.stringify(state.scenes[query.scene]))
      _scene.elements.push(query.id)
      commit('setScene', _scene)
      dispatch('saveJson', state)
      return true
    }
  },
  deleteElement ({commit, state, dispatch}, query) {
    if (state.elements[query.id]) {
      let _scene = JSON.parse(JSON.stringify(state.scenes[query.scene]))
      if (_scene) {
        let idx = _scene.elements.indexOf(query.id)
        if (idx > -1) {
          _scene.elements.splice(idx, 1)
          commit('setScene', _scene)
          commit('deleteElement', query.id)
          dispatch('saveJson', state)
          return true
        }
      }
    }
  },
  setData ({commit, state, dispatch}, query) {
    commit('setData', query)
    dispatch('saveJson', state)
    return true
  },
  async setResult ({commit, state}, query) {
    let {data} = await axios.post(Vue.prototype.$api_url, {
      query: `{
        set_cognitive_test_result(id: ${query.id}, result:${JSON.stringify(JSON.stringify(query.result))}) {
          id result email          
        }
      }`
    })
    if (data.data.set_cognitive_test_result) {
      commit('setResult', data.data.set_cognitive_test_result)
    }
    return true
  },
  async getResult ({commit, state, dispatch}, query) {
    let {data} = await axios.post(Vue.prototype.$api_url, {
      query: `{
        cognitive_test_result(${query.join(',')}) {
          id result email          
        }
      }`
    })
    if (data.data.cognitive_test_result) {
      commit('setResult', data.data.cognitive_test_result)
      return true
    }
    return false
  }
}
