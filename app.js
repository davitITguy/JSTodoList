const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const filterOption = document.querySelector(".filter-todo");
const todoList = document.querySelector(".todo-list");
const modal = document.getElementById('modal');

let editTodoId = '';

const closeModal = () => {
  const editText = document.getElementById('edit-text');

  editTodoId = '';
  editText.value = '';
  modal.style.display = 'none';
};

const clearContent = () => {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
}

const saveLocalTodos = (todo, id) => {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  localStorage.removeItem('todos');
  todoInput.value = "";

  const newTodo = {
    id,
    title: todo,
    completed: false
  }

    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

const deleteTodo = (e) => {
  const todos = JSON.parse(localStorage.getItem('todos'));
  
  const newTodos = todos.filter((todo) => todo.id != e.target.id);
  
  localStorage.removeItem('todos');
  localStorage.setItem('todos', JSON.stringify(newTodos));

  getTodos();
}

const completeTodo = (id) => {
  const todos = JSON.parse(localStorage.getItem('todos'));
  
  const newTodos = todos.map((todo) => {
    return todo.id === id ? {
      ...todo,
      completed: true,
    } : todo
  });
  
  localStorage.removeItem('todos');
  localStorage.setItem('todos', JSON.stringify(newTodos));

  getTodos();
};

const editTodo = (text, id) => {
  modal.style.display = 'flex';
  modal.style.position = 'absolute';
  modal.style.top = '0';

  const editText = document.getElementById('edit-text');
  editText.value = text;
  editTodoId = id;
}

const handleEdit = () => {
  const editText = document.getElementById('edit-text');
  const newText = editText.value;

  const todos = JSON.parse(localStorage.getItem('todos'));
  
  const newTodos = todos.map((todo) => {
    return todo.id === editTodoId ? {
      ...todo,
      title: newText,
      completed: false,
    } : todo
  });
  
  localStorage.removeItem('todos');
  localStorage.setItem('todos', JSON.stringify(newTodos));
  closeModal();
  getTodos();
}

const createTodoElement = (todoName, id, completed) => {
  const todoDiv = document.createElement("div");
  const newTodo = document.createElement("li");

  todoDiv.classList.add("todo");
  if (completed) todoDiv.classList.add("completed");
  newTodo.innerText = todoName;
  
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  
  const editButton = document.createElement("button");

  editButton.innerHTML = `<i class="fas fa-pencil-alt"></i>`;
  editButton.classList.add("edit-btn");
  editButton.addEventListener('click', () => editTodo(todoName, id))
  todoDiv.appendChild(editButton);
  
  const completedButton = document.createElement("button");

  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  completedButton.addEventListener('click', () => completeTodo(id))
  todoDiv.appendChild(completedButton);
  
  const trashButton = document.createElement("button");
  
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  trashButton.id = id;
  trashButton.addEventListener('click', deleteTodo);
  todoDiv.appendChild(trashButton);
  todoList.appendChild(todoDiv);

};

function getTodos(filter = 'all') {
  const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
  clearContent();

  let todoList = todos;
  if (filter !== 'all') {
    todoList = todos.filter((todo) => todo.completed === (filter ==='completed'))
  }

  todoList.forEach(function (todo) {
    createTodoElement(todo?.title, todo.id, todo.completed)
  });
}

getTodos();

const addTodo = () => {
  const newId = new Date() + Math.random;
  const inputElement = document.getElementById("todo-text-input");
  createTodoElement(inputElement.value, newId);

  saveLocalTodos(inputElement.value, newId);
}

const handleFilter = (e) => {
  const selectValue = e?.value;
  
  getTodos(selectValue);
}

const fetchTodos = async () => {
  const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];

  if (todos.length) return;

  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const jsonResponse = await response.json();
  
  localStorage.setItem('todos', JSON.stringify(jsonResponse.slice(0,10)));
  getTodos();
}

fetchTodos()
