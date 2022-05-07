import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getUser = createAsyncThunk("user", async({id}) =>  fetch(`http://127.0.0.1:5000/users/${id}`).then( (res) => res.json() ))

export const signup = createAsyncThunk("user/signup", 
async(body) =>  fetch(`http://127.0.0.1:5000/auth/signup`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-type':  'application/json',
        },
        body: JSON.stringify({
            username: body.userName,
            email: body.email,
            password: body.password,
        })
    })
    .then((res) => {
        res.json()
    })
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: [],
        loading: false,
        error: null 
    },

    extraReducers: {
        [getUser.pending]: (state) => {
            state.loading = true;
        },
        [getUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.user = [action.payload];
        },
        [getUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        [signup.pending]: (state) => {
            state.loading = true;
        },
        [signup.fulfilled]: (state, action) => {
            state.loading = false;
            state.user = [action.payload];
        },
        [signup.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export default userSlice.reducer