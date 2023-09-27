import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
	if (localStorage.getItem("cornHubUser")) {
		const user = JSON.parse(localStorage.getItem("cornHubUser"));
		return user;
	}
	return null;
};

const userSlice = createSlice({
	name: "user",
	initialState: getInitialUser(),
	reducers: {
		setUser: (state, action) => {
			return action.payload; // This returns a new state object with the user data
		},
	},
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
