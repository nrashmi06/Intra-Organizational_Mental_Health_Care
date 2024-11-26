import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string | null;
  email: string | null;
  anonymousName: string | null;
  role: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  userId: null,
  email: null,
  anonymousName: null,
  role: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.anonymousName = action.payload.anonymousName;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
    },
    clearUser: (state) => {
      state.userId = null;
      state.email = null;
      state.anonymousName = null;
      state.role = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
