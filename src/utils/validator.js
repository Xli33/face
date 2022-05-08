// 验证手机号
export const checkPhone = val => {
  if (typeof val !== "string") val = val + "";
  // return /^1\d{10}$/.test(val);
  return /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8})$/.test(
    val
  );
};

// 验证邮箱
export const checkMail = val => {
  if (typeof val !== "string") val = val + "";
  return /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(val);
};

// 验证身份证
export const checkID = val => {
  if (typeof val !== "string") val = val + "";
  return /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/.test(
    val
  );
};

// 验证港澳通行证
export const checkHKMP = val => {
  if (typeof val !== "string") val = val + "";
  return /^[a-zA-Z0-9]{5,21}$/.test(val);
};

// 匹配所有统一表意文字
export const checkU_I = val => {
  if (typeof val !== "string") val = val + "";
  return /\p{Unified_Ideograph}/u.test(val);
};

export default {
  checkPhone,
  checkMail,
  checkID,
  checkHKMP,
  checkU_I
};
