let tasks;
tasks = JSON.parse(localStorage.getItem('tasks'));
tasks = tasks == null ? [] : tasks;

$(document).ready(() => {
	reversedTasks = tasks.slice().reverse();

	if (reversedTasks.length == 0) {
		$('#todo').append($('<li class="list-group-item empty"> \
								<p>no tasks to display.</p> \
							</li>'));
	}

	for (i in reversedTasks) {
		$('#todo').append($('<li class="list-group-item" id="todo-' + reversedTasks[i].id + '"> \
								<p class="todo-text">' + reversedTasks[i].text + '</p> \
								<input type="text" class="edit-input"> \
								<div class="controls"> \
									<i class="material-icons edit">mode edit</i> \
									<i class="material-icons check">done</i> \
									<i class="material-icons trash">delete</i> \
								</div> \
							</li>'));

		if (reversedTasks[i].done) {
			$('#todo-' + reversedTasks[i].id).addClass('done');
		}
	}

	progress();
});

function createTask() {
	if ($('#new-todo').val() != "") {
		var newTask = new Object();
		newTask.id = tasks[tasks.length-1] == undefined ? 0 : parseInt(tasks[tasks.length-1].id) + 1;
		newTask.created = + Date.now();
		newTask.text = $('#new-todo').val();
		newTask.done = false;

		$('#todo').prepend($('<li class="list-group-item" id="todo-' + newTask.id + '"> \
									<p class="todo-text">' + newTask.text + '</p> \
									<input type="text" class="edit-input"> \
									<div class="controls"> \
										<i class="material-icons edit">mode edit</i> \
										<i class="material-icons check">done</i> \
										<i class="material-icons trash">delete</i> \
									</div> \
								</li>'));

		tasks.push(newTask);
		localStorage.setItem('tasks', JSON.stringify(tasks));

		$('#new-todo').val("");
		$('.empty').remove();

		tasks = JSON.parse(localStorage.getItem('tasks'));
	}
	else {
		$('#new-todo').css('border-bottom', '1px solid #e74c3c');
		setTimeout(() => {
			$('#new-todo').css('border-bottom', '1px solid #bbb');
		}, 2000);
	}

	progress();
}

function progress() {
	var numTasks = tasks.length;
	var numDoneTasks = tasks.filter((task) => {
		return task.done;
	}).length;
	var perc = parseInt(100 * (numDoneTasks / numTasks));

	$("#progress").css('width', perc + '%');
}

$(document).on('click', '#create-todo', () => {
	createTask();
});
$(document).on('keypress', '#new-todo', (e) => {
	if (e.which == 13) {
		createTask();
	}
});

$(document).on('click', '.edit, .todo-text', (event) => {
	var task = $(event.currentTarget).parents('.list-group-item');
	var taskId = task.attr('id').split('-')[1];
	
	for (i in tasks) {
		if (tasks[i].id == taskId) {
			task.children('.todo-text').hide();
			task.children('.edit-input').val(task.children('.todo-text').text());
			task.children('.edit-input').show();
			task.children('.edit-input').focus();
		}
	}
});
$(document).on('keyup', '.edit-input', (event) => {
	var task = $(event.currentTarget).parents('.list-group-item');
	var taskId = task.attr('id').split('-')[1];

	if (event.which == 13 && $(event.currentTarget).val() != "") {
		for (i in tasks) {
			if (tasks[i].id == taskId) {
				tasks[i].text = $(event.currentTarget).val();
				task.children('.todo-text').text($(event.currentTarget).val());
				task.children('.edit-input').hide();
				task.children('.todo-text').show();
			}
		}

		localStorage.setItem('tasks', JSON.stringify(tasks));
		tasks = JSON.parse(localStorage.getItem('tasks'));
	}
	else if (event.which == 27) {
		task.children('.edit-input').hide();
		task.children('.todo-text').show();
	}
});
$(document).on('focusout', '.edit-input', (event) => {
	var task = $(event.currentTarget).parents('.list-group-item');
	var taskId = task.attr('id').split('-')[1];

	task.children('.edit-input').hide();
	task.children('.todo-text').show();
});

$(document).on('click', '.check', (event) => {
	var task = $(event.currentTarget).parents('.list-group-item');
	var taskId = task.attr('id').split('-')[1];
	
	for (i in tasks) {
		if (tasks[i].id == taskId) {
			tasks[i].done = !tasks[i].done;
		}

		if (tasks[i].done) {
			$('#todo-' + tasks[i].id).addClass('done');
		}
		else {
			$('#todo-' + tasks[i].id).removeClass('done');
		}
	}

	localStorage.setItem('tasks', JSON.stringify(tasks));
	tasks = JSON.parse(localStorage.getItem('tasks'));

	progress();
});

$(document).on('click', '.trash', (event) => {
	var task = $(event.currentTarget).parents('.list-group-item');
	var taskId = task.attr('id').split('-')[1];
	
	for (i in tasks) {
		if (tasks[i].id == taskId) {
			tasks.splice(i, 1);
			task.remove();
		}
	}

	if (tasks.length == 0) {
		$('#todo').append($('<li class="list-group-item empty"> \
								<p>no tasks to display.</p> \
							</li>'));
	}

	localStorage.setItem('tasks', JSON.stringify(tasks));
	tasks = JSON.parse(localStorage.getItem('tasks'));

	progress();
});