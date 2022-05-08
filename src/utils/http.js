import fly from "flyio";
import { Toast } from "vant";

const toast = (message, duration = 5000) => {
  Toast({
    message,
    duration,
    position: "top"
  });
};

fly.config.timeout = 12000;

/* fly.interceptors.request.use(
  config => config
); */
fly.interceptors.response.use(
  res =>
    res.data.result == (res.request.result || 0)
      ? res.data
      : (!res.request.noMsg &&
          (typeof res.data !== "string" ? res.data.msg : res.data) &&
          toast(res.data.msg || res.data, 5000),
        false),
  err => {
    //console.log(err);
    if (!err.request.noMsg) {
      if (err.status == 404) {
        toast("服务器被吃了⊙﹏⊙∥");
      } else if (err.status == 403) {
        toast("权限不足,请联系管理员!");
      } else if (err.response && err.response.data && err.response.data.msg) {
        toast(err.response.data.msg);
      } else {
        toast(`${err.status}：${err.message || "unknown error!"}`);
      }
    }

    return Promise.resolve(false);
  }
);
