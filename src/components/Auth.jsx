import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { showAlert } from "../reducers/alertSlice";
import { setUser } from "../reducers/userSlice";
import { setJwt } from "../reducers/authSlice";

function Auth() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const jwtToken = useSelector((state) => state.auth.jwt); // Access the JWT token from Redux state

	useEffect(() => {
		// Perform the initial check when the component mounts
		if (jwtToken) {
			(async function checkLoginStatus() {
				// Make a fetch request to check-login route
				const response = await fetch(
					`http://${import.meta.env.VITE_SERVER_URL}/api/v1/user/check-login`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${jwtToken}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (response.ok) {
					const data = await response.json();
					dispatch(setUser(data.user));
					localStorage.setItem("cornHubUser", JSON.stringify(data.user));
					dispatch(
						showAlert({
							type: "Success",
							message: "Successfully Logged In",
						})
					);
					// redirect to the home route
					navigate("/home", { replace: true });
				} else {
					// redirect to the sign-in page
					localStorage.removeItem("cornHubJWT");
					localStorage.removeItem("cornHubUser");
					dispatch(setJwt(null));
					dispatch(setUser(null));
					dispatch(
						showAlert({
							type: "Session Expired",
							message: "Please Login Again",
						})
					);
					navigate("/sign-in", { replace: true });
				}
			})();
		} else {
			navigate("/sign-in", { replace: true });
		}

		// return () => {
		// 	newSocket.disconnect();
		// };
	}, [jwtToken]);

	return null;
}

export default Auth;
