import { Form, Button, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import Loader from "./Loader";
import { showAlert } from "../reducers/alertSlice";
import { fetchPosts } from "../reducers/postSlice";

function CommentModal(props) {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const token = useSelector((state) => state.auth.jwt);
	const [commentText, setCommentText] = useState("");
	const {
		handleCloseCommentModal,
		commentModalShow,
		post,
		loading,
		fetchComments,
		selectedPostId,
		socket,
	} = props;
	const localSocket = socket;

	const handleCommentSubmit = async () => {
		if (commentText === "") {
			dispatch(
				showAlert({
					type: "Naughty Naughty",
					message: "Comment needs to be filled",
				})
			);
			handleCloseCommentModal();
			return;
		}
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/create-comment`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Replace with your actual token
					},
					body: JSON.stringify({
						postID: selectedPostId,
						comment: commentText,
					}),
				}
			);

			if (response.ok) {
				if (localSocket) {
					localSocket.emit("ping", "ping");
					localSocket.emit("newComment", {
						postID: selectedPostId,
						userID: user.id,
					});
				}
				const data = await response.json();
				// Assuming the response includes the newly created comment
				fetchComments(selectedPostId);
				setCommentText("");

				// socket.emit("newComment", selectedPostId);
			} else {
				handleCloseCommentModal();
				dispatch(
					showAlert({
						type: "Meh...",
						message: "It was removed before you could stain it",
					})
				);
				dispatch(fetchPosts(token));
				console.error("Error creating comment:", response.statusText);
			}
		} catch (error) {
			console.error("Error creating comment:", error);
		}
	};

	const handleDeleteComment = async (commentID) => {
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/delete-comment`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Replace with your actual authentication token
					},
					body: JSON.stringify({ commentID }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				// After deleting the comment, fetch the updated posts
				fetchComments(selectedPostId);
			} else {
				const data = await response.json();
			}
		} catch (error) {
			console.error("Error deleting comment:", error);
		}
	};

	return (
		<Modal
			show={commentModalShow}
			onHide={handleCloseCommentModal}
			backdrop='static'
			keyboard={false}
		>
			<Modal.Header closeButton>
				<Modal.Title>{post.title}</Modal.Title> {/* Display the post title */}
			</Modal.Header>
			<Modal.Body>
				<div
					className='post-description-box rounded p-3 mb-3 border border-secondary'
					style={{ maxHeight: "200px", overflowY: "auto" }}
				>
					{post.description}
				</div>
				{loading ? (
					<Loader />
				) : (
					<div>
						{post.comments.map((comment) => (
							<div key={comment._id} className='comment-container mb-3'>
								{/* Render each comment */}
								<div className='d-flex align-items-center border-bottom pb-2'>
									<p className='flex-grow-1 m-0'>{comment.comment}</p>
									{comment.user === user.id && (
										<div className='d-flex justify-content-evenly'>
											<Button
												className='m-1'
												variant='danger'
												size='sm'
												onClick={() => handleDeleteComment(comment._id)}
											>
												Delete
											</Button>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</Modal.Body>
			<Form>
				<div className='form-floating mb-2 p-1 '>
					<textarea
						className='form-control'
						id='floatingTextarea'
						placeholder='Enter Comment'
						style={{ height: "100px" }}
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						required
					></textarea>
					<label htmlFor='floatingTextarea'>Moan it out.... Ugh</label>
				</div>
			</Form>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleCloseCommentModal}>
					Close
				</Button>
				<Button variant='primary' onClick={handleCommentSubmit}>
					Comment
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default CommentModal;
