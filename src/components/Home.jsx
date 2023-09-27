import { useState, useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";

import Loader from "../aaacomp/Loader";
import PostForm from "../aaacomp/PostForm";
import CommentModal from "../aaacomp/CommentModal";
import PostModal from "../aaacomp/PostModal";
import ShareModal from "../aaacomp/ShareModal";
import { fetchPosts } from "../reducers/postSlice";

const PostList = lazy(() => import("../aaacomp/PostList"));

function Home({ navigate, socket }) {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.jwt);
	const posts = useSelector((state) => state.posts);
	const localSocket = socket;
	const [postModalShow, setPostModalShow] = useState(false);
	const [commentModalShow, setCommentModalShow] = useState(false);
	const [shareModalShow, setShareModalShow] = useState(false);
	const [selectedPostId, setSelectedPostId] = useState("");
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [postToBeUpdated, setPostToBeUpdated] = useState(null);

	const fetchComments = async (postID) => {
		try {
			const response = await fetch(
				`http://${
					import.meta.env.VITE_SERVER_URL
				}/api/v1/feed/get-all-comments`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ postID }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				setComments(data.post);
			} else {
				console.error("Error fetching comments:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
		} finally {
			setLoading(false); // Set loading back to false after the request is completed
		}
	};

	const fetchPost = async (postID) => {
		try {
			const response = await fetch(
				`http://${
					import.meta.env.VITE_SERVER_URL
				}/api/v1/feed/get-post/${postID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setPostToBeUpdated(data.post);
			} else {
				console.error("Error fetching posts:", data.error);
			}
		} catch (error) {
			console.error("Error:", error);
		}
		setPostModalShow(true);
	};

	useEffect(() => {
		if (token === null) {
			navigate("/", { replace: true });
			return;
		}
		dispatch(fetchPosts(token));
	}, [token, dispatch]);

	const handleOpenShareModal = (postID) => {
		setSelectedPostId(postID);
		setShareModalShow(true);
	};

	const handleCloseShareModal = () => {
		setSelectedPostId("");
		setShareModalShow(false);
	};

	const handleOpenPostModal = async (postID) => {
		fetchPost(postID);
	};

	const handleClosePostModal = () => {
		setPostToBeUpdated(null);
		setPostModalShow(false);
	};

	const handleOpenCommentModal = async (postID) => {
		fetchComments(postID);
		setSelectedPostId(postID);
		setCommentModalShow(true);
	};

	const handleCloseCommentModal = () => {
		setSelectedPostId("");
		setCommentModalShow(false);
	};

	return (
		<Container className='mt-2'>
			<Row className='justify-content-center position-sticky '>
				<Col xs={12} md={6}>
					<PostForm fetchPosts={fetchPosts} socket={socket} />
				</Col>
			</Row>
			<Row className='mt-4'>
				<Col xs={12} md={12}>
					<Suspense fallback={<Loader />}>
						<PostList
							posts={posts}
							handleOpenCommentModal={handleOpenCommentModal}
							handleOpenPostModal={handleOpenPostModal}
							handleOpenShareModal={handleOpenShareModal}
							socket={socket}
						/>
					</Suspense>
				</Col>
			</Row>
			<CommentModal
				handleCloseCommentModal={handleCloseCommentModal}
				commentModalShow={commentModalShow}
				post={comments}
				loading={loading}
				fetchComments={fetchComments}
				selectedPostId={selectedPostId}
				socket={socket}
			/>
			<PostModal
				handleClosePostModal={handleClosePostModal}
				postModalShow={postModalShow}
				postToBeUpdated={postToBeUpdated}
				fetchPosts={fetchPosts}
				socket={localSocket}
			/>
			<ShareModal
				handleCloseShareModal={handleCloseShareModal}
				shareModalShow={shareModalShow}
				selectedPostId={selectedPostId}
				socket={socket}
			/>
		</Container>
	);
}

export default Home;
