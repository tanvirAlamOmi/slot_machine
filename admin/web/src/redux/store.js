import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import registerSlice from '../sections/auth/register/registerSlice'
import loginSlice from '../sections/auth/login/loginSlice'

export default configureStore({
    reducer: {
        user: userReducer,        
        register: registerSlice,
        login: loginSlice,

    }
})