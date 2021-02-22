<template>
  <div class="play-box" v-if="songId && songDetail.picUrl">
    <div class="bg">
      <img class="auto-img bg-blur" :src="songDetail.picUrl" />
    </div>
    <audio
      ref="musicPlay"
      @timeupdate="timeupdate"
      :src="`https://music.163.com/song/media/outer/url?id=${songId}.mp3`"
    ></audio>
    <!-- autoplay -->
    <div class="left" @click.stop="open">
      <img class="auto-img" src="../assets/images/dish.jpg" />
    </div>
    <div class="photo" @click.stop="open">
      <img class="auto-img" :src="songDetail.al.picUrl" />
    </div>
    <div class="text" @click.stop="open">
      <van-notice-bar :speed="50" :scrollable="isScrollable" :delay="0"
        >{{ songDetail.name }} - {{ songDetail.artists }}</van-notice-bar
      >
    </div>
    <div class="right">
      <div class="play-btn" @click.stop="changeState">
        <van-circle
          v-model="currentRate"
          :rate="targetRate"
          :speed="15"
          :stroke-width="60"
        />
        <div class="btn">
          <img
            class="auto-img"
            :src="
              isPlay
                ? require('../assets/images/suspend.png')
                : require('../assets/images/play.png')
            "
          />
        </div>
      </div>
      <div class="all-song" @click.stop="showAllSOng">
        <img class="auto-img" src="../assets/images/music-list.png" />
      </div>
    </div>

    <!-- 弹出层 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '100%' }">
      <div class="bg bg-blur">
        <img class="auto-img" :src="songDetail.al.picUrl" />
      </div>

      <div class="popup">
        <div class="close" @click.stop="close">
          <img class="auto-img" src="../assets/images/close.png" />
        </div>
        <van-tabs
          v-model="active"
          animated
          background="transparent"
          line-width="0"
          :swipeable="true"
        >
          <van-tab title="歌曲">
            <!-- 大的图片 -->

            <div class="big-pic">
              <img class="auto-img" :src="songDetail.al.picUrl" />
            </div>

            <!-- 歌曲名称 作者 本段歌词 -->
            <div class="text">
              <div class="songName">
                <van-notice-bar :speed="50"
                  >{{ songDetail.name }}
                  {{ songDetail.alia[0] }}</van-notice-bar
                >
              </div>
              <div class="singer">{{ songDetail.artists }}</div>
              <div class="lyric">{{ crrrentLyric }}</div>
            </div>
            <!-- 进度条 -->
            <div class="progress">
              <!-- 评论 -->
              <div class="comment-box">
                <div class="comment">
                  <van-icon name="chat-o" :size="30" @click="showComment" />
                </div>
              </div>
              <!-- 评论  end-->
              <van-slider v-model="value" @input="onInput" :button-size="8" />
              <div class="time">
                <div class="current-time">{{ curtime | formattime }}</div>
                <div class="total-time">{{ total | formattime }}</div>
              </div>
            </div>

            <div class="bottom">
              <div class="order" @click="changePattern">
                <!-- ../assets/images/sequence.png -->
                <img
                  class="auto-img"
                  :src="
                    pattern == 0
                      ? require('../assets/images/loop.png')
                      : pattern == 1
                      ? require('../assets/images/sequence.png')
                      : require('../assets/images/random.png')
                  "
                />
              </div>
              <div class="last" @click.stop="lastSong">
                <img class="auto-img" src="../assets/images/last.png" />
              </div>
              <div class="is-play" @click="changeState">
                <div class="btn">
                  <img
                    class="auto-img"
                    :src="
                      isPlay
                        ? require('../assets/images/suspend-block.png')
                        : require('../assets/images/play-block.png')
                    "
                  />
                </div>
              </div>
              <div class="next" @click.stop="nextSong">
                <img class="auto-img" src="../assets/images/next.png" />
              </div>
              <div class="music-list" @click.stop="showAllSOng">
                <img class="auto-img" src="../assets/images/music-list.png" />
              </div>
            </div>
          </van-tab>
          <van-tab title="歌词">
            <div class="lyric-box">
              <div class="head-text">{{ songDetail.name }}</div>
              <div class="name">{{ songDetail.artists }}</div>

              <!-- 歌词部分 -->
              <div ref="gundong" class="lyric">
                <ul>
                  <li
                    v-for="(val, i) of lyricArr"
                    :key="i"
                    @click="clickLyric(i)"
                    :class="{ current: i == current }"
                  >
                    {{ val.str }}
                  </li>
                </ul>
              </div>
              <div class="bottom">
                <div class="right-btn" @click="changeState">
                  <div class="btn">
                    <img
                      class="auto-img"
                      :src="
                        isPlay
                          ? require('../assets/images/suspend-block.png')
                          : require('../assets/images/play-block.png')
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>

    <!-- 评论弹出层 -->
    <div class="comment-pop">
      <van-popup
        v-model="isShowComment"
        position="right"
        :style="{ height: '100%', width: '100%' }"
      >
        <!-- 评论头部 -->
        <div class="comment-head">
          <div class="return" @click="closeComment">
            <img class="auto-img" src="../assets/images/return.png" />
          </div>
          <div class="font">评论</div>
        </div>
        <!-- 当前作品 -->
        <div class="works">
          <div class="img">
            <img class="auto-img" :src="songDetail.picUrl" />
            <div class="mask" @click="changeState">
              <div class="btn">
                <img
                  class="auto-img"
                  :src="
                    isPlay
                      ? require('../assets/images/suspend-bold.png')
                      : require('../assets/images/play.png')
                  "
                />
              </div>
            </div>
          </div>
          <div class="text">
            <div class="top">{{ songDetail.name }}</div>
            <div class="bottom">{{ songDetail.artists }}</div>
          </div>
        </div>

        <!-- 评论区主体 -->
        <div class="comment-main">
          <div class="font">评论区</div>
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="5"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <ul>
              <li v-for="(item, i) of commentList" :key="i">
                <!-- 左边头像 -->
                <div class="left">
                  <div class="head-picture">
                    <img class="auto-img" :src="item.user.avatarUrl" />
                  </div>
                </div>
                <!-- 右边 昵称 时间 点赞  已经评论内容 -->
                <div class="right">
                  <!-- 昵称。时间 -->
                  <div class="top">
                    <div class="nickname">{{ item.user.nickname }}</div>
                    <div class="time">{{ item.time }}</div>
                  </div>
                  <div class="bottom">{{ item.content }}</div>
                </div>
              </li>
            </ul>
          </van-list>
        </div>
      </van-popup>
    </div>

    <!-- 播放列表弹出层 -->
    <div class="play-list-box">
      <van-popup
        v-model="playListShow"
        position="bottom"
        :style="{ height: '80%' }"
      >
        <div class="head-box">
          <div class="box" @click="changePattern">
            <div class="playicon">
              <img
                class="auto-img"
                :src="
                  pattern == 0
                    ? require('../assets/images/loop.png')
                    : pattern == 1
                    ? require('../assets/images/sequence.png')
                    : require('../assets/images/random.png')
                "
              />
            </div>
            <div class="playDetail">
              {{
                pattern == 0
                  ? "单曲循环"
                  : pattern == 1
                  ? "顺序播放"
                  : "随机播放"
              }}
            </div>
          </div>
        </div>
        <div class="list">
          <ul>
            <li
              v-for="(item, i) of playList"
              :key="item.id"
              :class="{ active: i == currentIndex }"
            >
              <div class="li-left">
                <div class="songName">{{ item.name }} {{ item.alias }}</div>
                <div class="singer">{{ item.artists }}</div>
                <div class="vf" v-show="i == currentIndex">
                  <img class="auto-img" src="../assets/images/VF.png" />
                </div>
              </div>
              <div class="del" @click="del(i)">
                <img class="auto-img" src="../assets/images/close-x.png" />
              </div>
            </li>
          </ul>
        </div>
        <div class="close-bottom" @click="closeBtn">关闭</div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["sid"],
  data() {
    return {
      currentRate: 0, // 当前圆的值
      targetRate: 0, // 目标圆的值
      show: false, // 显示遮罩层
      value: 0, // 进度条
      valueControl: true, // 控制value  进度条发生变化val就不跟着播放是的时间走
      active: 0, // 切屏
      songDetail: {}, // 歌曲详细详情
      isScrollable: false, // 歌词是否为滚动状态
      curtime: 0, // 歌曲当前播放时间
      total: 0, // 歌曲总时长
      lyric: "", // 全部歌词
      lyricArr: "", // 歌词数组
      crrrentLyric: "", // 当前播放的歌词
      current: "", // 当前歌曲下标
      start: "", // 开始时间
      end: "", // 结束时间
      timer: null, // 定时器
      scroll: true, // 是否存在
      isShowComment: false, // 显示评论
      commentList: [], // 评论列表
      loading: false, // 列表刷新
      finished: false, // 列表刷新完成
      index: 1, // 加载评论时的第几次
      playListShow: false, // 播放列表的显示
      // playListTogetherShow: true, // 解决播放列表和弹出层的冲突问题
      pattern: 1, // 切换播放模式： 0--循环播放 1--顺序播放 2--随机播放
      currentIndex: Number, // 当前播放列的下标
    };
  },
  filters: {
    formattime(val) {
      let m = parseInt(val / 60);
      let s = parseInt(val % 60);
      s = s < 10 ? "0" + s : s;
      let t = `${m}:${s}`;
      return t;
    },
  },
  methods: {
    lastSong() {
      for (let i = 0; i < this.playList.length; i++) {
        if (this.playList[i].id == this.songId) {
          if (i == 0) {
            let a = this.playList.length - 1;
            this.$store.commit("getSongId", this.playList[a].id);

            break;
          }
          this.$store.commit("getSongId", this.playList[i - 1].id);
          break;
        }
      }
    },
    nextSong() {
      for (let i = 0; i < this.playList.length; i++) {
        if (this.playList[i].id == this.songId) {
          if (i == this.playList.length - 1) {
            this.$store.commit("getSongId", this.playList[0].id);

            break;
          }
          this.$store.commit("getSongId", this.playList[i + 1].id);
          break;
        }
      }
    },
    // 切换模式
    changePattern() {
      this.pattern++;
      this.pattern = this.pattern % 3;
    },
    closeBtn() {
      this.playListShow = false;
    },
    // 删除音乐列表的音乐
    del(index) {
      console.log(index);
      if (this.playList[index].id == this.songId) {
        if (this.playList.length == 1) {
          this.$store.commit("changeEveryOneListen", !this.everyOneListen);
          this.$store.commit("changeIsPlay", !this.isPlay);
        } else {
          let Id = "";
          if ((index == this.playList.length - 1)) {
            Id = this.playList[0].id;
          } else {
            Id = this.playList[index + 1].id;
          }
          this.$store.commit("getSongId", Id);
        }
      }
      this.playList.splice(index, 1);
      // console.log(this.playList);
    },

    // 加载事件
    // ！！！！！！！！！！！！！！！！！！！！有问题  不知道如何判断已经加载完所有评论条数
    onLoad() {
      // 异步更新数据
      console.log("jiazaile");

      this.getComment(this.songId);
      this.loading = false;

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true;
      //   }
    },

    // 歌曲时间事件
    timeupdate(event) {
      // console.log('event', event);
      let audio = event.target;
      //  audio.currentTime 当前播放时间  audio.duration 音频总时长
      let currentTime = audio.currentTime; //当前播放的时间
      let durationTime = audio.duration; //总时长
      if (currentTime == durationTime) {
        this.$store.commit("changeIsPlay", false);
        this.playOrPause(this.isPlay);
        this.value = 0;
        // console.log("播放结束了");
        if (this.pattern == 0) {
          this.$store.commit("changeIsPlay", true);
          this.playOrPause(this.isPlay);
          this.$refs.musicPlay.currentTime = 0;
        } else if (this.pattern == 1) {
          for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].id == this.songId) {
              if (i == this.playList.length - 1) {
                this.$store.commit("getSongId", this.playList[0].id);

                break;
              }
              this.$store.commit("getSongId", this.playList[i + 1].id);
              break;
            }
          }
          this.$store.commit("changeIsPlay", true);
          this.playOrPause(this.isPlay);
        } else {
          let randomArr = Math.floor(Math.random() * this.playList.length);
          // if(this.playList[randomArr].id == this.songId) {

          // }
          this.$store.commit("getSongId", this.playList[randomArr].id);
          this.$store.commit("changeIsPlay", true);
          this.playOrPause(this.isPlay);
        }
      }

      this.curtime = currentTime;
      this.total = durationTime;
      // console.log(durationTime, currentTime);
      this.targetRate = parseInt((currentTime / durationTime) * 100) + 1;
      this.currentRate = parseInt((currentTime / durationTime) * 100);

      // console.log(this.lyricArr);
      for (let i = 0; i < this.lyricArr.length; i++) {
        let prevtime = this.lyricArr[i];
        let nexttime = this.lyricArr[i + 1];
        if (!nexttime) {
          this.current = i;
          this.crrrentLyric = "";
          break;
        }
        if (currentTime >= prevtime.time && currentTime < nexttime.time) {
          this.current = i;
          this.crrrentLyric = this.lyricArr[i].str;
          break;
        }
      }
      this.touchEvent();
      if (this.valueControl) {
        this.value = parseInt((currentTime / durationTime) * 100);
      }
    },
    // 移动事件和歌词滚动
    touchEvent() {
      if (this.$refs.gundong) {
        let musicbox = this.$refs.gundong;

        musicbox.ontouchstart = function (e) {
          clearTimeout(this.timer);
          this.tiemr = null;
          this.start = e.timeStamp;
          // console.log(this.start);
        };
        musicbox.ontouchend = function (e) {
          this.end = e.timeStamp;

          if (this.end - this.start >= 200) {
            // console.log("我在移动");
            this.timer = setTimeout(() => {
              musicbox.scrollTop = this.current * 22 - 66;
            }, 800);
          } else {
            this.timer = setTimeout(() => {
              musicbox.scrollTop = this.current * 22 - 66;
            }, 800);
          }
        };
      }
    },
    // 点击歌词播放这段的歌词
    clickLyric(k) {
      let time = this.lyricArr[k].time; //获取这条歌词对应的时间
      this.$refs.musicPlay.currentTime = time; //设置播放器的播放时间..
    },
    // 显示评论
    showComment() {
      this.isShowComment = true;
    },

    // 播放音乐
    changeState() {
      this.$store.commit("changeIsPlay", !this.isPlay);
    },

    // 打开遮罩层
    open() {
      this.show = true;
    },
    // 关闭遮罩层
    close() {
      this.show = false;
    },

    showAllSOng() {
      this.playListShow = true;
      // console.log(this.playList);
    },

    // 进度条事件
    onInput(val) {
      this.valueControl;
      this.$refs.musicPlay.currentTime = (val / 100) * this.total;
    },

    // 获取歌曲信息
    async getSongDetail(val) {
      let arr = "";
      let artists = "";
      await this.$axios.get("/song/detail?ids=" + val).then((res) => {
        //根据id获取歌曲详细信息.
        // console.log();
        arr = res.data.songs[0];
        arr.ar.forEach((val) => {
          artists += val.name + "-";
        });
        artists = artists.slice(0, -1);
      });
      this.songDetail = arr;
      this.songDetail.artists = artists;
      this.songDetail.picUrl = arr.al.picUrl;
      setTimeout(() => {
        this.playOrPause(this.isPlay);
      }, 600);
    },
    playOrPause(flag) {
      // console.log(flag);
      setTimeout(() => {
        if (flag) {
          this.$refs.musicPlay.play();
          this.isScrollable = true;
        } else {
          this.$refs.musicPlay.pause();
          this.isScrollable = false;
        }
      }, 600);
    },
    // 获取歌词
    getLyric(val) {
      this.$axios.get("/lyric?id=" + val).then((lrcdata) => {
        console.log("lrcdata==>", lrcdata);
        this.lyric = lrcdata.data.lrc.lyric.split("\n");

        this.lyric.pop();

        //   -------------分割歌词-----------------
        let reg = /\[(\d+):(\d+\.\d+)\](.+)*/;
        this.lyricArr = this.lyric.map((value) => {
          var a = value.match(reg); //正则匹配
          let t = parseInt(a[1]) * 60 + parseFloat(a[2]); //处理匹配到的时间
          return {
            time: t,
            str: a[3],
          };
        });
      });
    },
    // 获取评论
    getComment(id) {
      let i = this.index * 10;
      // console.log(i);
      this.$axios.get("/comment/music?id=" + id + "&limit=" + i).then((res) => {
        let arr = res.data.comments.slice((this.index - 1) * 10, i);
        this.commentList.push(...arr);
        this.index++;
      });
    },
    closeComment() {
      this.isShowComment = false;
    },
  },

  computed: {
    ...mapState(["isPlay", "songId", "playList"]),
  },
  watch: {
    songId(val) {
      this.targetRate = 0;
      this.currentRate = 0;
      this.getSongDetail(val);
      this.getLyric(val);
      this.getComment(val);
      for (let i = 0; i < this.playList.length; i++) {
        if (this.playList[i].id == val) {
          this.currentIndex = i;
          break;
        }
      }
    },
    isPlay(val) {
      this.playOrPause(val);
    },
  },
};
</script>

