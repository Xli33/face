import { ref } from "vue";

export default {
  checking: ref(true), // 是否在检测可否捕获视频流
  //   detectable: ref(false),
  completed: ref(false),
  checkResult: null, // 识别成功后返回的结果
  isDifferent: false // 是否有差异
};
