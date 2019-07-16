const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Busboy = require("busboy");

const extract = (req, dest, opts = {}) => {
  return new Promise((resolve, reject) => {
    const files = [];

    const busboy = new Busboy({
      ...opts,
      headers: req.headers
    });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      files.push(
        new Promise((_resolve, _reject) => {
          const uploadPath = path.resolve(dest);

          const tmpName = Date.now() + filename;
          const tmpFullname = path.resolve(uploadPath, path.basename(tmpName));

          const md5Hash = crypto.createHash("md5");

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          file
            .on("data", data => md5Hash.update(data))
            .pipe(fs.createWriteStream(tmpFullname))
            .on("error", _reject)
            .on("finish", () => {
              const md5 = md5Hash.digest("hex");
              const md5Name = `${md5}${path.extname(filename)}`;
              const md5Fullname = path.resolve(uploadPath, md5Name);
              // WARN: md5 碰撞
              if (fs.existsSync(md5Fullname)) {
                fs.unlinkSync(tmpFullname);
              } else {
                fs.renameSync(tmpFullname, md5Fullname);
              }
              _resolve({
                md5,
                fieldname,
                filename,
                encoding,
                mimetype,
                path: uploadPath
              });
            });
        })
      );
    });

    busboy.on("finish", () => {
      if (files.length) {
        Promise.all(files)
          .then(files => {
            resolve(files);
          })
          .catch(reject);
      } else {
        resolve(files);
      }
    });

    busboy.on("error", reject);

    if (req.rawBody) {
      busboy.end(req.rawBody);
    } else {
      req.pipe(busboy);
    }
  });
};

module.exports = (opts = {}) => {
  return async (ctx, next) => {
    if (!ctx.is("multipart")) {
      return await next();
    }
    const files = await extract(ctx.req, opts.dest, {
      ...ctx.$config["busboy"],
      ...opts
    });
    ctx.body = files.map(
      file => console.log(file) || { [file.filename]: file.md5 }
    );
    await next();
  };
};
