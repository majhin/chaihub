import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loader from "../aaacomp/Loader";

function Profile({ navigate }) {
	const token = useSelector((state) => state.auth.jwt);
	const user = useSelector((state) => state.user);
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		if (token === null) {
			navigate("/", { replace: true });
		}
		const fetchUserProfile = async () => {
			try {
				const response = await fetch(
					`http://${import.meta.env.VITE_SERVER_URL}/api/v1/user/profile`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.ok) {
					const data = await response.json();
					setUserData(data.user); // Update user data state
				} else {
					console.error("Error fetching user profile:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching user profile:", error);
			}
		};

		fetchUserProfile();
	}, [token, user]);

	return (
		<div className='container mt-5'>
			<Card className='text-center' data-bs-theme={"dark"}>
				<Card.Body>
					{userData ? (
						<>
							<Card.Title>{userData.name}</Card.Title>
							<Card.Subtitle className='mb-2 text-muted'>
								{userData.email}
							</Card.Subtitle>
						</>
					) : (
						<Loader />
					)}
				</Card.Body>
			</Card>
		</div>
	);
}

export default Profile;
