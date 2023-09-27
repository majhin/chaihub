import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { decodeToken, isExpired } from "react-jwt"; // Import decodeToken and isExpired from react-jwt
import { useDispatch } from "react-redux";
import { setJwt } from "../reducers/authSlice"; // Define your action to set JWT
import { setUser } from "../reducers/userSlice";
import { showAlert } from "../reducers/alertSlice";

function GoogleHandler({ navigate }) {
	const location = useLocation();
	const dispatch = useDispatch();
	const searchParams = new URLSearchParams(location.search);
	const token = searchParams.get("token");

	useEffect(() => {
		if (token) {
			try {
				localStorage.setItem("cornHubJWT", token);
				// Decode the JWT token using decodeToken from react-jwt
				const decodedToken = decodeToken(token);

				// Check if the token is expired using isExpired from react-jwt
				if (isExpired(token)) {
					console.log("Token is expired");
					navigate("/", { replace: true });
					// Handle token expiration here, e.g., show an error message
				} else {
					// You can access the payload properties here
					const user = JSON.parse(decodedToken.data);
					dispatch(setJwt(token));
					dispatch(setUser(user));
					localStorage.setItem("cornHubUser", JSON.stringify(user));
					dispatch(
						showAlert({
							type: "Success",
							message: "Successfully Logged In",
						})
					);
					navigate("/", { replace: true });
				}
			} catch (error) {
				console.error("Error decoding token:", error);
			}
		}
	}, [token]);

	return null; // You can render any content here if needed
}

export default GoogleHandler;
