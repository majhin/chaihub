import { useEffect } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { fetchPosts } from "../reducers/postSlice";
import HeartToggle from "../aabcomp/HeartToggle";

function PostList(props) {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.jwt);
	const user = useSelector((state) => state.user);
	const {
		posts,
		handleOpenCommentModal,
		handleOpenPostModal,
		handleOpenShareModal,
		socket,
	} = props;
	const localSocket = socket;
	const handleDeletePost = async (postID) => {
		try {
			// Send a DELETE request to your server's endpoint with the postID
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/delete-post`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Replace with your actual token
					},
					body: JSON.stringify({ postID }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				dispatch(fetchPosts(token));
			} else {
				const errorData = await response.json();
				console.error(errorData.message); // Output error message
			}
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	const handleLikes = async (postID) => {
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/like-post`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Replace with your actual token
					},
					body: JSON.stringify({ postID }),
				}
			);

			if (response.ok) {
				const data = await response.json();

				const popButton = document.getElementById(`pop-button-${postID}`);

				if (popButton) {
					if (data.message === "Like") {
						popButton.innerHTML = `<img src='/unliked.svg' alt='unliked' /><span
					  id="like-count-${postID}"
					>
					  ${data.likeCount}
					</span>`;
					}
					if (data.message === "Unlike") {
						popButton.innerHTML = `<img src='/liked.svg' alt='liked' /><span
					  id="like-count-${postID}"
					>
					  ${data.likeCount}
					</span>`;
					}
				}
				const likeCountSpan = document.getElementById(`like-count-${postID}`);
				if (likeCountSpan) {
					likeCountSpan.className =
						"position-absolute top-25 start-100  translate-middle badge rounded-pill bg-danger";
				}
				if (data.message === "Unlike") {
					if (localSocket) {
						localSocket.emit("ping", "ping");
						localSocket.emit("newLike", {
							postID,
							userID: user.id,
						});
					}
				}
			} else {
				const errorData = await response.json();
				console.error(errorData.message); // Output error message
			}
		} catch (error) {
			console.error("Error liking post:", error);
		}
	};

	useEffect(() => {}, [posts]);
	return (
		<ListGroup className='scrollable-feed' data-bs-theme={"dark"}>
			{posts.map((post) => (
				<Card key={post._id} className='m-2 w-100 '>
					<Card.Body className='d-flex justify-content-between align-items-center'>
						<div>
							<Card.Title>{post.title}</Card.Title>
							<Card.Text>{post.description}</Card.Text>
						</div>
						<div>
							<div className='m-1'>{/* <HeartToggle /> */}</div>
							<div className='m-1'>
								<Button
									id={`pop-button-${post._id}`}
									variant='none'
									className='w-100'
									onClick={() => handleLikes(post._id)}
								>
									{post.poppers.includes(user.id) ? (
										<img src='/liked.svg' alt='liked' />
									) : (
										<img src='/unliked.svg' alt='unliked' />
									)}
									<span
										id={`like-count-${post._id}`}
										className='position-absolute top-25 start-100  translate-middle badge rounded-pill bg-danger'
									>
										{post.poppers.length}
									</span>
								</Button>
							</div>
							<div className='m-1'>
								<Button
									variant='none'
									onClick={() => handleOpenCommentModal(post._id)}
								>
									<img src='/comment.svg' alt='comment' />
								</Button>
							</div>
							{post.user === user.id ? (
								<>
									<div className='m-1'>
										<Button
											className='w-100'
											variant='none'
											onClick={() => handleDeletePost(post._id)}
										>
											<img src='/delete.svg' alt='delete' />
										</Button>
									</div>
									<div className='m-1'>
										<Button
											className='w-100'
											variant='none'
											onClick={() => handleOpenPostModal(post._id)}
										>
											<img src='/update.svg' alt='update' />
										</Button>
									</div>
									<div className='m-1'>
										<Button
											className='w-100'
											variant='none'
											onClick={() => handleOpenShareModal(post._id)}
										>
											<img src='/share.svg' alt='share' />
										</Button>
									</div>
								</>
							) : (
								<div className='m-1'>
									<Button
										className='w-100'
										variant='none'
										onClick={() => handleOpenShareModal(post._id)}
									>
										<img src='/share.svg' alt='share' />
									</Button>
								</div>
							)}
						</div>
					</Card.Body>
				</Card>
			))}
		</ListGroup>
	);
}

export default PostList;
