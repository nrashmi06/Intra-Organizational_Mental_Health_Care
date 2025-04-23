import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userId: string | null;
  email: string;
  anonymousName: string;
  role: string;
  accessToken: string ;
}

const initialState: AuthState = {
  userId: "",
  email: "",
  anonymousName: "",
  role: "",
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState>) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.anonymousName = action.payload.anonymousName;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
    },
    clearUser(state) {
      state.userId = "";
      state.email = "";
      state.anonymousName = "";
      state.role = "";
      state.accessToken = "";
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;