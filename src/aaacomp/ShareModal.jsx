import { Row, Col, Form, Button, Modal, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import debounce from "lodash.debounce";

import { showAlert } from "../reducers/alertSlice";

function ShareModal(props) {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.jwt);
	const user = useSelector((state) => state.user);
	const { handleCloseShareModal, shareModalShow, selectedPostId, socket } =
		props;
	const localSocket = socket;
	const [isLoading, setIsLoading] = useState(false);
	const [isValidUser, setIsValidUser] = useState(false);
	const [toUserEmail, setToUserEmail] = useState("");
	let toEmail;

	const checkValidUser = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`http://${
					import.meta.env.VITE_SERVER_URL
				}/api/v1/user/check-valid-user/${toEmail}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setIsLoading(false);
				if (data.status) {
					setIsValidUser(true);
				} else {
					setIsValidUser(false);
				}
			} else {
				setIsValidUser(false);
			}
		} catch (error) {
			console.error("Error checking user validity:", error);
			setIsValidUser(false);
		}
	};

	const debouncedCheckValidUser = debounce(() => checkValidUser(toEmail), 500);

	const handleInputChange = (email) => {
		toEmail = email;
		setToUserEmail(email);

		debouncedCheckValidUser();
		// Trigger the debounced API request when the user stops typing
	};

	const handleSharePost = async () => {
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/share-post`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						toEmail: toUserEmail,
						postID: selectedPostId,
					}),
				}
			);
			let data;
			if (response.ok) {
				if (localSocket) {
					localSocket.emit("ping", "ping");
					localSocket.emit("newShare", {
						toEmail: toUserEmail,
						postID: selectedPostId,
						currentUserEmail: user.email,
					});
				}
				data = await response.json();
				dispatch(
					showAlert({
						type: "Success",
						message: data.message,
					})
				);
				handleCloseShareModal();
			} else {
				data = await response.json();
			}
		} catch (error) {
			console.error("An error occurred while sharing the post", error);
		}
	};

	return (
		<Modal
			show={shareModalShow}
			onHide={() => {
				handleCloseShareModal();
				toEmail = "";
				setIsValidUser(false);
				setToUserEmail("");
				setIsLoading(false);
			}}
			backdrop='static'
			keyboard={false}
		>
			<Modal.Header closeButton>
				<Modal.Title className='text-center '>
					Iske alawa koi kaam hai
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form className='w-75'>
					<Row className='mb-2'>
						<Col className='row p-2'>
							<div className='form-floating  '>
								<input
									type='email'
									className='form-control'
									id='floatingInput'
									placeholder='Enter email'
									onChange={(e) => handleInputChange(e.target.value)}
									required
								/>
								<label htmlFor='floatingInput' className='ms-2'>
									Who's that bish
								</label>
							</div>
						</Col>
						{isValidUser && (
							<span className='col-1 d-flex align-items-center '>✅</span>
						)}
						{!isValidUser && (
							<span className='col-1 d-flex align-items-center '>❌</span>
						)}
					</Row>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					onClick={() => {
						handleCloseShareModal();
						toEmail = "";
						setIsValidUser(false);
						setToUserEmail("");
						setIsLoading(false);
					}}
				>
					Close
				</Button>
				<Button
					variant='primary'
					onClick={handleSharePost}
					disabled={!isValidUser}
				>
					Share Post
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ShareModal;
