let myTasks = []; // **ONE SOURCE OF TRUTH** 
const myTasksKey = "OrG_Tasks";
init();

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
    // no refresh of page
    event.preventDefault();
    // get input elements 
    const taskTxtElement = getElem("taskTxtInput");
    const taskDateElement = getElem("taskDateInput");
    const taskTimeElement = getElem("taskTimeInput");

    const task = {
        text: strip(taskTxtElement.value),
        date: taskDateElement.value,
        time: taskTimeElement.value
    };
    myTasks.push(task);
    saveMyTasks();
    loadTasks();
    resetInputTaskForm();
    console.log("myTasks ", myTasks[myTasks.length - 1]);

    startNewTaskAnimation(myTasks.length - 1);
}

function startNewTaskAnimation(id) {
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

function loadTasks() {
    console.log("load Tasks()");
    const dataStr = localStorage.getItem(myTasksKey);
    console.log("dataStr:", dataStr);
    if (dataStr) { // means if not null
        let obj = JSON.parse(dataStr);
        if (typeof obj === "object") {
            console.log("my tasks obj", myTasks);
            myTasks = obj;
            displayMyTasks();
        }
    }

}

function saveMyTasks() {
    const dataStr = JSON.stringify(myTasks);
    localStorage.setItem(myTasksKey, dataStr);
}

function displayMyTasks() {
    const tasksContainer = getElem("myTasksContainer");
    let html = "";
    console.log("here")
    for (item in myTasks) {
        console.log("item ", item);
        const text = strip(myTasks[item].text);
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
                    <p class="mt-1 mb-0 mx-1 fw-bold ">${myTasks[item].date}</p>
                    <p class=" mx-1 fw-bold ">${myTasks[item].time}</p>
                </div>
            </div>
    
            `;

    }
    tasksContainer.innerHTML = html;
}

function strip(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

function showX(task_div) {
    const btn = document.getElementById(task_div.id).firstElementChild;
    if (btn.nodeName === "A") btn.style.display = "";
}

function hideX(task_div) {
    const btn = document.getElementById(task_div.id).firstElementChild;
    if (btn.nodeName === "A") btn.style.display = "none";
}

function removeTask(elem) {
    const nbr = elem.getAttribute("btn");
    myTasks.splice(nbr, 1);
    saveMyTasks();
    loadTasks();
}

function getElem(id) {
    return document.getElementById(id);
}
