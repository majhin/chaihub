import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";

import Socket from "./components/Socket";
import Alert from "./aaacomp/Alert";
import CustomNavbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Timeline from "./components/Timeline";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import Auth from "./components/Auth";
import GoogleHandler from "./components/GoogleHandler";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import Inbox from "./components/Inbox";

function App() {
	const navigate = useNavigate();
	const [globalSocket, setGlobalSocket] = useState(null);
	return (
		<>
			<Socket setGlobalSocket={setGlobalSocket} />
			<Alert />
			<CustomNavbar />
			<Routes>
				<Route path='/' element={<Auth />} />
				<Route
					path='/home'
					element={<Home navigate={navigate} socket={globalSocket} />}
				/>
				<Route path='/sign-up' element={<SignUp navigate={navigate} />} />
				<Route path='/sign-in' element={<SignIn navigate={navigate} />} />
				<Route path='/timeline' element={<Timeline navigate={navigate} />} />
				<Route
					path='/google-handler'
					element={<GoogleHandler navigate={navigate} />}
				/>
				<Route path='/forgot-password' element={<ForgotPassword />} />
				<Route
					path='/reset-password'
					element={<ResetPassword navigate={navigate} />}
				/>
				<Route path='/profile' element={<Profile navigate={navigate} />} />
				<Route path='/inbox' element={<Inbox navigate={navigate} />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
