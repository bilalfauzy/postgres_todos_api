const router = require('express').Router()
const authorize = require('../middleware/authorize')
const { 
    getAllTodosByUser, addTodo, editTodo, deleteTodo 
} = require('../controller/dashboard.controller')

router.get('/', authorize, getAllTodosByUser)
router.post('/todos', authorize, addTodo)
router.put('/todos/:id', authorize, editTodo)
router.delete('/todos/:id', authorize, deleteTodo)

module.exports = router