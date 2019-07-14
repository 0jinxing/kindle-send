const glob = require("glob");
const Router = require("koa-router");

const router = new Router();
const routeBasicPath = "src/routes";

glob
  .sync(`${routeBasicPath}/**/*.js`, {
    realpath: true,
    nodir: true
  })
  .map(routePath => require(routePath))
  .reduce((pre, cur) => {
    return [...pre, ...cur];
  }, [])
  .map(route => {
    router[(route.method && route.method.toLowerCase()) || "get"](
      route.path,
      route.handle
    );
  });

module.exports = router;
