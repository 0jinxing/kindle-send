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
      required: ["md5", "filename"],
      properties: {
        id: {
          type: "integer"
        },
        md5: {
          type: "string"
        },
        filename: {
          type: "string"
        }
      }
    };
  }
}

module.exports = Md5;
