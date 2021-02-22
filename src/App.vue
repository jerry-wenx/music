<template>
  <div id="app">
    <Play v-bind:sid="songId" />
    <Nav />
    <router-view />
  </div>
</template>

<script>
import Nav from "./components/Nav";
import Play from "./components/Play";
import { mapState } from "vuex";
export default {
  components: { Nav, Play },
  computed: {
    ...mapState(["songId"]),
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  .auto-img {
    width: 100%;
    height: 100%;
  }
  .bg-blur {
    float: left;
    width: 100%;
    // background-repeat: no-repeat;
    // background-position: center;
    // background-size: cover;
    // -webkit-filter: blur(35px);
    // -moz-filter: blur(35px);
    // -o-filter: blur(35px);
    // -ms-filter: blur(35px);
    filter: blur(45px);
  }
}
</style>
