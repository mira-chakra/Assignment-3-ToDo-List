
// SELECT THE HTML ELEMENTS
// I select the HTML elements that I need to use in JavaScript.

const taskForm = document.querySelector("#taskForm");

const taskInput = document.querySelector("#taskInput");

const taskList = document.querySelector("#taskList");

const message = document.querySelector("#message");

const taskStats = document.querySelector("#taskStats");

const clearCompletedButton =
    document.querySelector("#clearCompleted");



// I load the tasks saved in localStorage when the page opens.
// If there are no saved tasks, loadTasks() gives me an empty array.

let tasks = loadTasks();


// I display the tasks when the page first opens.

renderTasks();


//add a new task

function addTask() {

    // I get the text written by the user.
    // trim() removes unnecessary spaces.

    const title = taskInput.value.trim();


    // I check that the user did not enter an empty task.

    if (title === "") {

        message.textContent =
            "Please write a task first.";

        return;
    }


    // I create an object to represent the new task.

    const newTask = {

        // I use Date.now() to create a unique id.

        id: Date.now(),

        title: title,

        completed: false,

        pinned: false
    };


    // I add the new task object to my tasks array.

    tasks.push(newTask);


    // I save the updated array in localStorage.

    saveTasks();


    // I display the updated list.

    renderTasks();


    // I clear the input after adding the task.

    taskInput.value = "";


    // I remove any previous error message.

    message.textContent = "";


    // I put the cursor back inside the input.

    taskInput.focus();
}


//create one task elemnent
function createTaskElement(task) {

    // I create an <li> for one task.

    const li = document.createElement("li");


    // I add the class used by my CSS.

    li.classList.add("task-item");


    // I save the task id inside data-id.
    // I will use this id later to know which task was clicked.

    li.dataset.id = task.id;



    // If the task is completed,
    // I add the "done" CSS class.

    if (task.completed) {

        li.classList.add("done");
    }



    // If the task is pinned,
    // I add the "pinned" CSS class.

    if (task.pinned) {

        li.classList.add("pinned");
    }


//check button

    // I create the button used to complete a task.

    const checkButton =
        document.createElement("button");


    checkButton.type = "button";


    checkButton.classList.add("check-btn");


    // If the task is completed I show ✓.
    // Otherwise I show nothing.

    if (task.completed) {

        checkButton.textContent = "✓";

    } else {

        checkButton.textContent = "";
    }



 //task content

    // This div will contain the task name and badges.

    const content =
        document.createElement("div");


    content.classList.add("task-content");



    // I create a paragraph for the task name.

    const title =
        document.createElement("p");


    title.classList.add("task-title");

    title.textContent = task.title;



    // This div contains labels such as Done and Pinned.

    const info =
        document.createElement("div");


    info.classList.add("task-info");



    // If the task is completed,
    // I display the Done badge.

    if (task.completed) {

        const doneBadge =
            document.createElement("span");


        doneBadge.classList.add(
            "badge",
            "badge-done"
        );


        doneBadge.textContent = "Done";


        info.append(doneBadge);
    }



    // If the task is pinned,
    // I display the Pinned badge.

    if (task.pinned) {

        const pinnedBadge =
            document.createElement("span");


        pinnedBadge.classList.add(
            "badge",
            "badge-pinned"
        );


        pinnedBadge.textContent = "Pinned";


        info.append(pinnedBadge);
    }



    // I put the title and badges inside the content.

    content.append(title);

    content.append(info);


//avtion button

    // I create one container for the action buttons.

    const actions =
        document.createElement("div");


    actions.classList.add("task-actions");



    // Pin button

    const pinButton =
        document.createElement("button");


    pinButton.type = "button";


    pinButton.classList.add(
        "icon-btn",
        "pin-btn"
    );


    pinButton.textContent = "📌";



    // Edit button

    const editButton =
        document.createElement("button");


    editButton.type = "button";


    editButton.classList.add(
        "icon-btn",
        "edit-btn"
    );


    editButton.textContent = "✏️";



    // Delete button

    const deleteButton =
        document.createElement("button");


    deleteButton.type = "button";


    deleteButton.classList.add(
        "icon-btn",
        "delete-btn"
    );


    deleteButton.textContent = "🗑";



    // I put the three buttons inside the actions div.

    actions.append(pinButton);

    actions.append(editButton);

    actions.append(deleteButton);



    // I put everything inside the <li>.

    li.append(checkButton);

    li.append(content);

    li.append(actions);



    // I return the complete HTML element.

    return li;
}


// SORT TASKS


function sortTasks() {

    // I sort the tasks so pinned tasks appear first.

    tasks.sort(function (a, b) {


        // First I compare the pinned state.

        if (a.pinned !== b.pinned) {

            return b.pinned - a.pinned;
        }


        // Then I put unfinished tasks
        // before completed tasks.

        if (a.completed !== b.completed) {

            return a.completed - b.completed;
        }


        // Finally I put the newest task first.

        return b.id - a.id;
    });
}

// DISPLAY ALL TASKS


