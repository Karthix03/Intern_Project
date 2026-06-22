const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">
                <button class="toggle-btn" data-id="${task.id}">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn" data-id="${task.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Add Task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") return;

    const task = {
        id: Date.now(),
        text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// Add button click
addBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Event Delegation
taskList.addEventListener("click", (e) => {

    const id = Number(e.target.dataset.id);

    // Delete
    if (e.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }

    // Toggle Complete
    if (e.target.classList.contains("toggle-btn")) {

        tasks = tasks.map(task => {

            if (task.id === id) {
                task.completed = !task.completed;
            }

            return task;
        });

        saveTasks();
        renderTasks();
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        const newText = prompt("Edit Task:", task.text);

        if (newText && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();
            renderTasks();
        }
    }
});

// Filters
filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        filterBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();
    });
});

// Initial Render
renderTasks();