import { Container, Row, Col } from "react-bootstrap";

function NotFound() {
	return (
		<Container className='text-center mt-5'>
			<Row>
				<Col>
					<h1 className='display-4'>404 - Page Not Found</h1>
					<p className='lead'>Oops! It seems you've ventured into the void.</p>
					<p>👽 It looks like this page doesn't exist. 👻</p>
					<p>
						Perhaps you should try a different path? IN YOUR LIFE, huihuihui
					</p>
				</Col>
			</Row>
		</Container>
	);
}

export default NotFound;
