const path = require("path");
const Koa = require("koa");
const createKnex = require("knex");
const objection = require("objection");
const configMiddleware = require("./middlewares/config");
const postmanMiddleware = require("./middlewares/postman");

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
app.use(async (ctx, next) => {
  const knex = createKnex(ctx.$config["db"]);
  objection.Model.knex(knex);
  await next();
});

app.use((ctx, next) => {
  postmanMiddleware(ctx.$config["email"])(ctx, next);
});
