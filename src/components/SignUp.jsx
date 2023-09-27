import { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { showAlert } from "../reducers/alertSlice";

function SignUp({ navigate }) {
	const jwtToken = useSelector((state) => state.auth.jwt);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const dispatch = useDispatch();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			// Make a request to your server to fetch the JWT
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/user/create-user`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name, email, password }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				dispatch(
					showAlert({
						type: "Success",
						message: `${data.message}`,
					})
				);
				navigate("/", { replace: true });
			} else {
				console.error("An error occurred in creating the user");
				dispatch(
					showAlert({
						type: "Failure",
						message: `Internal Server Error`,
					})
				);
			}
		} catch (error) {
			console.error("An error occurred in creating the user", error);
		}
	};
	useEffect(() => {
		// Check if 'name' is present in the Redux store and redirect to home if it is
		if (jwtToken !== null) {
			navigate("/", { replace: true });
		}
	}, [jwtToken]);
	return (
		<Container className='mt-5'>
			<h1 className='text-center '>🌽</h1>
			<Row className='justify-content-center'>
				<Col xs={12} md={6}>
					<Form onSubmit={handleSignUp}>
						<div className='form-floating mb-3'>
							<input
								type='text'
								className='form-control'
								id='floatingName'
								placeholder='Name'
								name='name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
							<label htmlFor='floatingName'>Full Name</label>
						</div>
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
									Sign Up
								</button>
							</div>
						</div>
						<div className='row mt-3'>
							<div className='row-cols-1 d-flex justify-content-center '>
								<Link to='/sign-in' className='btn btn-primary  btn-block'>
									Sign In
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

export default SignUp;
