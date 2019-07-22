import { types, flow } from "mobx-state-tree";
import { AxiosResponse } from "axios";
import push, { PushData } from "../apis/push";

const File = types.model("File", {
  md5: types.string,
  filename: types.string
});

const Message = types
  .model("Message", {
    to: types.string,
    attachments: types.array(File),
    subject: types.string
  })
  .actions(self => ({
    push: flow(function*(data: PushData) {
      try {
        const res = (yield push(data)) as AxiosResponse<any>;
        if (res.data.status === "ok") {
          // @TODO
        } else {
          // @TODO
        }
      } catch (error) {
        // @TODO
      }
    })
  }));

const RootStore = types.model("Store", {
  message: Message
});

const store = RootStore.create();

export default store;
