import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { showAlert } from "../reducers/alertSlice";
import { setJwt } from "../reducers/authSlice";
import { setUser } from "../reducers/userSlice";
import Loader from "../aaacomp/Loader";

function ResetPassword({ navigate }) {
	const location = useLocation();
	const dispatch = useDispatch();
	const searchParams = new URLSearchParams(location.search);
	const [token, setToken] = useState(searchParams.get("token"));
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(true);
	const [userID, setUserID] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);
	const [resetPassCalled, setResetPassCalled] = useState(false);

	(async function resetPass() {
		if (resetPassCalled) {
			return;
		}
		setResetPassCalled(true);
		try {
			const response = await fetch(
				`http://${
					import.meta.env.VITE_SERVER_URL
				}/api/v1/user/reset-password/${token}`
			);
			const data = await response.json();

			if (response.ok) {
				setToken(data.data.token);
				setUserID(data.data.userID);
				setLoading(false);
				dispatch(showAlert({ type: "Success", message: data.message }));
			} else {
				setLoading(false);
				dispatch(
					showAlert({ type: "Failure", message: "Invalid / Expired URL" })
				);
				navigate("/404", { replace: true });
			}
		} catch (error) {
			console.error("Error:", error);
			setLoading(false);
			dispatch(
				showAlert({
					type: "Failure",
					message: "An error occurred while processing your request",
				})
			);
		}
	})();

	useEffect(() => {
		setIsFormValid(password === confirmPassword && password !== "");
	}, [password, confirmPassword]);

	const handleClick = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/user/create-password`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token, userID, password }),
				}
			);

			if (res.ok) {
				const data = await res.json();
				dispatch(showAlert({ type: "Success", message: data.message }));
				dispatch(setJwt(null));
				dispatch(setUser(null));
				localStorage.removeItem("cornHubJWT");
				localStorage.removeItem("cornHubUser");
				navigate("/", { replace: true });
			} else {
				dispatch(
					showAlert({ type: "Failure", message: "Password change failed" })
				);
			}
		} catch (error) {
			console.error("Error:", error);
			dispatch(
				showAlert({
					type: "Failure",
					message: "An error occurred while processing your request",
				})
			);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<Container className='mt-5'>
			<Row className='justify-content-center'>
				<Col xs={12} md={6}>
					<Form onSubmit={(e) => handleClick(e)}>
						<div className='form-floating mb-3'>
							<input
								type='password'
								className='form-control'
								id='password'
								placeholder='Password'
								name='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<label htmlFor='password'>Password</label>
						</div>

						<div className='form-floating mb-3'>
							<input
								type='password'
								className='form-control'
								id='confirmPassword'
								placeholder='Confirm Password'
								name='confirmPassword'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
							<label htmlFor='confirmPassword'>Confirm Password</label>
						</div>
						<div className='row mt-3'>
							<div className='row-cols-1 d-flex justify-content-center'>
								<button
									className='btn btn-success'
									type='submit'
									disabled={!isFormValid}
								>
									Create New Password
								</button>
							</div>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default ResetPassword;
