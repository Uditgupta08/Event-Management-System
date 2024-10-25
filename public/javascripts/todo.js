let totalBudget = 0;
const budgets = {};

function addTodo() {
  const todoSelect = document.getElementById("todo-select");
  const budgetInput = document.getElementById("budget-input");
  const todoUl = document.getElementById("todo-ul");

  const selectedTask = todoSelect.value;
  const budget = parseFloat(budgetInput.value);

  if (selectedTask.trim() === "" || isNaN(budget) || budget <= 0) {
    alert("Please select a task and enter a valid budget.");
    return;
  }

  // Check if the task already exists in the list
  const items = document.querySelectorAll("#todo-ul li");
  for (let item of items) {
    if (item.textContent.includes(selectedTask)) {
      alert("This task is already in your to-do list.");
      return;
    }
  }

  const li = document.createElement("li");
  li.innerHTML = `${selectedTask} <span class="task-budget">${budget.toFixed(
    2
  )}</span>`;
  li.onclick = function () {
    this.classList.toggle("completed");
  };

  todoUl.appendChild(li);

  budgets[selectedTask] = budget;
  totalBudget += budget;
  updateTotalBudget();

  todoSelect.value = "";
  budgetInput.value = "";
}

function updateTotalBudget() {
  document.getElementById("total-budget").textContent = totalBudget.toFixed(2);
}

function markAsBooked(task) {
  const items = document.querySelectorAll("#todo-ul li");
  items.forEach((item) => {
    if (item.textContent.includes(task)) {
      item.classList.add("completed");
    }
  });
}

function bookService(task) {
  console.log(`Service booked: ${task}`);
  markAsBooked(task);
}
setTimeout(() => {
  bookService("Caterer");
}, 3000);
