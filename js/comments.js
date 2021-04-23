let postComment = () => {
	let comments = document.querySelector(".comment-section-wrapper .comments");
	let commentText = document.querySelector(".comment-section-wrapper .comment-create input").value;
	let commentElement = document.createElement("p");
	let string = `[ ${Date.now()} ] `;
	commentElement.innerHTML = string + commentText;
	comments.insertBefore(commentElement, comments.firstChild);
}
