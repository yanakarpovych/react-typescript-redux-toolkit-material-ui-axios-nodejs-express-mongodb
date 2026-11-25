import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

type AuthState = {
  userId: string | null;
};

const initialState: AuthState = {
  userId: localStorage.getItem("userId"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    logout(state) {
      state.userId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
