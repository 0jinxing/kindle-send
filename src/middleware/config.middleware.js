module.exports = path => {
  return async (ctx, next) => {
    ctx.$config = require(path);
    await next();
  };
};
