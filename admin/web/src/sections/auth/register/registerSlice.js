
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signup = createAsyncThunk("user/signup", 
async(body) => {
    const res = await axios.post('http://127.0.0.1:5000/auth/signup', {
                username: body.userName,
                email: body.email,
                password: body.password,
            })

    return res.data;

})


const registerSlice = createSlice({
    name: 'register',
    initialState: {
        data: {},
        loading: false,
        error: null 
    },

    extraReducers: {
        [signup.pending]: (state) => {
            state.loading = true;
        },
        [signup.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        [signup.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export default registerSlice.reducer