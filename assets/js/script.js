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
  $(".lane .card-body").empty();
  
  // Iterate over tasks and render cards
  taskList.forEach(task => {
    let card = createTaskCard(task);
    $(`#${task.status}-cards`).append(card);
  });

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

  // Add new task to task list
  taskList.push(newTask);

  // Save task list and nextId to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);

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
  $("#task-form").submit(handleAddTask);
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


