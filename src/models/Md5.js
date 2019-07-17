const { Model } = require("objection");

class Md5 extends Model {
  static get tableName() {
    return "Md5";
  }
  static get idColumn() {
    return "id";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["id", "md5", "filename", "ext"],
      properties: {
        id: {
          type: "integer"
        },
        md5: {
          type: "string"
        },
        filename: {
          type: "string"
        },
        ext: {
          type: "string"
        }
      }
    };
  }
}

module.exports = Md5;
