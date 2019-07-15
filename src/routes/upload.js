const createBusboy = require("../middlewares/busboy");

const busboy = createBusboy({
  dest: "./upload",
  fnDestFilename: (fieldname, filename) =>
    Math.random()
      .toString(16)
      .slice(2) + filename
});

const upload = async ctx => {
  // if (ctx.request.method === "POST") {
  //   // const busboy = new Busboy({ headers: ctx.req.headers });
  //   // // console.log(busboy);
  //   // // 解析请求文件事件
  //   // busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
  //   //   console.log(filename);
  //   // });
  //   // busboy.on("finish", function() {
  //   //   console.log("文件上结束");
  //   // });
  // }
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
