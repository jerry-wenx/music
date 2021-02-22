<template>
  <div class="home">
    <!-- 推荐歌单 start -->
    <div class="recommend">
      <div class="head">推荐</div>
      <!-- 推荐歌单列表 -->
      <div class="list">
        <div
          class="item"
          v-for="val of recommendList"
          :key="val.id"
          @click="recommendDetail(val.id)"
        >
          <div class="img">
            <img class="auto-img" :src="val.picUrl" />
            <!-- 播放数量 -->
            <div class="count">
              <span class="change"
                ><img class="auto-img" src="../assets/images/play.png"
              /></span>
              {{ val.playCount | formatCount }}
            </div>
          </div>
          <!-- 文字描述 -->
          <div class="text">{{ val.name }}</div>
        </div>
      </div>
      <Loading v-show="recommendList.length <= 0 ? true : false" />
    </div>
    <!-- 推荐歌单 end -->

    <!-- 大家都在听 start -->
    <!-- :style="songId != '' ? 'margin-bottom: 100px' : 'margin-bottom: 50px'" -->
    <div
      class="hear"
      :style="playList != '' ? 'margin-bottom: 100px' : 'margin-bottom: 50px'"
    >
      <div class="head">
        大家都在听
        <!-- <span class="play" @click="changeStatus"
          ><span class="icon"
            ><img
              class="auto-img"
              :src="
                everyOneListen
                  ? require('../assets/images/suspend-fill.png')
                  : require('../assets/images/play-fill.png')
              " /></span
          >{{ everyOneListen ? "暂停" : "播放" }}</span
        > -->
      </div>
      <van-swipe :loop="false" :width="340" :show-indicators="false">
        <van-swipe-item v-for="(val, i) of hearList" :key="i">
          <div
            class="item"
            v-for="item of val"
            :key="item.id"
            @click="clickSong(item.id)"
          >
            <div class="img">
              <img class="auto-img" :src="item.picUrl" />
            </div>
            <div class="detail">
              <div class="name">{{ item.name }} {{ item.alias }}</div>
              <div class="songName">{{ item.artists }}</div>
            </div>
          </div>
        </van-swipe-item>
        <!-- <van-swipe-item></van-swipe-item> -->
      </van-swipe>
    </div>
    <!-- 大家都在听 end -->
    <MusicList :id="`${songSheetId}`" v-if="isShow" @isFalse="isShowFalse"/>
   
  </div>
</template>



<script>
// 导入组件
import Loading from "../components/Loading";
import MusicList from "../components/MusicList";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: { Loading, MusicList },
  data() {
    return {
      recommendList: [], // 推荐歌单列表
      showRecommend: false, // 推荐歌单显示
      hearList: [], // 大家都在听列表
      lastSongId: "", // 上一首歌的id
      sId: "",
      isShow: false, // 歌单歌曲
      recommendListIds: "", // 歌单音乐id列表
      listSong: [], //歌单歌曲列表
      songSheetId: '', // 歌单id
    };
  },

  filters: {
    formatCount(value) {
      return (value / 1000).toFixed(1) + "万";
    },
  },
  methods: {
    isShowFalse() {
      this.isShow = false;
    },
   
    // 加载事件
    onLoad() {
      // 异步更新数据
      // console.log("jiazaile");

      this.loading = false;

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true;
      //   }
    },

    // 歌单详情
    recommendDetail(id) {
      this.songSheetId = id;
      this.isShow = true;
   
    },


    // 点击大家都在听里面的歌曲 改变状态
    clickSong(songId) {
      console.log(songId);
      // this.$store.commit("addPlayList", this.hearListArr);
      this.sId = songId;
      // 如果点击是相同的一首歌就变成暂停或播放
      if (songId == this.lastSongId) {
        this.$store.commit("changeEveryOneListen", !this.everyOneListen);
        this.$store.commit("changeIsPlay", !this.isPlay);
      } else {
        this.$store.commit("getSongId", songId);
        this.$store.commit("changeEveryOneListen", true);
        this.$store.commit("changeIsPlay", true);
      }
      this.lastSongId = songId;
    },
    // 改变 大家都在听的 播放状态
    changeStatus() {
      this.$store.commit("changeEveryOneListen", !this.everyOneListen);
      this.$store.commit("changeIsPlay", !this.isPlay);
    },
    // 播放音乐方法
    playMusic(id) {
      console.log(id);
      this.axios
        .get("/song/url?id=33894312")
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    // 获取推荐歌单
    if (this.recommendList.length > 0) return;
    this.axios
      .get("/personalized?limit=6")
      .then((res) => {
        this.recommendList = res.data.result;
      })
      .catch((err) => {
        console.log(err);
      });

    // 获取每日推荐
    if (this.hearList.length > 0) return;
    this.axios
      .get("/personalized/newsong")
      .then((res) => {
        let arr = res.data.result;

        arr.forEach((v) => {
          let alias = "";
          let artists = "";
          v.song.alias.forEach((val) => {
            alias += val + "-";
          });
          v.song.artists.forEach((val) => {
            // console.log(val);
            artists += val.name + "-";
          });
          v.alias = alias.slice(0, -1);
          v.artists = artists.slice(0, -1);
        });
        // console.log("arr==>", arr);
        this.$store.commit("addPlayList", arr);
        let i = arr.length / 5;
        for (let k = 0; k < i; k++) {
          this.hearList.push(arr.slice(k * 5, (k + 1) * 5));
        }
        // console.log("this.hearList ==>", this.hearList);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  computed: {
    ...mapState(["isPlay", "playList", "everyOneListen", "songId"]),
  },
};
</script>



<style lang="less" scoped>
.home {
  .recommend {
    padding: 0 15px;
    height: 340px;
    .head {
      font-size: 16px;
      font-weight: bold;
      margin: 5px 0;
    }
    .list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .item {
        width: 32%;
        margin-bottom: 10px;

        .img {
          position: relative;
          width: 100%;
          height: 100px;
          img {
            border-radius: 10px;
          }
          .count {
            position: absolute;
            left: 2px;
            bottom: 0;
            padding: 5px;
            background-color: #999;
            border-radius: 10px;
            transform: translateY(50%);
            font-size: 12px;
            .change {
              display: inline-block;
              width: 15px;
              height: 15px;
              // background-color: red;

              vertical-align: middle;
              img {
                transform: translateY(-2px);
              }
            }
          }
        }
        .text {
          margin-top: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  // 大家都在听样式
  .hear {
    // margin-bottom: 100px;
    .head {
      font-size: 16px;
      font-weight: bold;
      margin: 5px 0;
      .play {
        display: inline-block;
        height: 21px;
        line-height: 21px;
        margin-left: 8px;
        padding: 0 6px;
        background-color: #9c9d9e;
        border-radius: 10px;
        font-size: 12px;
        // font-weight: 500;
        vertical-align: middle;
        .icon {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-top: -2px;
          // background-color: red;
          vertical-align: middle;
        }
      }
    }
    // background-color: pink;
    margin-top: 20px;
    // height: 200px;
    padding: 0 15px;
    /deep/ .van-swipe {
      // height: 160px;
      // background-color: skyblue;
      // /deep/.van-swipe-item { }
      .item {
        padding-bottom: 10px;
        display: flex;
        .img {
          width: 40px;
          height: 40px;
          border-radius: 5px;
          overflow: hidden;
        }
        .detail {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 10px;
          .songName {
            font-weight: 600;
          }
        }
      }
    }
  }

  
}
</style>