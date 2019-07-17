const path = require("path");
const createKnex = require("knex");

const configPath = path.resolve(
  "config",
  process.env.NODE_ENV === "production" ? "production.json" : "development.json"
);

const config = require(configPath);
const knex = createKnex(config["db"]);

(async () => {
  if (!(await knex.schema.hasTable("md5"))) {
    await knex.schema.createTable("md5", table => {
      table.increments("id").primary();
      table.string("md5").notNullable();
      table.string("filename").notNullable();
      table.string("ext").notNullable();
    });
  }
  knex.destroy();
})();
