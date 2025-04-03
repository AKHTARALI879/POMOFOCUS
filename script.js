// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const authButton = document.getElementById('auth-button');
const startTimer = document.getElementById('start-timer');
const pauseTimer = document.getElementById('pause-timer');
const resetTimer = document.getElementById('reset-timer');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const workDuration = document.getElementById('work-duration');
const breakDuration = document.getElementById('break-duration');
const addTaskButton = document.getElementById('add-task');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks-list');
const closeModal = document.querySelector('.close-modal');

// Timer Variables
let timer;
let timeLeft;
let isBreak = false;
let isRunning = false;
let totalTime;
let progressCircle = document.querySelector('.timer-progress');

// Task Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Theme Management
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark-mode', savedTheme === 'dark');
updateThemeIcon();

// Initialize
initializeTimer();
renderTasks();

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
startTimer.addEventListener('click', startTimerHandler);
pauseTimer.addEventListener('click', pauseTimerHandler);
resetTimer.addEventListener('click', resetTimerHandler);
addTaskButton.addEventListener('click', () => taskModal.style.display = 'block');
closeModal.addEventListener('click', () => taskModal.style.display = 'none');
taskForm.addEventListener('submit', handleTaskSubmit);
workDuration.addEventListener('change', updateTimerSettings);
breakDuration.addEventListener('change', updateTimerSettings);

// Timer Functions
function initializeTimer() {
    timeLeft = workDuration.value * 60;
    totalTime = timeLeft;
    updateTimerDisplay();
}

function startTimerHandler() {
    if (!isRunning) {
        isRunning = true;
        startTimer.disabled = true;
        pauseTimer.disabled = false;
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                playNotificationSound();
                showNotification(isBreak ? 'Work time!' : 'Break time!');
                switchMode();
            }
        }, 1000);
    }
}

function pauseTimerHandler() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startTimer.disabled = false;
        pauseTimer.disabled = true;
    }
}

function resetTimerHandler() {
    clearInterval(timer);
    isRunning = false;
    startTimer.disabled = false;
    pauseTimer.disabled = true;
    initializeTimer();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update progress circle
    const progress = (timeLeft / totalTime) * 283;
    progressCircle.style.strokeDashoffset = progress;
}

function switchMode() {
    isBreak = !isBreak;
    timeLeft = (isBreak ? breakDuration.value : workDuration.value) * 60;
    totalTime = timeLeft;
    updateTimerDisplay();
    startTimerHandler();
}

function updateTimerSettings() {
    if (!isRunning) {
        initializeTimer();
    }
}

// Theme Functions
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Task Management Functions
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        deadline: document.getElementById('task-deadline').value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskModal.style.display = 'none';
    taskForm.reset();
}

function renderTasks() {
    tasksList.innerHTML = '';
    
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.priority !== b.priority) {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.deadline) - new Date(b.deadline);
    });
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <div class="task-info">
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span>${formatDate(task.deadline)}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-button complete-task" data-id="${task.id}">
                    <i class="fas fa-check"></i>
                </button>
                <button class="task-button edit-task" data-id="${task.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-button delete-task" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        tasksList.appendChild(taskElement);
    });
    
    // Add event listeners to task buttons
    document.querySelectorAll('.complete-task').forEach(button => {
        button.addEventListener('click', () => toggleTaskComplete(button.dataset.id));
    });
    
    document.querySelectorAll('.edit-task').forEach(button => {
        button.addEventListener('click', () => editTask(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', () => deleteTask(button.dataset.id));
    });
}

function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-deadline').value = task.deadline;
        
        taskModal.style.display = 'block';
        
        // Remove the task from the list
        tasks = tasks.filter(t => t.id !== parseInt(taskId));
        saveTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== parseInt(taskId));
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function playNotificationSound() {
    const audio = new Audio('notification.mp3');
    audio.play().catch(e => console.log('Audio playback failed:', e));
}

function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('Pomofocus', {
            body: message,
            icon: 'icon.png'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Pomofocus', {
                    body: message,
                    icon: 'icon.png'
                });
            }
        });
    }
}

// Google Authentication
function initializeGoogleAuth() {
    google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleSignIn
    });
    
    google.accounts.id.renderButton(
        document.getElementById('auth-button'),
        { theme: 'outline', size: 'large' }
    );
}

function handleGoogleSignIn(response) {
    const user = response.credential;
    localStorage.setItem('user', user);
    updateAuthUI();
}

function updateAuthUI() {
    const user = localStorage.getItem('user');
    if (user) {
        authButton.innerHTML = '<i class="fas fa-user"></i> Signed in';
        authButton.disabled = true;
    }
}

// Initialize Google Auth
document.addEventListener('DOMContentLoaded', () => {
    if (typeof google !== 'undefined') {
        initializeGoogleAuth();
    }
}); 