// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Generate a unique task id
function generateTaskId() {
  if (!nextId) {nextId = 1;} else {
    nextId++;
}
localStorage.setItem("nextId", JSON.stringify(nextId));
return nextId;
}


// Create a task card
function createTaskCard(task) {
  return `
    <div class="task-card card mb-2" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">Due: ${task.dueDate}</p>
        <button class="btn btn-danger delete-task">Delete</button>
      </div>
    </div>
  `;
}

// Render the task list and make cards draggable
function renderTaskList() {
  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
  });

  $(".task-card").draggable({
    revert: "invalid",
    start: function (event, ui) {
      $(this).css('z-index', 100);
    },
    stop: function (event, ui) {
      $(this).css('z-index', 1);
    }
  });
}

// Handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = $('#taskTitle').val();
  const dueDate = $('#dueDate').val();
  const newTask = {
    id: generateTaskId(),
    title: title,
    dueDate: dueDate,
    status: 'todo'
  };
  
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
  renderTaskList();
  $('#formModal').modal('hide');
  $('#addTaskForm')[0].reset();
}

// Handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest('.task-card').data('id');
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.data('id');
  const newStatus = $(this).attr('id').replace('-cards', '');
  const task = taskList.find(task => task.id === taskId);
  task.status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Initialize on page load
$(document).ready(function () {
  renderTaskList();

  $("#addTaskForm").on("submit", handleAddTask);
  $(document).on("click", ".delete-task", handleDeleteTask);

  $(".lane .card-body").droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  $('#dueDate').datepicker({
    dateFormat: "yy-mm-dd"
  });
});
