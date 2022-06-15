// window.onload = () => {
// 	let task = document.getElementsByClassName("task")[0];
// 	makeDragable(task, snapToTodoBucket);
// }

function snapToTodoBucket(element){
	const bucketWidth = document.querySelector(".todo-app-bucket").clientWidth;
	const col = Math.floor((element.offsetLeft+element.clientWidth/2) / bucketWidth);
	// TODO: add checks here
	const newParent = document.querySelectorAll(".todo-app-bucket")[col];
	element.parentElement.removeChild(element);
	newParent.appendChild(element);
}
