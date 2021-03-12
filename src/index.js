const express = require('express')
const cors = require('cors')

const { v4: uuid } = require('uuid')

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find((user) => user.username === username)

  if (!user) {
    return response.status(404).json({ message: "User not found!"})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body
  
  const userExists = users.some((user) => user.username === username)

  if (userExists) {
    return response.status(409).json({ message: "User already exists!"})
  }

  const id = uuid()

  users.push({
    id,
    name,
    username,
    todos: []
  })

  return response.status(201).json({ id: id })
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request

  return response.json({ todos: user.todos })
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body

  const todos = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date
  }

  user.todos.push(todos)
  return response.status(201).json(todos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;