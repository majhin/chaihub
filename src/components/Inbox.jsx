import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
	Spinner,
	Alert,
	Card,
	Container,
	Row,
	Col,
	Button,
} from "react-bootstrap"; // Import Bootstrap components as needed

function Inbox(props) {
	const { navigate } = props;
	const token = useSelector((state) => state.auth.jwt);
	const user = useSelector((state) => state.user);
	const [inbox, setInbox] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleGetInbox = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/load-inbox`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setInbox(data.inbox);
			} else {
				setError("Unable to load the inbox");
			}
		} catch (error) {
			console.error("Error loading inbox:", error);
			setError("Internal Server Error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeletePostFromInbox = async (shareID) => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`http://${
					import.meta.env.VITE_SERVER_URL
				}/api/v1/feed/remove-from-notification`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ shareID }),
				}
			);

			if (response.ok) {
				handleGetInbox();
			} else {
				setError("Unable to load the inbox");
			}
		} catch (error) {
			console.error("Error loading inbox:", error);
			setError("Internal Server Error");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (token === null) {
			navigate("/", { replace: true });
		} else {
			handleGetInbox();
		}
	}, [token]);

	return (
		<Container className='mt-5' data-bs-theme={"dark"}>
			<h1 style={{ color: "white" }}>{`${user.name}'s Inbox`}</h1>

			{isLoading && <Spinner animation='border' variant='primary' />}
			{error && <Alert variant='danger'>{error}</Alert>}
			{inbox.length > 0 && (
				<Row>
					{inbox.map((share) => (
						<Col key={share._id} md={4} className='mb-3'>
							<Card>
								{share.what ? (
									<>
										<Card.Body>
											<Card.Title>{share.what.title}</Card.Title>
											<Card.Text>{share.what.description}</Card.Text>
										</Card.Body>
										<Card.Footer className='text-muted d-flex justify-content-evenly align-content-center '>
											<div className='d-flex justify-content-start align-align-items-center  '>
												Shared by <em> {share.from.name}</em>
											</div>
											<div className='m-1 d-inline-block'>
												<Button
													variant='none'
													onClick={() => handleDeletePostFromInbox(share._id)}
												>
													<img src='/delete.svg' alt='delete' />
												</Button>
											</div>
										</Card.Footer>
									</>
								) : (
									<>
										<Card.Body>
											<Card.Title>"This post was deleted"</Card.Title>
										</Card.Body>
										<Card.Footer className='text-muted'>
											<div className='m-1 d-inline-block'>
												<Button
													variant='danger'
													onClick={() => handleDeletePostFromInbox(share._id)}
												>
													Delete
												</Button>
											</div>
										</Card.Footer>
									</>
								)}
							</Card>
						</Col>
					))}
				</Row>
			)}
		</Container>
	);
}

export default Inbox;
