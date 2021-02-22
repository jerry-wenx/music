import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isPlay: false, // 底部播放器 播放暂停
    hearPlay: false,
    songId: '', // 首次进入的第一首歌曲id
    playList: '', // 播放列表
    everyOneListen: false // 大家都在听的播放暂停
    
  },
  mutations: {
    // 切换状态
    changeIsPlay(state, data) {
      state.isPlay =  data;
    },
    // 大家都在听的判断
    changeHearIsPlay(state, data) {
      state.hearPlay =  data;
    },
    getSongId(state, data) {
      state.songId = data;
    },
    // 播放列表歌曲
    addPlayList(state, data) {
      state.playList = "";
      state.playList = data;
    },
    changeEveryOneListen(state, data) {
      state.everyOneListen = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
