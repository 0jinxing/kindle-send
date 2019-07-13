const { Model } = require("objection");

class Sha1 extends Model {
  static get tableName() {
    return "sha1";
  }
  static get idColumn() {
    return "id";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["sha1", "filename", "ext"],
      properties: {
        id: {
          type: "integer"
        },
        ext: {
          type: "string"
        },
        sha1: {
          type: "string"
        },
        filename: {
          type: "string"
        }
      }
    };
  }
}

module.exports = Sha1;
