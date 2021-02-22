<template>
  <div class="search">
    <div class="search-box">
      <van-search
        v-model="value"
        @input="onInput"
        placeholder="搜索歌曲、歌手、专辑 "
      />
    </div>
    <div class="history" v-show="!show">
      <div class="title">
        搜索历史
        <div class="del" @click="del">
          <img src="../assets/images/delte.png" class="auto-img" />
        </div>
      </div>
      <div class="items">
        <div class="item" v-for="(v, i) of arr" :key="i" @click="search(v)">
          {{ v }}
        </div>
      </div>
    </div>
    <div class="hot-search" v-show="!show">
      <div class="title">热门搜索</div>
      <div class="hot-list">
        <div
          class="item"
          v-for="(val, i) of hotSearch"
          :key="i"
          @click="search(val.first)"
        >
          <div class="order">{{ i + 1 }}</div>
          <div class="right">
            <div class="name">{{ val.first }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索出来的数据 -->
    <div class="search-data" v-show="show">
      <!-- 专辑 -->
      <div class="albums" v-if="albums">
        <div class="title">为您推荐</div>
        <div class="albums-list">
          <div
            class="album"
            v-for="item of albums"
            :key="item.id"
            @click="getMusic(item.id)"
          >
            <div class="album-img">
              <img class="auto-img" :src="item.artist.picUrl" />
            </div>
            <div class="detail">
              <div class="type">专辑</div>
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artist.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 歌曲 -->
      <div class="songs" v-if="songs">
        <div class="title">歌曲</div>
        <div class="song-list">
          <div
            class="song"
            v-for="val of songs"
            :key="val.id"
            @click="clickSong(val.id)"
          >
            <div class="song-name">{{ val.name }}</div>
            <div class="song-singer">
              {{ val.artists[0].name }}-{{ val.name }}
            </div>
            <div
              class="song-detail"
              v-show="val.alias.length == 0 ? false : true"
            >
              {{ val.alias[0] }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 歌单弹出层 -->
    <div class="musicList">
      <van-popup
        v-model="showList"
        position="right"
        :style="{ height: '100%', width: '100%' }"
      >
        <div class="top-box">
          <img class="auto-img" :src="bgurl" />
          <div class="top">
            <div class="return" @click="returns">
              <img class="auto-img" src="../assets/images/return.png" />
            </div>
          </div>
          <div class="top-main"></div>
        </div>

        <!-- 歌单歌曲列表 -->
        <div class="list-main" v-show="song.length > 0 ? true : false">
          <ul>
            <li v-for="(item, i) of song" :key="i" @click="clickSong(item.id)">
              <div class="li-left">{{ i + 1 }}</div>
              <div class="li-right">
                <div class="name">{{ item.name }}</div>
                <div class="detail">
                  {{ item.ar[0].name }} - {{ item.name }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      hotSearch: [], // 热门搜索的数据
      timer: null,
      show: false,
      albums: "", // 专辑
      songs: "", // 歌曲
      sId: "",
      lastSongId: "",
      showList: false, //显示弹出层
      bgurl: "",
      song: [],
      localhost: [], // 搜索记录
      arr: [],
    };
  },

  created() {
    this.arr = JSON.parse(localStorage.getItem("key"));
    this.axios.get("/search/hot").then((data) => {
      this.hotSearch = data.data.result.hots;
    });
  },
  methods: {
    del() {
      localStorage.removeItem("key");
      this.arr = [];
      this.localhost = [];
    },
    returns() {
      this.showList = false;
    },
    onInput(val) {
      if (val == "") {
        this.albums = "";
        this.songs = "";
        this.show = false;
        return;
      }
      this.show = true;
      clearInterval(this.timer);
      this.timer = null;
      this.timer = this.request(val);
    },
    request(val) {
      // if(this.arr.length > 0) {
      //   this.localhost = this.arr;
      // }
      if (!this.arr) {
        this.localhost.push(val);
        localStorage.setItem("key", JSON.stringify(this.localhost));
      } else {
        for (let i = 0; i < this.arr.length; i++) {
          if (val.indexOf(this.arr[i]) > -1) {
            console.log(i, val);
            
            // this.arr.splice(i,1);
            // this.arr.pop(val);
            break;
          } else {
            console.log(111);
            this.localhost.push(val);
            localStorage.setItem("key", JSON.stringify(this.localhost));
          }
        }
      }

      setTimeout(() => {
        this.axios.get("/search/suggest?keywords=" + val).then((res) => {
          // console.log(res.data.result);
          let data = res.data.result;
          this.albums = data.albums;
          this.songs = data.songs;
        });
      }, 200);
      this.arr = JSON.parse(localStorage.getItem("key"));
    },
    getMusic(id) {
      console.log(id);
      this.axios.get("/album?id=" + id).then((res) => {
        console.log(res.data.songs);
        this.bgurl = res.data.album.blurPicUrl;
        this.song = res.data.songs;
        console.log(this.bgurl);
      });
      this.showList = true;
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
    search(val) {
      this.value = val;
      this.show = true;
      this.request(val);
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  overflow: hidden;
  margin-bottom: 20px;
  .title {
    font-size: 14px;
    font-weight: 700;
    margin-top: 15px;
  }
  .history {
    padding: 0 15px;
    .del {
      float: right;
      width: 20px;
      height: 20px;
    }
    .items {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      .item {
        padding: 3px 5px;
        background-color: #ddd;
        margin: 0 5px;
        margin-bottom: 4px;
      }
    }
  }
  .hot-search {
    padding: 10px 15px;
    // background-color: rgb(247, 243, 243);
    .hot-list {
      padding-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        line-height: 40px;
        display: flex;
        width: 45%;
        margin-top: 5px;
        &:nth-child(-n + 4) {
          .order {
            color: red;
          }
        }
        .order {
          width: 22px;
          height: 40px;
          text-align: center;
          font-size: 16px;
          margin-right: 7px;
          //   background-color: blue;
        }
        .right {
          flex: 1;
          .div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .name {
            font-size: 14px;
          }
        }
      }
    }
  }
  .search-data {
    padding: 0 15px;
    .albums {
      .title {
        font-size: 12px;
        font-weight: normal;
        color: #999;
      }
      .albums-list {
        margin-top: 10px;
        .album {
          padding: 8px;
          margin-bottom: 8px;
          background-color: rgb(245, 244, 244);
          display: flex;
          .album-img {
            width: 60px;
            height: 60px;
            border-radius: 5px;
            overflow: hidden;
          }
          .detail {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 15px;
            .type {
              color: #999;
            }
            .name {
              font-size: 14px;
              font-weight: bold;
              width: 220px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .singer {
              color: #999;
            }
          }
        }
      }
    }
    .songs {
      .song-list {
        .song {
          margin-top: 10px;
          padding: 5px 0;
          // background-color: red;
          .song-name {
            font-size: 14px;
          }
          .song-singer {
            margin: 2px 0;
          }
          .song-detail {
          }
        }
      }
    }
  }

  .musicList {
    .top-box {
      height: 240px;
      overflow: hidden;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      .top {
        position: absolute;
        left: 15px;
        top: 10px;
        width: 20px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
    .list-main {
      margin-top: 10px;
      ul {
        padding: 0 15px;
        li {
          display: flex;
          // background-color: red;
          padding: 5px 0;
          .li-left {
            width: 20px;
            line-height: 30px;
            font-size: 16px;
            text-align: center;
            // background-color: green;
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
}
</style>