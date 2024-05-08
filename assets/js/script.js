// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  // Create task card HTML dynamically
  let taskCard = `<div class="card task-card mb-3" id="task-${task.id}">
                    <div class="card-body">
                      <h5 class="card-title">${task.title}</h5>
                      <p class="card-text">${task.description}</p>
                      <p class="card-text">Deadline: ${task.deadline}</p>
                      <button class="btn btn-danger delete-btn">Delete</button>
                    </div>
                  </div>`;
  return taskCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  // Clear existing cards
  $("#not-started-cards").empty();
  $("#completed-cards").empty();
  $("#in-progress-cards").empty();



  taskList.forEach(task => {
    let card = createTaskCard(task);
    $(`#${task.status}-cards`).append(card);
  });



  
// //   // Iterate over tasks and render cards
// for (var i = 0; i < taskList.length; i++) {
//     let task = taskList[i];
//     let card = createTaskCard(task);
//     let status = task.status;
//     let container;
  
//     // Check the status and determine the appropriate container to append the card to
//     if (status === "not-started") {
//       container = document.getElementById("not-started-cards");
//     } else if (status === "in-progress") {
//       container = document.getElementById("in-progress-cards");
//     } else if (status === "completed") {
//       container = document.getElementById("completed-cards");
//     }
  
//     // Append the card to the appropriate container
//     if (container) {
//       container.appendChild(card);
//     }
//   };
//   for(var i=0; i < taskList.length; i++){
//     let card = createTaskCard(taskList[i]);
//     console.log ((`#${taskList[i].status}-cards`))
//     $("#not-started").append(card);
//     // creat if statement for the status 
//   };


  // Make cards draggable
  $(".task-card").draggable({
    revert: "invalid",
    zIndex: 100,
    start: function(event, ui) {
      $(this).addClass("dragging");
    },
    stop: function(event, ui) {
      $(this).removeClass("dragging");
    }
  });
}

// Function to handle adding a new task
function handleAddTask(event){
    console.log ("Hello")
  event.preventDefault();
  let title = $("#task-title").val();
  let description = $("#task-description").val();
  let deadline = $("#task-deadline").val();
  
  // Create new task object
  let newTask = {
    id: generateTaskId(),
    title: title,
    description: description,
    deadline: deadline,
    status: "not-started"
  };
  console.log (newTask)

  // Add new task to task list
  taskList.push(newTask);

  // Save task list and nextId to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);
  $("#task-title").val(" ");
  

  // Render updated task list
  renderTaskList(); // Call the renderTaskList() function after adding a new task

  // Close modal
  $("#task-modal").modal("hide");
}

// Function to handle deleting a task
function handleDeleteTask(event){
  let taskId = $(this).closest(".task-card").attr("id").split("-")[1];
  
  // Remove task from task list
  taskList = taskList.filter(task => task.id != taskId);

  // Save updated task list to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render updated task list
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskId = ui.draggable.attr("id").split("-")[1];
  let newStatus = $(this).attr("id");
  
  // Update status of dropped task
  taskList.forEach(task => {
    if (task.id == taskId) {
      task.status = newStatus;
    }
  });

  // Save updated task list to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render updated task list
  renderTaskList();
}

// Initialize the task board
$(document).ready(function () {
  // Render task list
  renderTaskList();

  // Event listeners
  $("#task-form").on("submit",handleAddTask);
  $(".delete-btn").click(handleDeleteTask);
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  // Event listener for "Add Task" button click to open modal
  $("#new-task-btn").click(function () {
    $("#task-modal").modal("show");
  });
});