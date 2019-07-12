const path = require("path");
const Knex = require("knex");
const { Model } = require("objection");

const knex = Knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: path.resolve("data", "kindle_send.db")
  }
});

Model.knex(knex);

module.exports = {
  knex: knex,
  Sha1: require("./Sha1")
};
