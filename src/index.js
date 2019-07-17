const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const bodyParser = require("koa-bodyparser");
const nodemailer = require("nodemailer");
const createKnex = require("knex");
const objection = require("objection");
const glob = require("glob");
const router = require("./router");

const app = new Koa();

// config
app.context.$config = require(path.resolve(
  "config",
  process.env.NODE_ENV === "production" ? "production.json" : "development.json"
));

// model
const knex = createKnex(app.context.$config["db"]);
objection.Model.knex(knex);
const modelBasicPath = path.resolve("src", "models");
glob
  .sync(`${modelBasicPath}/**/*.js`, {
    nodir: true,
    realpath: true
  })
  .map(mPath => {
    const mFileName = path.basename(mPath);
    const mName = mFileName
      .slice(
        0,
        mFileName.indexOf(".js") >= 0
          ? mFileName.indexOf(".js")
          : mFileName.length
      )
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase();
    app.context.$models = {
      ...(app.context.$models ? app.context.$models : {}),
      [mName]: require(mPath)
    };
  });

// email
app.context.$email = nodemailer.createTransport(app.context.$config["email"]);

// middleware
app.use(bodyParser());

app.use(serve(path.resolve("dist")));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("listen localhost:3000");
});
