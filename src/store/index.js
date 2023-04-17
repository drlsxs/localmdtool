import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dictoryTree: [], //资源目录树形数据
  },
  getters: {
  },
  mutations: {
    setdictoryTree(state, val) {
      state.dictoryTree = val;
    },
  },
  actions: {
  },
  modules: {
  }
})
