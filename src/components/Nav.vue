<template>
  <div class="nav">
    <!-- 底部导航 start -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item
        v-for="(item, i) of icon"
        :key="i"
        @click="change(item.name)"
        :to="item.path"
      >
        <span>{{ item.name }}</span>
        <template #icon="props">
          <img :src="props.active ? item.active : item.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <!-- 底部导航 end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      icon: [
        {
          name: "首页",
          path: "/",
          active: require("../assets/images/music-active.png"),
          inactive: require("../assets/images/music.png"),
        },
        {
          name: "音乐馆",
          path: "/build",
          active: require("../assets/images/build-active.png"),
          inactive: require("../assets/images/build.png"),
        },
        // {
        //   name: "电台",
        //   path: "/radio",
        //   active: require("../assets/images/radio-active.png"),
        //   inactive: require("../assets/images/radio.png"),
        // },
        {
          name: "搜索",
          path: "/search",
          active: require("../assets/images/search-active.png"),
          inactive: require("../assets/images/search.png"),
        },
      ],
    };
  },

  methods: {
    change() {},
  },
};
</script>

<style lang="less" scoped>
</style>