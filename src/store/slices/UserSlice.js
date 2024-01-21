import {createSlice} from "@reduxjs/toolkit"

const userSlice=createSlice({
    name:"user",
    initialState:{
        type: {},
        loggedIn:{
            loggedInAsCollege:false,
            collegeId:"",
            collegeName:""
        },
    },
    reducers:{
        typeOfUser(state,action){
            return { ...state, type: action.payload  };
        },
        loggedInAsCollege(state,action){
            return {...state, loggedIn:action.payload}
        }
    }

})
console.log(userSlice.actions)
export {userSlice}
export const {typeOfUser,loggedInAsCollege,authUser}=userSlice.actions