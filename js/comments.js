let postComment = (text) => {
	let comments = document.querySelector(".comment-section-wrapper .comments");
	let comment = document.createElement("p");
	comment.innerHTML = text;
	comments.appendChild(comment);
}
