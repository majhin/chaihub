import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap"; // Import Bootstrap components
import { useDispatch } from "react-redux";
import { showAlert } from "../reducers/alertSlice"; // Import your showAlert action

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/user/forgot-password`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				}
			);

			if (response.ok) {
				const data = await response.json();

				// Dispatch a success message
				dispatch(
					showAlert({
						type: "Success",
						message: data.message,
					})
				);
			} else {
				// Handle the error case here and dispatch a failure message
				dispatch(
					showAlert({
						type: "Failure",
						message: data.message,
					})
				);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<Container className='mt-5'>
			<Row className='justify-content-center'>
				<Col xs={12} md={6}>
					<Form onSubmit={handleSubmit}>
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

						<div className='row mt-3'>
							<div className='row-cols-1 d-flex justify-content-center'>
								<button className='btn btn-success' type='submit'>
									Reset Password
								</button>
							</div>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default ForgotPassword;
