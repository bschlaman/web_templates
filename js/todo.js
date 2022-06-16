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
			// console.log(bucket);
			const dragging = document.querySelector(".task.dragging");
			bucket.appendChild(dragging);
		});
	});
})();
