import { createSlice } from "@reduxjs/toolkit";

const getInitialJwtToken = () => {
	const storedJwt = localStorage.getItem("cornHubJWT");
	return storedJwt || null;
};

const authSlice = createSlice({
	name: "auth",
	initialState: {
		jwt: getInitialJwtToken(),
	},
	reducers: {
		setJwt: (state, action) => {
			state.jwt = action.payload;
		},
	},
});

export const { setJwt } = authSlice.actions;
export default authSlice.reducer;
