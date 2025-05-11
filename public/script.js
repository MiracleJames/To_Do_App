// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Load tasks from localStorage
    loadTasks();

    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const categoryDots = document.querySelectorAll('.category-dot');

    // Current selected category (default: personal)
    let currentCategory = 'personal';

    // Get current date
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Category selection
    categoryDots.forEach(dot => {
        dot.addEventListener('click', function() {
            // Remove active class from all dots
            categoryDots.forEach(d => d.classList.remove('active'));
            // Add active class to clicked dot
            this.classList.add('active');
            // Update current category
            currentCategory = this.getAttribute('data-category');
        });
    });

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            // Create task object
            const task = {
                id: Date.now(),
                text: taskText,
                category: currentCategory,
                day: currentDay,
                completed: false
            };

            // Add to DOM
            createTaskElement(task);

            // Save to localStorage
            saveTask(task);

            // Clear input
            taskInput.value = '';

            // Focus back on input
            taskInput.focus();
        }
    }

    // Function to create task element in DOM
    function createTaskElement(task) {
        // First, determine which day column to add the task to
        // For simplicity, we're adding all tasks to the current day
        const dayTasksContainer = document.getElementById(`day-tasks-${task.day}`);

        if (dayTasksContainer) {
            const taskItem = document.createElement('div');
            taskItem.classList.add('time-task');
            taskItem.setAttribute('data-id', task.id);

            // Create checkbox for completing tasks
            const checkboxClass = task.completed ? 'checkbox checked' : 'checkbox';
            const checkIcon = task.completed ? '<i class="fas fa-check"></i>' : '';

            // Apply completed class if task is completed
            const completedClass = task.completed ? 'completed' : '';

            taskItem.innerHTML = `
                <div class="task-card ${task.category} ${completedClass}">
                    <div class="${checkboxClass}" onclick="toggleTaskCompletion(${task.id})">
                        ${checkIcon}
                    </div>
                    <div class="task-content">
                        <h3>${task.text}</h3>
                    </div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            dayTasksContainer.appendChild(taskItem);
        }
    }

    // Function to toggle task completion
    window.toggleTaskCompletion = function(id) {
        // Get tasks from localStorage
        let tasks = getTasks();
        // Find the task
        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex !== -1) {
            // Toggle completed status
            tasks[taskIndex].completed = !tasks[taskIndex].completed;

            // Update localStorage
            localStorage.setItem('tickdoneTasks', JSON.stringify(tasks));

            // Update DOM
            const taskElement = document.querySelector(`.time-task[data-id="${id}"]`);
            if (taskElement) {
                const checkbox = taskElement.querySelector('.checkbox');
                const taskCard = taskElement.querySelector('.task-card');

                if (tasks[taskIndex].completed) {
                    checkbox.classList.add('checked');
                    checkbox.innerHTML = '<i class="fas fa-check"></i>';
                    taskCard.classList.add('completed');
                } else {
                    checkbox.classList.remove('checked');
                    checkbox.innerHTML = '';
                    taskCard.classList.remove('completed');
                }
            }
        }
    };

    // Function to save task to localStorage
    function saveTask(task) {
        let tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tickdoneTasks', JSON.stringify(tasks));
    }

    // Function to get tasks from localStorage
    function getTasks() {
        return JSON.parse(localStorage.getItem('tickdoneTasks') || '[]');
    }

    // Function to delete task
    window.deleteTask = function(id) {
        // Remove from DOM
        const taskElement = document.querySelector(`.time-task[data-id="${id}"]`);
        if (taskElement) {
            taskElement.remove();
        }

        // Remove from localStorage
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tickdoneTasks', JSON.stringify(tasks));
    };

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => {
            createTaskElement(task);
        });
    }

    // Update date in header
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.querySelector('.header h1').textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Handle "Today" button
    document.querySelector('.today-btn').addEventListener('click', function() {
        // Scroll to current day column
        document.querySelector('.current-day').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });
});