const { Sha1 } = require("../models");

async function main() {
  await Sha1.query().insert({
    sha1: "111",
    filename: "111",
    ext: "111"
  });
  const a = await Sha1.query().where("sha1", "111");
  console.log(a);
}

main();
