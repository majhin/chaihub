import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setJwt } from "../reducers/authSlice";
import { showAlert } from "../reducers/alertSlice";
import { setUser } from "../reducers/userSlice";
import "../static/navbar.css";

function CustomNavbar() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	function handleClick() {
		const togglerIcon = document.querySelector(".navbar-toggler-icon");

		if (togglerIcon) {
			togglerIcon.classList.toggle("toggled");
		}
	}

	function handleLogout() {
		localStorage.removeItem("cornHubJWT");
		localStorage.removeItem("cornHubUser");
		dispatch(setJwt(null));
		dispatch(setUser(null));
		dispatch(
			showAlert({
				type: "Success",
				message: "Successfully Logged Out",
			})
		);
		navigate("/sign-in", { replace: true });
	}
	const renderDropdown = user !== null && (
		<>
			<Nav className='ml-auto'>
				<Link to='/home' className='nav-link'>
					Home
				</Link>
				<Link to='/timeline' className='nav-link'>
					Timeline
				</Link>
				<Link to='/inbox' className='nav-link'>
					Inbox
				</Link>
			</Nav>
			<Nav>
				<Dropdown>
					<Dropdown.Toggle
						variant='link'
						id='dropdown-basic'
						className='custom-dropdown-toggle'
					>
						<div className='profile-icon position-relative'></div>
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item as={Link} to='/profile'>
							Profile
						</Dropdown.Item>
						<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Nav>
		</>
	);

	return (
		<>
			<Navbar className={`custom-navbar `} expand='lg' data-bs-theme={"dark"}>
				<Link to='/home' className='navbar-brand ms-5'>
					<img style={{ height: 40, width: 40 }} src='/tea-icon.svg' alt='🍵' />
					<img className='logo' src='/favicon-chai.jpg' alt='Logo' />
				</Link>
				<Navbar.Toggle
					aria-controls='basic-navbar-nav'
					onClick={handleClick}
					className='no-border '
				/>
				<Navbar.Collapse id='basic-navbar-nav'>
					{renderDropdown}
				</Navbar.Collapse>
			</Navbar>
		</>
	);
}

export default CustomNavbar;
