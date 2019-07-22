import request from "../utils/request";

export type PushData = {
  email: string;
  files: Array<{ md5: string; filename: string }>;
  convert: boolean;
};

export default (data: PushData) => {
  return request({ method: "POST", url: "/api/push", data });
};
