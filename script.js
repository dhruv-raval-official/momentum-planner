class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskList = document.getElementById('task-list');
        this.init();
    }

    init() {
        document.getElementById('task-form').addEventListener('submit', (event) => this.addTask(event));
        this.renderTasks();
        this.fetchQuote();
    }

    addTask(event) {
        event.preventDefault();
        const taskName = document.getElementById('task-name');
        const taskDescription = document.getElementById('task-desc');
        if (!taskName.value.trim()) {
            alert('Please provide a task name');
            return;
        }
        const task = {
            id: Date.now(),
            name: taskName.value.trim(),
            description: taskDescription.value.trim(),
            completed: false
        };
        this.tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        taskName.value = '';
        taskDescription.value = '';
        this.renderTasks();
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        this.tasks.forEach((task) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.completed ? "completed" : ""}">${task.name}</span>
                <div>
                    <button onclick="taskManager.toggleComplete(${task.id})">
                        ${task.completed ? "Undo" : "Complete"}
                    </button>
                    <button onclick="taskManager.deleteTask(${task.id})">Delete</button>
                </div>`;
            this.taskList.appendChild(li);
        });
    }

    toggleComplete(id) {
        this.tasks = this.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.renderTasks();
    }

    async fetchQuote() {
        try {
            const url = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': 'f603fb2e0dmsh269841ae7f8babcp1aa9bejsn12ec47dfd14b',
                    'x-rapidapi-host': 'quotes15.p.rapidapi.com'
                }
            };

            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Failed to fetch the quote');
            const data = await response.json();
            document.getElementById('quote').textContent = `"${data.content}" - ${data.originator.name}`;
        } catch (error) {
            document.getElementById('quote').textContent = 'Failed to fetch the quote';
            console.log(error);
        }
    }
}

const taskManager = new TaskManager();