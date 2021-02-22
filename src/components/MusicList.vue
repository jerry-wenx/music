<template>
  <div class="music-list-box">
    <!-- 歌单弹出层 -->
    <div class="recommend-musicList">
      <van-popup
        v-model="showRecommend"
        position="right"
        :style="{ height: '100%', width: '100%' }"
      >
        <div class="bg bg-blur">
          <img class="auto-img" :src="userInfo.bgurl" />
        </div>
        <div class="top-box">
          <!--  -->

          <div class="top" @click="$emit('isFalse')">
            <div class="return" @click="returnHome">
              <img class="auto-img" src="../assets/images/return.png" />
            </div>
            <div class="text">歌单</div>
          </div>
          <div class="top-main">
            <div class="main-left">
              <img class="auto-img" :src="userInfo.bgurl" />
              <div class="count">{{ userInfo.count }}</div>
            </div>
            <div class="main-right">
              <div class="title">{{ userInfo.name }}</div>
              <div class="user">
                <div class="head-img">
                  <img class="auto-img" :src="userInfo.url" />
                </div>
                <div class="nickname">{{ userInfo.nickname }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 歌单歌曲列表 -->
        <div class="list-main" v-show="listSong.length > 0 ? true : false">
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="5"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <ul>
              <li
                v-for="(item, i) of listSong"
                :key="i"
                @click="clickSong(item.id)"
              >
                <div class="li-left">{{ i + 1 }}</div>
                <div class="li-right">
                  <div class="name">{{ item.name }}</div>
                  <div class="detail">{{ item.singer }} - {{ item.name }}</div>
                </div>
              </li>
            </ul>
          </van-list>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      showRecommend: false,
      loading: false, // 列表刷新
      finished: false, // 列表刷新完成
      indexs: 1, // 加载歌曲时的第几次
      userInfo: {}, // 歌单用户信息
      listSong: [], //歌单歌曲列表
      sId: "",
      lastSongId: "",
      recommendListIds: [],
    };
  },

  methods: {
    returnHome() {
      this.showRecommend = false;
    },
    // 加载事件
    onLoad() {
      // 异步更新数据
      console.log("jiazaile");
      this.getMusicList();
      this.loading = false;

      //   // 数据全部加载完成
        if (this.listSong.length >= this.recommendListIds.length) {
          this.finished = true;
        }
    },

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
    // 歌单详情
    async recommendDetail(id) {
      // console.log(id);
      this.showRecommend = true;
      // this.axios.defaults.baseURL = "http://musicapi.leanapp.cn"; //临时改变请求baseURL
      await this.axios
        .get("/playlist/detail?id=" + id)
        .then((res) => {
          // console.log(res);
          this.userInfo.name = res.data.playlist.name;
          this.userInfo.bgurl = res.data.playlist.coverImgUrl;
          this.userInfo.url = res.data.playlist.creator.avatarUrl;
          this.userInfo.count = res.data.playlist.playCount;
          this.userInfo.nickname = res.data.playlist.creator.nickname;

          this.recommendListIds = res.data.playlist.trackIds;
          // console.log(this.recommendListIds);
        })
        .catch((err) => {
          console.log(err);
        });
      // this.axios.defaults.baseURL = "http://music.kele8.cn"; // 改回来

      await this.getMusicList();
    },
    // 获取歌单里的音乐
    getMusicList() {
      let arr = this.recommendListIds.slice(
        (this.indexs - 1) * 20,
        this.indexs * 20
      );

     
     
      let ids = "";
      arr.forEach((v) => {
        // console.log(v);
        ids += v.id + ",";
      });
      ids = ids.slice(0, -1);
      // console.log(ids);

      this.$axios.get("/song/detail?ids=" + ids).then((res) => {
        // console.log(res);
        let obj = res.data.songs;
        // console.log(obj);
        obj.forEach((v) => {
          let obj = {};
          obj.name = v.name;
          obj.singer = v.ar[0].name;
          obj.id = v.id;
          this.listSong.push(obj);
        });

        // console.log(this.listSong);
      });
       this.$store.commit("addPlayList", this.listSong);
    },
  },
  created() {
    this.recommendDetail(this.id);
  },
};
</script>

<style lang="less" scoped>
.recommend-musicList {
  .bg {
    height: 150px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    // height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .top-box {
    position: relative;
    .top {
      display: flex;
      padding: 6px 15px;
      margin-bottom: 20px;
      .return {
        width: 25px;
        height: 25px;
      }
      .text {
        flex: 1;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .top-main {
      width: 80%;
      height: 120px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .main-left {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 10px;
        overflow: hidden;
        .count {
          position: absolute;
          width: 90%;

          bottom: 0px;
          background-color: rgba(0, 0, 0, 0.5);
          color: #fff;
          margin: 0 5px;
          text-align: right;
        }
      }
      .main-right {
        width: 60%;
        .title {
          font-size: 16px;
          font-weight: bold;
          color: #ccc;
        }
        .user {
          display: flex;
          line-height: 25px;
          margin-top: 8px;
          color: #ccc;
          .head-img {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 5px;
          }
          .nickname {
            width: 120px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .list-main {
    ul {
      padding: 0 15px;
      li {
        display: flex;
        padding: 5px 0;
        .li-left {
          width: 20px;
          line-height: 30px;
          font-size: 16px;
          text-align: center;
          margin-right: 20px;
        }
        .li-right {
          .name {
            font-size: 16px;
          }
          .detail {
            color: #999;
          }
        }
      }
    }
  }
}
</style>