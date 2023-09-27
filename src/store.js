import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./reducers/authSlice";
import alertSlice from "./reducers/alertSlice";
import userSlice from "./reducers/userSlice";
import postSlice from "./reducers/postSlice";

export const store = configureStore({
	reducer: {
		alert: alertSlice,
		auth: authSlice,
		user: userSlice,
		posts: postSlice,
	},
});