<style lang="less" scoped>
.play-box {
  position: fixed;
  align-items: center;
  bottom: 50px;
  display: flex;
  width: 90%;
  height: 40px;
  left: 15px;
  background-color: #ccc;
  border-radius: 20px;

  z-index: 100;

  audio {
    position: absolute;
  }

  .left {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-left: 20px;
    overflow: hidden;
  }
  .photo {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 45px;
    height: 45px;
    border-radius: 3px;
    overflow: hidden;
  }
  .text {
    margin-left: 15px;
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
    .van-notice-bar {
      // height: 24px;
      font-size: 14px;
      height: 18px;
      background-color: transparent;
      color: #fff;
      padding: 0;
      width: 180px;
    }
  }
  .right {
    display: flex;
    margin-left: 10px;
    .play-btn {
      position: relative;
      width: 25px;
      height: 25px;
      .van-circle {
        width: 100%;
        height: 100%;
      }
      .btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 18px;
        height: 18px;
        border-radius: 50%;
      }
    }
    .all-song {
      width: 20px;
      height: 20px;
      margin-left: 8px;
      margin-top: 3px;
      z-index: 120;
    }
  }
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 20px;
  }

  // 弹出层样式
  .popup {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .van-tabs__nav {
      position: absolute !important;
    }
    /deep/.van-tabs__wrap {
      width: 80px;
      margin: 0 auto;
      height: 30px;
      line-height: 30px;
    }
    /deep/.van-tabs__nav--line {
      padding: 0;
    }
    /deep/.van-tab {
      line-height: 30px;
      padding: 0;
      position: absolute !important;
      &:nth-child(2) {
        margin-left: 40px;
      }
    }
    .close {
      position: absolute;
      left: 15px;
      top: 3px;
      width: 25px;
      height: 25px;
      z-index: 111;
    }
    .head {
      height: 30px;
      display: flex;

      .detail {
        display: flex;
        width: 80px;
        line-height: 30px;
        text-align: center;
        margin: 0 auto;
        span {
          padding: 0 5px;
        }
        .active {
          color: red;
        }
      }
    }
    .big-pic {
      width: 80%;
      height: 300px;
      margin: 20px auto;
      border-radius: 20px;
      overflow: hidden;
    }
    .text {
      width: 80%;
      margin: 0 auto;
      padding-bottom: 5px;
      line-height: 20px;
      color: rgb(188, 192, 180);
      .songName {
        font-size: 22px;
        font-weight: bold;
        // background-color: red;
        .van-notice-bar {
          height: 24px;
          background-color: transparent;
          color: #fff;
          padding: 0;
          width: 220px;
        }
      }
      .singer {
        margin: 10px 0;
      }
      .lyric {
        height: 20px;
      }
    }
    .progress {
      width: 80%;
      margin: 0 auto;
      margin-top: 60px;
      margin-bottom: 10px;
      .comment-box {
        display: flex;
        justify-content: flex-end;
        .comment {
          margin-bottom: 10px;
          color: #fff;
        }
      }
      .time {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        color: #ddd;
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      width: 80%;
      margin: 0 auto;
      // background-color: green;
      div {
        width: 25px;
        height: 25px;
        &.is-play {
          width: 45px;
          height: 45px;
          background-color: #fff;
          border-radius: 50%;
          .btn {
            width: 25px;
            height: 25px;
            margin: 10px auto;
          }
        }
        &.music-list {
          width: 20px;
          height: 20px;
        }
      }
    }
    .lyric-box {
      width: 80%;
      margin: 0 auto;
      margin-top: 20px;
      font-size: 14px;
      color: rgb(188, 192, 180);
      .head-text {
        font-size: 18px;
      }
      .name {
        margin: 10px 0 20px 0;
      }
      .lyric {
        margin-top: 30px;
        height: 450px;
        // background-color: red;
        overflow: hidden;
        overflow-y: auto;
        ul {
          li {
            line-height: 22px;
            &.current {
              font-size: 18px;
              color: #fff;
            }
          }
        }
      }
      .bottom {
        position: relative;
        margin-top: 20px;
        width: 100%;
        height: 40px;
        .right-btn {
          position: absolute;
          right: 0;
          top: 5px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #fff;
          .btn {
            width: 20px;
            height: 20px;
            margin: 5px auto;
          }
        }
      }
    }
  }

  // 评论弹出层
  .comment-pop {
    .comment-head {
      width: 100%;
      display: flex;
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      .return {
        width: 20px;
        height: 20px;
        margin-top: 3px;
      }
      .font {
        flex: 1;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
    }
    .works {
      margin-top: 20px;
      display: flex;
      padding: 8px 15px;
      background-color: #eee;
      .img {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 5px;
        overflow: hidden;
        .mask {
          left: 0;
          top: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          .btn {
            width: 20px;
            height: 20px;
            // background-color: red;
            margin: 15px auto;
          }
        }
      }
      .text {
        .top {
          color: #333;
          font-size: 14px;
          margin-top: 5px;
        }
        .bottom {
          color: #999;
          margin-top: 5px;
        }
      }
    }
    .comment-main {
      padding: 0 15px;
      margin-top: 20px;
      .font {
        font-weight: bold;
        span {
          color: #999;
        }
      }
      ul {
        margin-top: 20px;
        li {
          margin-bottom: 15px;
          display: flex;
          &:last-child {
            margin-bottom: 0;
          }
          .left {
            border-radius: 0;
            width: 25px;
            // margin-right: 5px;
            margin-left: 0;
            // background-color: green;
            .head-picture {
              width: 25px;
              height: 25px;
              border-radius: 50%;
              overflow: hidden;
            }
          }
          .right {
            margin-left: 10px;
            display: flex;
            flex-direction: column;

            .top {
              color: #999;
            }
            .bottom {
              margin-top: 5px;
              width: 300px;
            }
          }
        }
      }
    }
  }

  // 播放列表层
  .play-list-box {
    .van-popup {
      background-color: rgb(224, 224, 224);
    }
    .head-box {
      padding: 10px 15px;
      line-height: 25px;

      // background-color: red;
      .box {
        display: flex;
        .playicon {
          width: 25px;
          height: 25px;
        }
        .playDetail {
          font-size: 16px;
          font-weight: bold;
          margin-left: 8px;
          margin-top: 2px;
          color: #fff;
        }
      }
    }
    .list {
      ul {
        // background-color: blue;
        height: 446px;
        overflow: hidden;
        overflow-y: auto;
        li {
          display: flex;
          line-height: 20px;
          justify-content: space-between;
          padding: 10px 15px;
          border-bottom: 1px solid #ccc;
          &.active {
            color: #a4c9ff;
          }
          .li-left {
            display: flex;
            // background: green;
            .songName {
              font-size: 14px;
              max-width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: 20px;
            }
            .singer {
              color: #999;
            }
            .vf {
              margin-left: 10px;
              width: 30px;
              height: 20px;
            }
          }

          .del {
            width: 15px;
            height: 15px;
            // background-color: red;
          }
        }
      }
    }
    .close-bottom {
      font-weight: 16px;
      font-weight: bold;
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>