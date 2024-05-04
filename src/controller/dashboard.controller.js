const { where } = require("sequelize");
const pool = require("../db");
const {Todo} = require('../models')

const getAllTodosByUser = async (req, res) => {
  const id = req.user.id
    try {
        // get todo name and description for a specified user id
        // const user = await pool.query(
        //   "SELECT u.user_name, t.todo_id, t.description FROM users AS u LEFT JOIN todos AS t ON u.user_id = t.user_id WHERE u.user_id = $1",
        //   [req.user.id]
        // );
        const todo = await Todo.findAll({
          where: {
            userId: id
          }
        })

        res.status(200).json(todo);
      } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
}

const addTodo = async (req, res) => {
  const id = req.user.id
  const { title, description } = req.body;

    try {
        // const newTodo = await pool.query(
        //   "INSERT INTO todos (user_id, description) VALUES ($1, $2) RETURNING *",
        //   [req.user.id, description]
        // );

        const newTodo = await Todo.create({
          title: title,
          description: description,
          userId: id
        })
    
        res.status(201).json(newTodo);
      } catch (err) {
        res.status(500).json("Server error");
        console.error(err.message);
      }
}

const editTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id
  try {
    // const updateTodo = await pool.query(
    //   "UPDATE todos SET description = $1 WHERE todo_id = $2 AND user_id = $3 RETURNING *",
    //   [description, id, req.user.id]
    // );
    const updateTodo = await Todo.findOne({
      where: { id: id, userId: userId},
    })

    if (!updateTodo) {
      return res.status(400).json("This todo is not yours");
    }

    updateTodo.title = title
    updateTodo.description = description
    await updateTodo.save()

    
    return res.status(200).json("Todo was updated");
  } catch (err) {
    console.error(err.message);
    return res.status(400).json("error");
  }
}

const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id
    try {
        // const deleteTodo = await pool.query(
        //   "DELETE FROM todos WHERE todo_id = $1 AND user_id = $2 RETURNING *",
        //   [id, req.user.id]
        // );
        const deleteTodo = await Todo.findOne({
          where: {id: id, userId: userId},
        })
    
        if (deleteTodo.length === 0) {
          return res.status(400).json("This todo is not yours");
        }
        await deleteTodo.destroy()
        return res.status(200).json("Todo was deleted");
    } catch (err) {
      console.error(err.message);
      return res.status(500).json("Error");
    }
}

module.exports = {
    getAllTodosByUser,
    addTodo,
    editTodo,
    deleteTodo
}