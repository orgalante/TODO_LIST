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
    const hours = (today.getHours() + 1) > 9 ? (today.getHours() + 1) : "0" + (today.getHours() + 1);
    getElem("taskTimeInput").value = hours + ":00";
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
    const elem = getElem(id);
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
    if (event) event.preventDefault();
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
    if (event) event.preventDefault();
    const tasksContainer = getElem("myTasksContainer");
    let html = "";
    for (item in myTasks) {
        const text = strip(myTasks[item].text);
        const date = new Date(myTasks[item].date);
        const dateStr = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
        html =
            `
            <div class="taskDiv" 
            id = "${item}" onmouseenter="showBtns(this)" onmouseleave="hideBtns(this)">
                <a href="#" id="${item}_task_close_btn" btn="${item}" onclick="removeTask(this)" 
                    style= "display : none;" 
                    class="btn-dark task-close-btn btn-sm ">
                    <span class="glyphicon glyphicon-remove"></span>
                </a>
                <a href="#" id="${item}_task_edit_btn" btn="${item}" onclick="editTask(this)" 
                    style= "display : none;" 
                    class="btn-dark task_edit_btn btn-sm ">
                    <span class="glyphicon glyphicon-pencil"></span>
                </a>
                <div class="task-body overflow-auto p-3 " style=" max-height: 170px;">
                    <p id ="${item}_text_p" class="task_p ">${text}</p>
                </div> 
                <div class="task-footer">
                    <p class="mt-1 mb-0 mx-1 fw-bold ">${dateStr}</p>
                    <p class=" mx-1 fw-bold ">${myTasks[item].time}</p>
                </div>
            </div>
    
            `+ html;
    }
    tasksContainer.innerHTML = html;
}

// function to remove any html tags from a string
function strip(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

// function to show the delete task button
function showBtns(task_div) {
    let buttons = getElem(task_div.id).children;
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].tagName == "A") buttons[i].style.display = "";
    }
}

// function to hide the delete task button
function hideBtns(task_div) {
    let buttons = getElem(task_div.id).children;
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].tagName == "A") buttons[i].style.display = "none";
    }
}

// function delete task from DB (LocalStorage) + display
function removeTask(elem) {
    const nbr = elem.getAttribute("btn");
    myTasks.splice(nbr, 1);
    saveMyTasks();
    loadTasks();
}

// edit task content
function editTask(elem) {
    event.preventDefault();// no refresh of page
    const anyOtherEditElem = document.querySelector(".editTaskContainer");
    if (anyOtherEditElem) {
        loadTasks();
    }

    const item = elem.getAttribute("btn");
    let container = getElem(item);
    container.className = "taskDiv editTaskContainer";

    if (container) {
        const text = strip(myTasks[item].text);
        container.innerHTML =
            `
        <a href="#" id="${item}_task_edit_close_btn" btn="${item}" onclick="displayMyTasks()" style="display : none;"
            class="btn-dark task-close-btn btn-sm">
            <span class="glyphicon glyphicon-remove"></span>
        </a>
        <div class="task-body overflow-auto" style=" max-height: 170px;">
            <textarea id="taskTxtInput_edit_${item}" rows="3" 
            class="task_p form-control round fs-2">${text}</textarea>
        </div>
        <div class="task-footer">
            <input type="date" id="taskDateInput_edit_${item}" class="form-control round">
            <input type="time" id="taskTimeInput_edit_${item}" value="${myTasks[item].time}" class="form-control round">
        </div>
        <a href="#" id="${item}_task_ok_btn" btn="${item}" onclick="saveEditTask(this)" style="display : none;"
            class="btn-dark task-ok-btn btn-sm">
            <span class="glyphicon glyphicon-ok"></span>
        </a>
        `;
        const editDateElem = getElem(`taskDateInput_edit_${item}`);
        const date = new Date(myTasks[item].date);
        if (editDateElem && date) editDateElem.valueAsDate = date;
        const input = getElem(`taskTxtInput_edit_${item}`);
        input.focus();

    }

}

// save edited task 
function saveEditTask(elem) {
    const item = elem.getAttribute("btn");
    event.preventDefault();// no refresh of page
    // get input elements 
    const taskTxtElement = getElem(`taskTxtInput_edit_${item}`);
    const taskDateElement = getElem(`taskDateInput_edit_${item}`);
    const taskTimeElement = getElem(`taskTimeInput_edit_${item}`);
    // task object from inputs
    const task = {
        text: strip(taskTxtElement.value),
        date: taskDateElement.value,
        time: taskTimeElement.value
    };
    myTasks[item] = task;
    saveMyTasks(); // to local storage
    loadTasks(); // from local storage
    animateFadeInById(item);
}

// short get element call
function getElem(id) {
    return document.getElementById(id);
}
