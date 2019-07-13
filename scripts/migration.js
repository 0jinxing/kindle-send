const path = require("path");
const createKnex = require("knex");

const configPath = path.resolve(
  "config",
  process.env.NODE_ENV === "production" ? "production.json" : "development.json"
);

const config = require(configPath);
const knex = createKnex(config["db"]);

(async () => {
  if (!(await knex.schema.hasTable("sha1"))) {
    await knex.schema.createTable("sha1", table => {
      table.increments("id").primary();
      table.string("sha1");
      table.string("filename");
      table.string("ext");
    });
  }
  knex.destroy();
})();
