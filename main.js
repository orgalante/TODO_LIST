let myTasks = []; // **ONE SOURCE OF TRUTH** 
const myTasksKey = "OrG_Tasks";
init();


// initial func
function init() {
    resetInputTaskForm();
    loadTasks();
}

function resetInputTaskForm() {
    const taskTxtElement = getElem("taskTxtInput");
    const taskFormElement = getElem("newTaskForm");
    taskFormElement.reset();
    const today = new Date();
    getElem("taskTimeInput").value = "" + (today.getHours() + 1) + ":00";
    getElem("taskDateInput").valueAsDate = today;
    taskTxtElement.focus();
}

// create new task 
function addTask() {
    event.preventDefault();// no refresh of page
    // get input elements 
    const taskTxtElement = getElem("taskTxtInput");
    const taskDateElement = getElem("taskDateInput");
    const taskTimeElement = getElem("taskTimeInput");
    // task object from inputs
    const task = {
        text: strip(taskTxtElement.value),
        date: taskDateElement.value,
        time: taskTimeElement.value
    };
    myTasks.push(task);
    saveMyTasks(); // to local storage
    loadTasks(); // from local storage
    resetInputTaskForm();
    animateFadeInById(myTasks.length - 1);
}

// animate element with fade in effect
function animateFadeInById(id) {
    const elem = document.getElementById(id);
    if (elem) {
        elem.animate(
            [// keyframes
                { opacity: 0 },
                { opacity: 1 }
            ],
            {// timing options
                duration: 1000,
                iterations: 1,
            }
        );
    }
}

// get tasks from Local Storage + display
function loadTasks() {
    const dataStr = localStorage.getItem(myTasksKey);
    if (dataStr) {
        let obj = JSON.parse(dataStr);
        if (typeof obj === "object") {
            myTasks = obj;
            displayMyTasks();
        }
    }
}

// save tasks on Local Storage
function saveMyTasks() {
    const dataStr = JSON.stringify(myTasks);
    localStorage.setItem(myTasksKey, dataStr);
}

// show tasks on screen
function displayMyTasks() {
    const tasksContainer = getElem("myTasksContainer");
    let html = "";
    for (item in myTasks) {
        const text = strip(myTasks[item].text);
        const date = new Date(myTasks[item].date);
        const dateStr = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
        html +=
            `
            <div class="taskDiv" id = "${item}" onmouseenter="showX(this)" onmouseleave="hideX(this)">
                <a href="#" id="${item}_task_close_btn" btn="${item}" onclick="removeTask(this)" 
                    style= "display : none;" class="btn-dark task-btn btn-sm ">
                    <span class="glyphicon glyphicon-remove"></span>
                </a>
                <div class="task-body overflow-auto p-3 " style=" max-height: 170px;">
                    <p id ="${item}_text_p" class="task_p " width: 130px; >${text}</p>
                </div> 
                <div class="task-footer">
                    <p class="mt-1 mb-0 mx-1 fw-bold ">${dateStr}</p>
                    <p class=" mx-1 fw-bold ">${myTasks[item].time}</p>
                </div>
            </div>
    
            `;
    }
    tasksContainer.innerHTML = html;
}

// function to remove any html tags from a string
function strip(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

// function to show the delete task button
function showX(task_div) {
    const btn = document.getElementById(task_div.id).firstElementChild;
    if (btn.nodeName === "A") btn.style.display = "";
}

// function to hide the delete task button
function hideX(task_div) {
    const btn = document.getElementById(task_div.id).firstElementChild;
    if (btn.nodeName === "A") btn.style.display = "none";
}

// function delete task from DB (LocalStorage) + display
function removeTask(elem) {
    const nbr = elem.getAttribute("btn");
    myTasks.splice(nbr, 1);
    saveMyTasks();
    loadTasks();
}

// short get element call
function getElem(id) {
    return document.getElementById(id);
}
