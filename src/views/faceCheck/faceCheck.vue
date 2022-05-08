<style lang="less">
.face-check {
  display: flex;
  height: 100%;
  padding: 4em 2em 2em;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  line-height: 1.5;
  color: #fff;

  &.mask::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: rgba(0, 0, 0, 0.5);
  }

  &- {
    &box {
      position: relative;
      // z-index: 1;
      width: 80vw;
      height: 79vw;
      overflow: hidden;
      margin-bottom: 8vh;
      padding: 2px;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(149, 155, 255, 0.5);
      border: 4px solid #3396fa;
    }
    &video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    /* &overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    } */
  }
}
</style>

<template>
  <transition name="van-fade">
    <div v-if="!checking && !completed" class="face-check mask">
      <div v-if="detectable">
        <div class="face-check-box">
          <video
            ref="video"
            muted
            webkit-playsinline
            playsinline
            x5-video-player-type="h5-page"
            class="face-check-video"
          ></video>
          <!-- <canvas ref="overlay" class="face-check-overlay" /> -->
        </div>

        <div class="ta-c">
          <h1 class="big-title" style="margin-bottom: 0.5em">请正对摄像头</h1>
          <p>采集过程中请保证光线充足，人脸居于相框内</p>
        </div>
      </div>

      <!-- 不支持捕获摄像头视频流显示手动操作 -->
      <template v-else>
        <div class="ta-c">
          <faceStroke :src="picSrc" style="margin-bottom: 2em"></faceStroke>
          <div style="font-size: 1.2em">
            <p>正面免冠照</p>
          </div>
        </div>

        <van-button type="main" tag="label" block
          >拍照或者选择照片
          <input
            ref="file"
            v-show="false"
            type="file"
            accept="image/*"
            @change="changeFile"
          /><!-- capture="user" -->
        </van-button>
      </template>
    </div>
  </transition>

  <div
    v-if="completed"
    class="flex-justify flex-col height-100 ta-c"
    style="padding: 3em 1em"
  > 
  </div>
</template>

<script>
// face detection

import { nextTick, onMounted, ref } from "vue";
// import { useRoute, useRouter } from "vue-router";
import { CountDown, Toast } from "vant";
import { supportMedia, streaming  } from "./js/util";
import publicer from "./js/publicer";
import detect from "./js/detect";
import previewUpload from "./js/previewUpload";
import faceStroke from "./components/faceStroke.vue"; 

export default {
  components: {
    [CountDown.name]: CountDown,
    faceStroke
  },
  setup(props, ctx) {
    const detectable = ref(false);
    const video = ref(null);
    const file = ref(null);
    const picSrc = ref();
    // 开始特性检测并尝试开始识别
    onMounted(async () => {
      // console.log(video);
      if (supportMedia()) {
        let stream = await streaming();
        publicer.checking.value = false;
        if (stream) {
          detectable.value = true;
          nextTick(() => {
            // console.log(video);
            video.value.volume = 0;
            detect(video.value, stream, () => {
              // 遇到无法播放视频流时退回手动选照片
              detectable.value = false;
            });
          });
        }
      } else {
        publicer.checking.value = false;
      }
    });

    return {
      checking: publicer.checking, // 检测状态
      detectable, // 特性是否支持
      completed: publicer.completed, // 是否完成
      video,
      file,
      picSrc, 
      // 更换文件
      changeFile(e) {
        publicer.file = file.value.files[0];
        if (file.value.files[0]) {
          picSrc.value = window.URL.createObjectURL(file.value.files[0]);
          nextTick(() => {
            window.URL.revokeObjectURL(picSrc.value);
          });
          previewUpload().then(res => {
            if (res) {
              publicer.completed.value = true;
              publicer.checkResult = res; 
            } else {
              Toast({
                message: "识别失败，试试换张照片( ･´ω`･ )",
                duration: 5000
              });
            }
          });
          setTimeout(() => {
            file.value.value = "";
          });
        }
      }
    };
  }, 
};
</script>
