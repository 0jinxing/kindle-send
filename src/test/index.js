const { Sha1 } = require("../models");

async function main() {
  await Sha1.query().insert({
    sha1: "111",
    filename: "111",
    ext: "111"
  });
}

main();
