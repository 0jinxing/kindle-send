const createBusboy = require("../middlewares/busboy");

const busboy = createBusboy({
  dest: "./upload",
  fnDestFilename: (fieldname, filename) =>
    Math.random()
      .toString(16)
      .slice(2) + filename
});

const upload = async ctx => {
  console.log(ctx.request.method);
  ctx.body = { status: 10200 };
};

module.exports = [
  {
    method: "POST",
    path: "/api/upload",
    handle: busboy
  },
  {
    method: "GET",
    path: "/api/upload",
    handle: upload
  }
];
