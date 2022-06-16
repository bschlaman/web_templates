(function (){
	const tasks = document.querySelectorAll(".task");
	const buckets = document.querySelectorAll(".todo-app-bucket");

	tasks.forEach(task => {
		task.addEventListener("dragstart", () => {
			task.classList.add("dragging");
		});

		task.addEventListener("dragend", () => {
			task.classList.remove("dragging");
		});

	});

	buckets.forEach(bucket => {
		bucket.addEventListener("dragover", e => {
			e.preventDefault();
			const dragging = document.querySelector(".task.dragging");
			const belowTask = getClosestTaskBelowCursor(bucket, e.clientY);
			if(belowTask === null){
				bucket.appendChild(dragging);
			} else {
				bucket.insertBefore(dragging, belowTask);
			}
		});
	});

	function getClosestTaskBelowCursor(bucket, y){
		const nonDraggingTasks = [...bucket.querySelectorAll(".task:not(.dragging)")];

		return nonDraggingTasks.reduce((closestTask, task) => {
			const box = task.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;
			if(offset < 0 && offset > closestTask.offset)
				return { offset: offset, element: task };
			return closestTask;
		}, { offset: Number.NEGATIVE_INFINITY }).element;
	}
})();
