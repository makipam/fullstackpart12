const express = require("express");
const router = express.Router();
const { getAsync } = require("../redis");

const configs = require("../util/config");

/* GET index data. */
router.get("/", async (req, res) => {
  let counter = await getAsync("added_todos");
  if (!counter) {
    counter = 0;
  }
  const metadata = {
    added_todos: counter,
  };
  res.send(metadata);
});

module.exports = router;