function renderTasks() {

    // I remove the old HTML tasks before displaying
    // the list again so I do not create duplicates.

    taskList.innerHTML = "";


    // I sort the tasks before displaying them.

    sortTasks();


    // I update the number of completed tasks.

    showCompletedCount();



    // If there are no tasks,
    // I show an empty-state message.

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <li class="empty-state">
                No tasks yet.
                Add your first task 🌸
            </li>
        `;

        return;
    }



    // I use map() to transform every task object
    // into an HTML <li> element.

    const taskElements =
        tasks.map(createTaskElement);



    // I use forEach() to add every created <li>
    // inside the task list.

    taskElements.forEach(function (li) {

        taskList.append(li);
    });
}


// COUNT COMPLETED TASKS USING REDUCE()


function showCompletedCount() {

    // I use reduce() because I want to calculate
    // one final value from my array:
    // the number of completed tasks.

    const completedCount =
        tasks.reduce(
            function (count, task) {

                // If the task is completed,
                // I increase the counter.

                if (task.completed) {

                    return count + 1;
                }


                // Otherwise I keep the same number.

                return count;
            },

            // My counter starts from 0.

            0
        );


    // I display the result in the taskStats paragraph.

    taskStats.textContent =
        completedCount +
        " of " +
        tasks.length +
        " done";


    // I disable Clear Completed
    // when there are no completed tasks.

    if (completedCount === 0) {

        clearCompletedButton.disabled = true;

    } else {

        clearCompletedButton.disabled = false;
    }
}

// COMPLETE / UNCOMPLETE TASK


function toggleTask(id) {

    // I use map() because I want to modify
    // one task without removing the other tasks.

    tasks = tasks.map(function (task) {


        // I look for the task with the correct id.

        if (task.id === id) {

            return {

                // I copy the old task information.

                ...task,


                // I change completed:
                // false becomes true
                // true becomes false.

                completed: !task.completed
            };
        }


        // Other tasks stay unchanged.

        return task;
    });


    saveTasks();

    renderTasks();
}


// PIN / UNPIN TASK


function togglePin(id) {

    // I use map() to change the pinned state
    // of only one task.

    tasks = tasks.map(function (task) {


        if (task.id === id) {

            return {

                ...task,

                pinned: !task.pinned
            };
        }


        return task;
    });


    saveTasks();

    renderTasks();
}


// EDIT TASK

function editTask(id) {

    // I use find() to find the task
    // that has the selected id.

    const taskToEdit =
        tasks.find(function (task) {

            return task.id === id;
        });



    // If I cannot find the task,
    // I stop the function.

    if (!taskToEdit) {

        return;
    }



    // I ask the user to write a new task title.

    const newTitle =
        prompt(
            "Edit your task:",
            taskToEdit.title
        );



    // If the user presses Cancel,
    // prompt() returns null.

    if (newTitle === null) {

        return;
    }



    // I remove extra spaces.

    const cleanTitle =
        newTitle.trim();



    // I do not allow an empty task name.

    if (cleanTitle === "") {

        message.textContent =
            "Task name cannot be empty.";

        return;
    }



    // I use map() to change the title
    // of only the correct task.

    tasks = tasks.map(function (task) {


        if (task.id === id) {

            return {

                ...task,

                title: cleanTitle
            };
        }


        return task;
    });



    message.textContent = "";


    saveTasks();

    renderTasks();
}


// DELETE ONE TASK


function deleteTask(id) {

    // I use filter() because I want to create
    // a new array without the selected task.

    tasks = tasks.filter(function (task) {


        // I keep every task whose id
        // is different from the deleted task.

        return task.id !== id;
    });


    saveTasks();

    renderTasks();
}

// CLEAR ALL COMPLETED TASKS


function clearCompletedTasks() {

    // I use filter() to keep only tasks
    // that are not completed.

    tasks = tasks.filter(function (task) {

        return task.completed === false;
    });


    saveTasks();

    renderTasks();
}

// SAVE TASKS IN LOCALSTORAGE


function saveTasks() {

    // localStorage can only save text.
    // JSON.stringify() converts my array into text.

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

// LOAD TASKS FROM LOCALSTORAGE


function loadTasks() {

    // I get the saved tasks from localStorage.

    const savedTasks =
        localStorage.getItem("tasks");



    // If nothing was saved before,
    // I return an empty array.

    if (!savedTasks) {

        return [];
    }



    // I use try/catch because JSON.parse()
    // can cause an error if the saved data is invalid.

    try {

        // I convert the saved text back to JavaScript.

        const data =
            JSON.parse(savedTasks);



        // I check that the saved data is really an array.

        if (Array.isArray(data)) {

            return data;
        }



        // If it is not an array,
        // I start with an empty array.

        return [];

    } catch (error) {

        // If an error happens,
        // I prevent the application from crashing.

        console.log(
            "Problem loading tasks."
        );


        return [];
    }
}


// I listen for the submit event.
// It works when the user clicks Add Task
// or presses Enter.

taskForm.addEventListener(
    "submit",
    function (event) {


        // I prevent the form from refreshing the page.

        event.preventDefault();


        // Then I call my addTask function.

        addTask();
    }
);


// ======================================================

// Instead of adding a separate event listener
// to every task button,
// I use only one listener on the task list.
//
// This is called event delegation.

taskList.addEventListener(
    "click",
    function (event) {


        // I find the task that contains
        // the button that was clicked.

        const li =
            event.target.closest(
                ".task-item"
            );



        // If the user did not click inside a real task,
        // I stop the function.

        if (!li) {

            return;
        }



        // I get the id stored in data-id.
        // dataset gives me text,
        // so I convert it into a number.

        const id =
            Number(li.dataset.id);



        // DELETE BUTTON

        if (
            event.target.closest(
                ".delete-btn"
            )
        ) {

            deleteTask(id);

            return;
        }



        // EDIT BUTTON

        if (
            event.target.closest(
                ".edit-btn"
            )
        ) {

            editTask(id);

            return;
        }



        // PIN BUTTON

        if (
            event.target.closest(
                ".pin-btn"
            )
        ) {

            togglePin(id);

            return;
        }



        // CHECK BUTTON

        if (
            event.target.closest(
                ".check-btn"
            )
        ) {

            toggleTask(id);

            return;
        }
    }
);



// When the user clicks Clear Completed,
// I call the function that removes completed tasks.

clearCompletedButton.addEventListener(
    "click",
    function () {

        clearCompletedTasks();
    }
);