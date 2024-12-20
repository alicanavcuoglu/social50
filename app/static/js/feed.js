// Like post
document.querySelectorAll(".like-btn").forEach((likeBtn) => {
	const postId = likeBtn.getAttribute("data-post-id");

	// On like click
	likeBtn.addEventListener("click", () => {
		fetch(`/like/${postId}`, { method: "POST" })
			.then((response) => response.json())
			.then((data) => {
				// Update like count
				document.querySelector(
					`.like-count-${postId}`
				).textContent = `${data.likes} like${
					data.likes != 1 ? "s" : ""
				}`;

				if (data.isLiked) {
					likeBtn.classList.add("active");
				} else {
					likeBtn.classList.remove("active");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
});

// Add comment
document.querySelectorAll(".add-comment").forEach((addCommentBtn) => {
	addCommentBtn.addEventListener("click", () => {
		const post = addCommentBtn.closest(".post");
		const postId = post.getAttribute("data-post-id");

		const commentInput = post.querySelector(".comment-input");

		if (commentInput.value) {
			fetch(`/comment/${postId}`, {
				method: "POST",
				body: JSON.stringify(commentInput.value),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => location.reload())
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	});
});

// Load more comments
document.querySelectorAll(".load-more-comments").forEach((loadBtn) => {
	loadBtn.addEventListener("click", () => {
		const postId = loadBtn.getAttribute("data-post-id");
		let page = parseInt(loadBtn.getAttribute("data-page"));

		if (postId) {
			fetch(`/post/${postId}/comments?page=${page}`)
				.then((response) => response.json())
				.then((data) => {
					if (data.comments.length > 0) {
						data.comments.forEach((comment) => {
							const commentDiv = document.createElement("div");
							commentDiv.classList.add("comment");
							commentDiv.setAttribute(
								"data-comment-id",
								comment.id
							);
							commentDiv.id = `comment-${comment.id}`;

							commentDiv.innerHTML = `
								<a href="/profiles/${comment.user.username}"><img
								src="${comment.user.image || "/static/placeholder.jpg"}"
								alt="${comment.user.username}" class="avatar xs margin-t-2">
								</a>
								<div class="d-flex flex-column align-items-baseline">
									<div class="comment-span text-break">
											<a href="/profiles/${
												comment.user.username
											}" class="text-decoration-none text-secondary">
											<strong>${comment.user.name} ${comment.user.surname}</strong>
											</a>
											<span class="text-secondary lh-sm small">${comment.content}
											</span>
									</div>
									<div class="flex align-items-center">
											<span
												class="text-muted text-xs fw-light cursor-pointer"
												data-bs-toggle="tooltip"
												data-bs-placement="bottom"
												title="${comment.created_at_iso}"
												>${comment.created_at}</span
												>
											${
												comment.is_liked_by_user
													? '<button class="my-btn text-muted comment-like-btn active">Unlike</button>'
													: '<button class="my-btn text-muted comment-like-btn">Like</button>'
											}
											${
												comment.own_post
													? '<button class="my-btn text-danger delete-comment-btn">Delete</button>'
													: ""
											}
											<div
												class="d-inline small fw-light"
												data-bs-toggle="tooltip"
												data-bs-placement="right"
												title="${comment.total_likes} likes">
												<span
														class="comment-like-count-${comment.id}"
														>${comment.total_likes}</span
														>
												<i
														class="fa-solid fa-thumbs-up text-success fs-6"></i>
											</div>
									</div>
								</div>          
                `;
							loadBtn.previousElementSibling.appendChild(
								commentDiv
							);
						});

						page++;
						loadBtn.setAttribute("data-page", page);

						// If no more comments, hide button
						if (!data.has_next) {
							loadBtn.style.display = "none";
						}
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	});
});

// Delete post
document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
	deleteBtn.addEventListener("click", () => {
		const modal = deleteBtn.closest(".modal");
		const postId = modal.getAttribute("data-post-id");

		fetch(`/post/delete/${postId}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then((data) => location.reload())
			.catch((error) => {
				console.error("Error:", error);
				location.reload()
			});
	});
});

// Like or delete comment
document.addEventListener("click", (e) => {
	// Check if clicked to comment like button
	if (e.target.classList.contains("comment-like-btn")) {
		const commentId = e.target
			.closest(".comment")
			.getAttribute("data-comment-id");

		fetch(`/like/comment/${commentId}`, { method: "POST" })
			.then((response) => response.json())
			.then((data) => {
				document.querySelector(
					`.comment-like-count-${commentId}`
				).textContent = String(data.likes);

				if (data.isLiked) {
					e.target.textContent = "Unlike";
					e.target.classList.add("active");
				} else {
					e.target.textContent = "Like";
					e.target.classList.remove("active");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	// Check if clicked to delete comment button
	if (e.target.classList.contains("delete-comment-btn")) {
		const comment = e.target.closest(".comment");
		const commentId = comment.getAttribute("data-comment-id");
		console.log(commentId)

		if (confirm("Are you sure you want to delete this comment?")) {
			fetch(`/comment/delete/${commentId}`, { method: "DELETE" })
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						location.reload()
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	}
});
