import { types, flow } from "mobx-state-tree";

const File = types.model("File", {
  md5: types.string,
  filename: types.string
});

const Message = types
  .model("Message", {
    from: types.string,
    to: types.string,
    attachments: types.array(File),
    subject: types.string
  })
  .actions(self => ({
    push: flow(function*() {
      
    })
  }));

const RootStore = types.model("Store", {
  message: Message
});

const store = RootStore.create();

export default store;
