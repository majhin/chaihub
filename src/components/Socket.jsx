import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";

import { showAlert } from "../reducers/alertSlice";
import { fetchPosts } from "../reducers/postSlice";

const Socket = (props) => {
	const { setGlobalSocket } = props;
	const dispatch = useDispatch();
	const jwtToken = useSelector((state) => state.auth.jwt);
	const user = useSelector((state) => state.user);
	const [localSocket, setLocalSocket] = useState(null);

	useEffect(() => {
		const socket = io(`http://${import.meta.env.VITE_SOCKET_URL}`);
		if (jwtToken) {
			socket.emit("authenticate", jwtToken);

			socket.on("authenticated", (data) => {
				if (data.success) {
					setLocalSocket(socket);
					setGlobalSocket(socket);
					console.log("Connected to Socket", socket.id);
				} else {
					console.error("Authentication failed:", data.error);
				}
			});

			socket.on("pong", (string) => {
				console.log(string);
			});

			socket.on("newCommentNotification", ({ message }) => {
				dispatch(
					showAlert({
						type: "New Notification",
						message,
					})
				);
			});

			socket.on("newLikeNotification", (data) => {
				if (data.globalLikes === true) {
					const { postID, postLikes } = data;
					const likeCountSpan = document.getElementById(`like-count-${postID}`);
					if (likeCountSpan) {
						likeCountSpan.textContent = postLikes;
						likeCountSpan.className =
							"position-absolute top-25 start-100  translate-middle badge rounded-pill bg-danger";
					}
				} else {
					dispatch(
						showAlert({
							type: "New Notification",
							message: data.message,
						})
					);
				}
			});

			socket.on("newPostNotification", ({ message }) => {
				dispatch(
					showAlert({
						type: "New Notification",
						message,
					})
				);
				dispatch(fetchPosts(jwtToken));
			});

			socket.on("newShareNotification", ({ message }) => {
				dispatch(
					showAlert({
						type: "Sharing is Caring",
						message,
					})
				);
			});
		}

		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, [jwtToken]);

	return null;
};

export default Socket;
