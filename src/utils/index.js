//将对象转为url参数
export const serialize = obj => {
  let arr = [],
    i;
  for (i in obj) {
    arr.push(`${i}=${obj[i] != undefined ? obj[i] : ""}`);
  }
  return arr.join("&");
};
