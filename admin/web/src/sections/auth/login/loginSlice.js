import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

// login.rejected not returung error at redux

export const login = createAsyncThunk("user/login", 
async(body) => {
    const res = await axios.post('http://127.0.0.1:5000/auth/login', {
                email: body.email,
                password: body.password,
            })
console.log(res.data);
    return res.data;

})

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        auth: false,
        loading: false,
        error: '',
        data: {}
    },

    extraReducers: {
        [login.pending]: (state) => {
            state.loading = true;
        },
        [login.fulfilled]: (state, action) => {
            state.loading = false;
            state.auth = true;
            state.data = action.payload
        },
        [login.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export default loginSlice.reducer