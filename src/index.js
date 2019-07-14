const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const bodyParser = require("koa-bodyparser");
const createKnex = require("knex");
const objection = require("objection");
const configMiddleware = require("./middlewares/config");
const postmanMiddleware = require("./middlewares/postman");
const router = require("./router");

const app = new Koa();

app.use(
  configMiddleware(
    path.resolve(
      "config",
      process.env.NODE_ENV === "production"
        ? "production.json"
        : "development.json"
    )
  )
);

app.use(
  bodyParser({
    formLimit: "300MB"
  })
);

app.use(async (ctx, next) => {
  const knex = createKnex(ctx.$config["db"]);
  objection.Model.knex(knex);
  await next();
});

app.use(async (ctx, next) => {
  await postmanMiddleware(ctx.$config["email"])(ctx, next);
});

app.use(serve(path.resolve("dist")));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("listen localhost:3000");
});
