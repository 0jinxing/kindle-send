const fs = require("fs");
const path = require("path");

const push = async ctx => {
  const { email, files, convert } = ctx.request.body;
  const uploadBasicPath = ctx.$config["busboy"]["dest"];
  const message = {
    from: ctx.$config["email"]["from"],
    to: email,
    subject: convert ? "Convert" : null,
    attachments: files.map(file => ({
      filename: file.filename,
      content: fs.createReadStream(path.resolve(uploadBasicPath, file.md5))
    }))
  };
  ctx.$email.sendMail(message, err => {
    console.log(err);
  });
  ctx.body = { status: "ok" };
};

module.exports = [
  {
    method: "POST",
    path: "/api/push",
    handle: push
  }
];
