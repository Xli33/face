import { path, handler } from "./config";
import fly from "flyio";
// import { serialize } from "@/utils";

// 验证人脸
export const test = params =>
  fly
    .post(`${path.api}test`, params, { noMsg: true })
    .then(res => handler(res)); 
