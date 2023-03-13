import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserObject = {
	  token: string, 
    username: string
};

export interface UserState {
    value: { token: string | null, 
            username: string | null
        }
};

const initialState : UserState = {
  value: { token: "", username: "" },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state:UserState, action: PayloadAction<UserObject>) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
    },
    logout: (state:UserState) => {
      state.value.token = null;
      state.value.username = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
