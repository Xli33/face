// import { Toast } from "vant";

let iosVer = navigator.userAgent.match(/os\s+(\d+)/i);
if (iosVer) {
  iosVer = +iosVer[1];
}

export const supportMedia = () =>
  !!(
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia
  );
// 尝试获取摄像头视频流
export const streaming = async () => {
  // 避免不存在navigator.mediaDevices.getUserMedia导致报错
  handleGetMedia();

  let stream = await navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: "user" },
      audio: iosVer === 15 // iOS 15上若为false则基本无法获取到视频流
    })
    .catch(async err => {
      console.log(err);
      let text;
      if (err.name === "AbortError" || err.name === "NotReadableError") {
        text = "摄像头异常";
      } else if (
        err.name === "NotAllowedError" ||
        err.name === "SecurityError"
      ) {
        text = "系统限制！无法访问摄像头";
      } else if (err.name === "NotFoundError") {
        text = "未找到摄像头";
      }
      Toast.fail(text);
    });

  if (!stream) {
    return;
  }
  return stream;
};

// 兼容处理
export const handleGetMedia = () => {
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = constraints => {
      // 如果有getUserMedia
      let getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia; // 在未实现环境中返回一个error到promise的reject来保持一个统一的接口
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }
      // 否则，为老的navigator.getUserMedia方法包裹一个Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
};

// const isSafari = () => {
//   let ua = navigator.userAgent.toLowerCase();
//   if (
//     ua.indexOf("applewebkit") > -1 &&
//     ua.indexOf("mobile") > -1 &&
//     ua.indexOf("safari") > -1 &&
//     ua.indexOf("linux") === -1 &&
//     ua.indexOf("android") === -1 &&
//     ua.indexOf("chrome") === -1 &&
//     ua.indexOf("crios") === -1 &&
//     ua.indexOf("ios") === -1 &&
//     ua.indexOf("browser") === -1
//   ) {
//     return true;
//   }
//   return false;
// };

// export const isIn11And143 = () => {
//   let ver = navigator.userAgent
//     .toLowerCase()
//     .match(/cpu iphone os (.*?) like mac os/);
//   if (ver) {
//     /* ver = ver[1].split("_");
//   if (ver[0] < 11) {
//     // Swal.fire("很抱歉，当前系统版本过低，请先将系统升级至最新版本");
//     return;
//   } */
//     // 若当前iOS版本大于=11且小于14.3则提示从Safari打开
//     let begin = [14, 3];
//     if (!isSafari() && ver[0] >= 11 && ver.some((e, i) => e < begin[i])) {
//       return Toast.fire({
//         text: "由于当前系统限制，请点击右上角选择用Safari浏览器打开，或者点击下面的按钮手动选择照片",
//         confirconfirmButtonText: "选择照片"
//       });
//     }
//   }
// };

export const backToWechat = () => {
  if (navigator.userAgent.toLowerCase().match("micromessenger")) {
    typeof WeixinJSBridge !== undefined && WeixinJSBridge.call("closeWindow");
    return;
  }
  // 非微信内则跳转回微信
  window.location.href = "weixin://";
};
