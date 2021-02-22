<template>
<!-- 加载动画loading -->
  <div class="loading">
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.loading {
  width: 50px;
  height: 30px;
  margin: 0 auto;
  ul {
    margin-top: 50px;
    li {
      float: left;
      width: 4px;
      height: 30px;
      margin: 0 3px;
      background-color: rgb(117, 115, 116);
      font-size: 0;
      border-radius: 2px;
      animation: loading 1s linear infinite alternate-reverse;
      &:nth-child(1) {
        // height: 100px;
        // background-color: red;
        animation-delay: -1s;
      }
      &:nth-child(2) {
        animation-delay: -0.8s;
      }
      &:nth-child(3) {
        animation-delay: -0.6s;
      }
      &:nth-child(4) {
        animation-delay: -0.4s;
      }
      &:nth-child(5) {
        animation-delay: -0.2s;
      }
      &:nth-child(6) {
        animation-delay: 0s;
      }
    }
  }
  @keyframes loading {
    0% {
      transform: scaleY(1);
    }
    20% {
      transform: scaleY(0.8);
    }
    40% {
      transform: scaleY(0.6);
    }
    60% {
      transform: scaleY(0.4);
    }
    80% {
      transform: scaleY(0.2);
    }
    100% {
      transform: scaleY(0);
    }
  }
}
</style>