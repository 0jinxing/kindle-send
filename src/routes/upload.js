const createBusboy = require("../middlewares/busboy");

const upload = async (ctx, next) => {
  const fn = createBusboy(ctx.$config["busboy"]);
  await fn(ctx, next);
};

module.exports = [
  {
    method: "POST",
    path: "/api/upload",
    handle: upload
  }
];
