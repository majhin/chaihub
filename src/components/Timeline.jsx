import { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

import PostModal from "../aaacomp/PostModal";

function Timeline({ navigate }) {
	const token = useSelector((state) => state.auth.jwt);
	const user = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [postToBeUpdated, setPostToBeUpdated] = useState(null);
	const [postModalShow, setPostModalShow] = useState(false);

	const fetchUserPosts = async () => {
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/user/timeline`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setUserPosts(data.userPosts);
			} else {
				console.error("Error fetching user posts:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching user posts:", error);
		}
	};

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
				fetchUserPosts();
			} else {
				const errorData = await response.json();
				console.error(errorData.message); // Output error message
			}
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	const fetchPost = async (postID) => {
		try {
			const response = await fetch(
				`http://${
					import.meta.env.VITE_SERVER_URL
				}/api/v1/feed/get-post/${postID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setPostToBeUpdated(data.post);
			} else {
				console.error("Error fetching posts:", data.error);
			}
		} catch (error) {
			console.error("Error:", error);
		}
		setPostModalShow(true);
	};

	const handleOpenPostModal = async (postID) => {
		fetchPost(postID);
	};

	const handleClosePostModal = () => {
		setPostToBeUpdated(null);
		setPostModalShow(false);
	};

	useEffect(() => {
		if (token === null || user === null) {
			navigate("/", { replace: true });
			return;
		}
		fetchUserPosts();
	}, [token, user]);

	return (
		<>
			<Container className='mt-5' data-bs-theme={"dark"}>
				<h1 style={{ color: "white" }}>Welcome, {user && `${user.name}`}</h1>
				<Row>
					{userPosts.map((post) => (
						<Col key={post._id} md={4} className='mb-3'>
							<Card>
								<Card.Body>
									<Card.Title>{post.title}</Card.Title>
									<Card.Text>{post.description}</Card.Text>
								</Card.Body>
								<Card.Footer className='d-flex justify-content-evenly '>
									<div className='m-1 d-inline-block'>
										<Button
											variant='none'
											onClick={() => handleDeletePost(post._id)}
										>
											<img src='/delete.svg' alt='delete' />
										</Button>
									</div>
									<div className='m-1 d-inline-block'>
										<Button
											variant='none'
											onClick={() => handleOpenPostModal(post._id)}
										>
											<img src='/update.svg' alt='update' />
										</Button>
									</div>
								</Card.Footer>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
			<PostModal
				handleClosePostModal={handleClosePostModal}
				postModalShow={postModalShow}
				postToBeUpdated={postToBeUpdated}
				fetchPosts={fetchUserPosts}
			/>
		</>
	);
}

export default Timeline;
