import { Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchPosts } from "../reducers/postSlice";

function PostForm({ socket }) {
	const dispatch = useDispatch();
	const localSocket = socket;
	const token = useSelector((state) => state.auth.jwt);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleCreatePost = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/create-post`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Replace with your actual token
					},
					body: JSON.stringify({ title, description }),
				}
			);

			if (response.ok) {
				if (localSocket) {
					localSocket.emit("ping", "ping");
					localSocket.emit("newPost");
				}
				setTitle("");
				setDescription("");
				dispatch(fetchPosts(token));
			} else {
				// Handle errors, e.g., show an error message
				console.error("Error creating post:", response.statusText);
			}
		} catch (error) {
			// Handle network errors or other exceptions
			console.error("Error creating post:", error);
		}
	};

	return (
		<Form onSubmit={handleCreatePost} className='mt-2' data-bs-theme={"dark"}>
			<Row className='mb-2'>
				<Col>
					<div className='form-floating' data-bs-theme='dark'>
						<input
							type='text'
							className='form-control'
							id='floatingInput'
							placeholder='Enter title'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
						<label htmlFor='floatingInput' style={{ color: "white" }}>
							Spill the 🍵tea...
						</label>
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
						<label htmlFor='floatingTextarea' style={{ color: "white" }}>
							Make sure its hot 🔥🥵☕
						</label>
					</div>
				</Col>
				<Col xs='auto' className='d-flex align-items-center'>
					<Button variant='warning' type='submit' className='h-100 '>
						Sip n Slurp{" "}
						<span style={{ backgroundColor: "white", borderRadius: 2 }}>
							🧋
						</span>
					</Button>
				</Col>
			</Row>
		</Form>
	);
}

export default PostForm;
