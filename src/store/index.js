import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
  // plugins: [createPersistedState()],
  state: {
    //存放的键值对就是所要管理的状态
    callListNum: 0,
    aduitNum: 0,
    recommendNum: 0,
    interviewNum: 0,
    offerNum: 0,
    entryNum: 0,
    overInsuredNum: 0,
    obsoleteNum: 0

  },
  mutations: {
    //es6语法，等同edit:funcion(){...}
    callListNumIncrease(state) {
      state.callListNum++;
    },
    aduitNumIncrease(state) {
      state.aduitNum++;
    },
    recommendNumIncrease(state) {
      state.recommendNum++;
    },
    interviewNumIncrease(state) {
      state.interviewNum++;
    },
    offerNumIncrease(state) {
      state.offerNum++;
    },
    entryNumIncrease(state) {
      state.entryNum++;
    },
    overInsuredNumIncrease(state) {
      state.overInsuredNum++;
    },
    obsoleteNumIncrease(state) {
      state.obsoleteNum++;
    },
    callListDecrease(state) {
      if (state[payload] > 0) {
        state.callListNum--;
      }
    },
    aduitNumDecrease(state) {
      if (state[payload] > 0) {
        state.aduitNum--;
      }
    },
    recommendNumDecrease(state) {
      if (state[payload] > 0) {
        state.recommendNum--;
      }
    },
    interviewNumDecrease(state) {
      if (state[payload] > 0) {
        state.interviewNum--;
      }
    },
    offerNumDecrease(state) {
      if (state[payload] > 0) {
        state.offerNum--;
      }
    },
    entryNumDecrease(state) {
      if (state[payload] > 0) {
        state.entryNum--;
      }
    },
    overInsuredNumDecrease(state) {
      if (state[payload] > 0) {
        state.overInsuredNum--;
      }
    },
    obsoleteNumDecrease(state) {
      if (state[payload] > 0) {
        state.obsoleteNum--;
      }
    }
  }
})
// // vuex-persistedstate默认持久化所有state 若不需要全部则把需要持久化的数据放到reducer里 比如 showHttpLoading、unionId 需要持久化 userCode不需要则不需要加入
// const vuexPersisted = new CreatePersistedState({
//   key: 'VuexPersisted',
//   storage: window.sessionStorage,
//   // 可选择 localStorage、sessionStorage、cookie 看需求 
//   reducer: state => ({
//     // loading
//     // showHttpLoading: state.showHttpLoading,
//     // unionId
//     // unionId: state.unionId,
//   })
// })
export default store
