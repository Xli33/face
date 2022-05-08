import {  Dialog } from "vant";
import "vant/es/dialog/style";
import previewUpload from "./previewUpload";
import publicer from "./publicer";

let restartFlag;

const detector = {
  // 检测
  async detect() {
    // console.log("detect");
    const options = new faceapi.TinyFaceDetectorOptions({
      scoreThreshold: 0.7,
      inputSize: 320
    });
    /* const options = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
    maxResults: 3
  }); */
    const detections = await faceapi.detectSingleFace(this.video, options);
    // .withFaceLandmarks();
    return detections;
  },
  // 尝试拍照
  async takePhoto() {
    if (restartFlag === 0) return;
    let detections = await this.detect();
    if (!detections) {
      // this.checkFailMsg = Toast("请对准摄像头");
      setTimeout(() => {
        this.takePhoto();
      }, 1000);
      return;
    }
    console.log(detections);
    // this.checkFailMsg && this.checkFailMsg.clear();
    // dims = faceapi.matchDimensions(canvas, video, true);
    // draw(detections);
    this.video.pause();
    this.capture(() => {
      // send request
      previewUpload().then(res => {
        publicer.file = null;
        if (restartFlag === 0) return;
        if (res) {
          clearTimeout(restartFlag);
          this.video.srcObject = null;
          window.URL.revokeObjectURL(this.video.src); 
          this.picCanvas = this.video = null;

          //  success
          publicer.completed.value = true;
          publicer.checkResult = res;
 
        } else {
          this.video.play();
          setTimeout(() => {
            this.takePhoto();
          }, 2000);
        }
      });
    });
    return;
  },
  // 获取所拍图像
  capture(callback) {
    if (!this.picCanvas) {
      this.picCanvas = document.createElement("canvas");
    }
    this.picCanvas.width = this.video.videoWidth * 1;
    this.picCanvas.height = this.video.videoHeight * 1;
    this.picCanvas
      .getContext("2d")
      .drawImage(this.video, 0, 0, this.picCanvas.width, this.picCanvas.height);

    this.picCanvas.toBlob(blob => {
      publicer.file = blob;
      callback();
    });
    // return picCanvas.toDataURL();
  }
};

export default async function (video, stream, failCallback) {
  console.log("loading");
  await faceapi.nets.tinyFaceDetector.load("./weights").catch(err => {
    console.log(err);
  });
  console.log("loaded");
  console.log(video);

  detector.video = video;

  let start = () =>
    video.play().then(() => {
      restartFlag = setTimeout(() => {
        restartFlag = 0;
        detector.video.srcObject = null;
        window.URL.revokeObjectURL(detector.video.src);
        detector.picCanvas = detector.video = null;
        Dialog.alert({
          message: "识别失败，请重新开始"
        }).then(action => {
          location.reload();
        });
      }, 15000);
      setTimeout(() => {
        detector.takePhoto();
      }, 2000);
    });

  /* video.oncanplay =
    video.onloadeddata = */
  video.onloadedmetadata = e => {
    console.log("start play");
    if (video.paused) {
      console.log("real play");
      start().catch(err => {
        console.log(err); 
        start().catch(err => {
          failCallback && failCallback();
        }); 
      });
    }
  };

  // 旧的浏览器可能没有srcObject
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    video.src = window.URL.createObjectURL(stream);
  }

  setTimeout(() => {
    if (navigator.userAgent.includes("iPhone")) {
      console.log("ios 上手动播放");
      video.onloadedmetadata();
    }
  }, 1000);
}
