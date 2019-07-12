const { knex, Sha1 } = require("../src/models");

(async () => {
  await knex.schema.createTable("sha1", table => {
    table.increments("id").primary();
    table.string("sha1");
    table.string("filename");
    table.string("ext");
  });
})();
