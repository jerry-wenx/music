<template>
  <div class="build">
    <div class="bg">
      <span></span>
      <p>更新日期: {{ updateDate | formatDate }}</p>
    </div>

    <!-- 歌单歌曲列表 -->
    <div class="list-main" v-show="hotMusicList.length > 0 ? true : false">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="5"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ul>
          <li
            v-for="(item, i) of hotMusicList"
            :key="i"
            @click="clickSong(item.id)"
          >
            <div class="li-left">{{ i + 1 }}</div>
            <div class="li-right">
              <div class="name">{{ item.name }}</div>
              <div class="detail">
                {{ item.song.album.name }} - {{ item.name }}
              </div>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updateDate: new Date(),
      num: 1,
      loading: false, // 列表刷新
      finished: false, // 列表刷新完成
      listSong: [],
      allsongIds: "",
      hotMusicList: [],
    };
  },
  methods: {
    loadingSong() {
      let musicids = [];
      this.$axios
        .get("/top/list?idx=1")
        .then((data) => {
          // console.log("榜单----->",data);
          this.updateDate = data.data.playlist.updateTime;
          // console.log('榜单----->',data);
          this.allsongIds = data.data.playlist.trackIds;
          musicids = this.allsongIds.slice((this.num - 1) * 20, this.num * 20);
          // console.log(musicids);
        })
        .then(() => {
          // leanp的接口

          // console.log("还没加数据的长度——————>",vm.hotMusicList.length);
          for (let item of musicids) {
            // console.log(item.id);取到没项的id
            this.$axios.get("/song/detail?ids=" + item.id).then((data) => {
              // console.log(data.data.songs[0]);

              this.hotMusicList.push({
                name: data.data.songs[0].name,
                id: data.data.songs[0].id,
                song: {
                  privilege: data.data.privileges[0],
                  artists: [{ name: data.data.songs[0].name }],
                  album: {
                    name: data.data.songs[0].ar[0].name,
                  },
                },
                key: parseInt(this.hotMusicList.length) + 1,
              });
            });
          }
          // console.log(this.hotMusicList);
          this.$store.commit("addPlayList", this.hotMusicList);
          // console.log("加了数据数据以后的长度——————>",parseInt(vm.hotMusicList.length));
        });
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
    // 加载事件
    onLoad() {
      // 异步更新数据
      // console.log("jiazaile");
      this.loadingSong();
      this.loading = false;

      //   // 数据全部加载完成
      if (this.hotMusicList.length >= this.allsongIds.length) {
        this.finished = true;
      }
    },
  },
  created() {
    this.loadingSong();
  },
  filters: {
    formatDate(val) {
      let datatime = new Date(val);
      let m = datatime.getMonth() + 1;
      m = m > 10 ? m : "0" + m;
      let d = datatime.getDate();
      d = d > 10 ? d : "0" + d;
      return m + "月 " + d + "日";
    },
  },
};
</script>

<style lang="less" scoped>
.build {
  .bg {
    width: 100%;
    height: 145px;
    background: url("../assets/images/bg.png");
    overflow: hidden;
    background-size: cover;
    span {
      display: block;
      margin: 30px 0 0 225px;
      width: 142px;
      height: 70px;
      // background-color: red;
      background: url("../assets/images/bofang.png") no-repeat -21px -28px;
      background-size: 166px 97px;
    }
    p {
      margin-top: 3px;
      font-size: 12px;
      color: #fff;
      text-align: right;
      margin-right: 12px;
    }
  }
  .list-main {
    ul {
      padding: 0 15px;
      margin-bottom: 55px;
      margin-top: 15px;
      li {
        display: flex;
        padding: 5px 0;
        &:nth-child(-n + 5) {
          .li-left {
            color: red;
          }
        }
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