<style lang="less">
.face-stroke {
  position: relative;
  width: 80vw;
  height: 80vw;
  margin: 0 auto;
  border: 2px solid #03a9f4;
  padding: 2px;
  border-radius: 50%; 

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: block;
    border-radius: 50%;
    filter: blur(35px);
  } 

  &- {
    &img {
      width: 100%;
      height: 100%;
      vertical-align: top;
      // object-fit: cover;
      border-radius: 50%;
      background: rgba(65, 65, 65, 0.35);
    }
  }
}
</style>

<template>
  <div class="face-stroke">
    <img v-show="src" :src="src" class="face-stroke-img" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: require("@/assets/img/user.svg")
    }
  }
};
</script>
