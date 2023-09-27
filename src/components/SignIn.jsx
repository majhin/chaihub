import { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setJwt } from "../reducers/authSlice"; // Define your action to set JWT
import { setUser } from "../reducers/userSlice";
import { showAlert } from "../reducers/alertSlice";

function SignIn({ navigate }) {
	const jwtToken = useSelector((state) => state.auth.jwt);
	const user = useSelector((state) => state.user);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();

	const handleSignIn = async (e) => {
		e.preventDefault();

		try {
			// Make a request to your server to fetch the JWT
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/user/create-session`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("cornHubJWT", data.token);
				dispatch(setUser(data.user));
				localStorage.setItem("cornHubUser", JSON.stringify(data.user));
				dispatch(setJwt(data.token));
				dispatch(
					showAlert({
						type: "Success",
						message: "Successfully Logged In",
					})
				);
				navigate("/home", { replace: true });
			} else {
				const data = await response.json();
				dispatch(
					showAlert({
						type: "Failure",
						message: `${data.message}`,
					})
				);
			}
		} catch (error) {
			console.error("An error occurred", error);
		}
	};

	useEffect(() => {
		// Check if 'name' is present in the Redux store and redirect to home if it is
		if (jwtToken !== null) {
			navigate("/", { replace: true });
		}
	}, [jwtToken, user]);

	return (
		<Container className='mt-5'>
			<Row className='justify-content-center'>
				<Col xs={12} md={6}>
					<Form onSubmit={handleSignIn}>
						<div className='form-floating mb-3'>
							<input
								type='email'
								className='form-control'
								id='floatingInput'
								placeholder='name@example.com'
								name='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<label htmlFor='floatingInput'>Email address</label>
						</div>
						<div className='form-floating mb-3'>
							<input
								type='password'
								className='form-control'
								id='floatingPassword'
								placeholder='Password'
								name='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<label htmlFor='floatingPassword'>Password</label>
						</div>
						<div className='row mt-3 '>
							<div className='row-cols-1 d-flex justify-content-center '>
								<button className='btn btn-success' type='submit'>
									Sign In
								</button>
							</div>
						</div>
						<div className='row mt-3'>
							<div className='row-cols-1 d-flex justify-content-center '>
								<Link to='/sign-up' className='btn btn-primary  btn-block'>
									Sign Up
								</Link>
							</div>
						</div>
						<div className='row mt-3'>
							<div className='row-cols-1 d-flex justify-content-center '>
								<Link
									to='/forgot-password'
									className='btn btn-secondary btn-block'
								>
									Forgot Password
								</Link>
							</div>
						</div>
						<div className='row mt-3'>
							<div className='row-cols-1 d-flex justify-content-center '>
								<Link
									to={`http://${
										import.meta.env.VITE_SERVER_URL
									}/api/v1/user/auth/google`}
									className='btn btn-warning btn-block'
								>
									Log In with Google
								</Link>
							</div>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default SignIn;
