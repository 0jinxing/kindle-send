const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const util = require("util");
const Busboy = require("busboy");

const fsMkdir = util.promisify(fs.mkdir);
const fsExists = util.promisify(fs.exists);
const fsRename = util.promisify(fs.rename);
const fsUnlink = util.promisify(fs.unlink);

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

          fsExists(uploadPath)
            .then(exists => {
              if (exists) return;
              else return fsMkdir(uploadPath, { recursive: true });
            })
            .then(() => {
              file
                .on("data", data => md5Hash.update(data))
                .pipe(fs.createWriteStream(tmpFullname))
                .on("error", _reject)
                .on("finish", () => {
                  const md5 = md5Hash.digest("hex");
                  const md5Fullname = path.resolve(uploadPath, md5);

                  fsExists(md5Fullname)
                    .then(exists => {
                      return exists
                        ? fsUnlink(tmpFullname)
                        : fsRename(tmpFullname, md5Fullname);
                    })
                    .then(() => {
                      _resolve({
                        md5,
                        dest,
                        filename,
                        fieldname,
                        encoding,
                        mimetype
                      });
                    })
                    .catch(_reject);
                });
            })
            .catch(_reject);
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
    
    ctx.body = files.map(file => file.md5).join(".");
    await next();
  };
};
