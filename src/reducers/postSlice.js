import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux"; // Import useSelector

// Define an async thunk to fetch posts
export const fetchPosts = createAsyncThunk(
	"posts/fetchPosts",
	async (token, thunkAPI) => {
		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SERVER_URL}/api/v1/feed/get-all`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				return data.posts;
			} else {
				const errorData = await response.json();
				console.log(errorData);
			}
		} catch (error) {
			console.log(error);
		}
	}
);

const postSlice = createSlice({
	name: "posts",
	initialState: [],
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchPosts.fulfilled, (state, action) => {
			return action.payload;
		});
	},
});

export default postSlice.reducer;
