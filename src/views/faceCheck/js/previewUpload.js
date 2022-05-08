import { Toast } from "vant";
import { test } from "@/api/detectFace";
import publicer from "./publicer";

// 验证图片
export default async function () {
  let form = new FormData()
  form.append("file", publicer.file, "face.jpg");
  let loading = Toast.loading();
  let res = await test(form);
  loading.clear();
  return res;
}
