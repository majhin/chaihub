import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function PostModal(props) {
	const token = useSelector((state) => state.auth.jwt);
	const { handleClosePostModal, postModalShow, postToBeUpdated, fetchPosts } =
		props;
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	useEffect(() => {
		if (postToBeUpdated) {
			setTitle(postToBeUpdated.title);
			setDescription(postToBeUpdated.description);
		}
	}, [postToBeUpdated]);

	const handleUpdatePost = async () => {
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/update-post`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						postID: postToBeUpdated._id,
						title,
						description,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				handleClosePostModal();
				fetchPosts();
			} else {
				const data = await response.json();
			}
		} catch (error) {
			console.error("Error updating post:", error);
		}
	};

	return (
		<Modal
			show={postModalShow}
			onHide={handleClosePostModal}
			backdrop='static'
			keyboard={false}
		>
			<Modal.Header closeButton>
				<Modal.Title className='text-center '>Vichaar Badal Lo</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Row className='mb-2'>
						<Col>
							<div className='form-floating'>
								<input
									type='text'
									className='form-control'
									id='floatingInput'
									placeholder='Enter title'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
								/>
								<label htmlFor='floatingInput'>Pop your.... thoughts</label>
							</div>
						</Col>
					</Row>
					<Row className='mb-2'>
						<Col>
							<div className='form-floating'>
								<textarea
									className='form-control'
									id='floatingTextarea'
									placeholder='Enter description'
									style={{ height: "100px" }}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
								></textarea>
								<label htmlFor='floatingTextarea'>Put it in.... words</label>
							</div>
						</Col>
					</Row>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleClosePostModal}>
					Close
				</Button>
				<Button variant='primary' onClick={handleUpdatePost}>
					Update Post
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default PostModal;
