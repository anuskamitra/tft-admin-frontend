import {createSlice} from "@reduxjs/toolkit"

const userSlice=createSlice({
    name:"user",
    initialState:{},
    reducers:{
        typeOfUser(state,action){
            return { ...state, ...action.payload };
        }
    }

})
console.log(userSlice.actions)
export {userSlice}
export const {typeOfUser}=userSlice.actions