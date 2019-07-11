const nodemailer = require("nodemailer");

module.exports = opts => {
  return async (ctx, next) => {
    ctx.$postman = nodemailer.createTransport(opts);
    await next();
  };
};
