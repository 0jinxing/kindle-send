const path = require("path");
const Koa = require("koa");
const configMiddleware = require("./middleware/config.middleware");
const postmanMiddleware = require("./middleware/postman.middleware");

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

app.use((ctx, next) => {
  postmanMiddleware(ctx.$config["email"])(ctx, next);
});
