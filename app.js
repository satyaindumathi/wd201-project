/* eslint-env es6 */
/* eslint-disable no-console*/
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  try {
    const overduetodos = await Todo.overdue();
    const duetodaytodos = await Todo.dueToday();
    const duelatertodos = await Todo.dueLater();
    if (request.accepts("html")) {
      response.render("index", {
        title: "To-Do Manager",
        overduetodos,
        duetodaytodos,
        duelatertodos,
      });
    } else {
      response.json({
        overduetodos,
        duetodaytodos,
        duelatertodos,
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.use(express.static(path.join(__dirname, "public")));
app.get("/todos", async function (_request, response) {
  try {
    const todos = await Todo.findAll({
      order: [["id", "ASC"]],
    });
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo({title: request.body.title, dueDate: request.body.dueDate});
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE

  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
  try {
    const deltodo = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    console.log(deltodo);
    return response.send(deltodo == true);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;