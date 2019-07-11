const path = require("path");
const sqlite = require("sqlite3");

const db = new sqlite.Database(path.resolve("data", "sha1.db"), error => {

});

db.all()
