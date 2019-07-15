const os = require("os");
const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");
const appendField = require("append-field");

const extract = (req, dest, fnDestFilename, opts = {}) => {
  return new Promise((resolve, reject) => {
    const files = [];
    const fields = {};
    const busboy = new Busboy({
      ...opts,
      headers: req.headers,
      limits: { fileSize: 1048576000 }
    });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (!filename) return file.resume();
      files.push(
        new Promise((_resolve, _reject) => {
          const tmpName = fnDestFilename(fieldname, fieldname);
          const tmpPath = path.join(dest, path.basename(tmpName));

          file
            .pipe(fs.createWriteStream(tmpPath))
            .on("error", _reject)
            .on("finish", () => {
              const rs = fs.createReadStream(tmpPath);
              rs.filename = fieldname;
              rs.encoding = encoding;
              rs.mimetype = mimetype;
              _resolve(rs);
            });
        })
      );
    });

    busboy.on("field", (fieldname, val) => {
      if (Object.getOwnPropertyDescriptor(Object.prototype, fieldname)) {
        fieldname = "_" + fieldname;
      }
      appendField(fields, fieldname, val);
    });

    busboy.on("finish", () => {
      if (files.length) {
        Promise.all(files)
          .then(files => {
            resolve({ fields, files });
          })
          .catch(reject);
      } else {
        resolve({ fields, fields });
      }
    });

    busboy.on("error", reject);
    busboy.on("partsLimit", () => reject(new Error("LIMIT_PART_COUNT")));
    busboy.on("filesLimit", () => reject(new Error("LIMIT_FILE_COUNT")));
    busboy.on("fieldsLimit", () => reject(new Error("LIMIT_FIELD_COUNT")));

    if (req.rawBody) {
      busboy.end(req.rawBody);
    } else {
      req.pipe(busboy);
    }
  });
};

module.exports = (opts = {}) => {
  const {
    dest = os.tmpdir(),
    fnDestFilename = (fieldname, filename) => {
      return Date.now() + fieldname + filename;
    }
  } = opts;
  return async (ctx, next) => {
    if (!ctx.is("multipart")) {
      return await next();
    }
    const { files, fields } = await extract(
      ctx.req,
      dest,
      fnDestFilename,
      opts
    );
    ctx.request.body = fields;
    ctx.request.files = files;

    await next();
  };
};
