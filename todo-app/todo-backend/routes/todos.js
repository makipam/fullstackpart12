const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const { getAsync, setAsync } = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  let currentCount = await getAsync("added_todos").catch((err) => {
    if (err) {
      console.error(err);
    }
  });
  if (isNaN(currentCount) || !currentCount) {
    currentCount = 0;
  }
  await setAsync("added_todos", parseInt(currentCount) + 1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  let updatedText = req.todo.text;
  let updatedDone = req.todo.done;
  if (req.body.text) {
    updatedText = req.body.text;
  }
  if (req.body.done) {
    updatedDone = req.body.done;
  }
  Todo.findByIdAndUpdate(
    req.todo._id,
    {
      $set: { text: updatedText, done: updatedDone },
    },
    function (err, result) {
      if (err) {
        res.send("Oh no something went wrong!");
      } else {
        res.send("yippii success");
      }
    }
  );
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
