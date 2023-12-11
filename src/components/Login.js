import React from 'react'
import InputController from './InputController'
import Button from './Button'
import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"

function Login() {
  const navigate=useNavigate();
    const [userDetails,setUserDetails]=useState({email:"", password:""})
    const [error,setError]=useState("");
    
     const handleLogin=async(e)=>{
      e.preventDefault();
      console.log(userDetails)
      if (
        userDetails.email === "" ||
        userDetails.name === "" ||
        userDetails.password === ""
      ) {
        setError("Please fill all the details to register!");
      }
      else{
      try{
        axios.post("http://localhost:8080/user/login",userDetails)
        .then(response=>{
          if(response.status===201){
            localStorage.setItem("userInfo",JSON.stringify(response.data))
            navigate("/home")
          }
          else{
            if(response.data==="notFound"){
              setError("User not Found!");
            }
            else{
              setError("Password do not match!");
            }
          }
        })
      }catch(err){
        console.log(err);
      }
     
     }                                    
       
    }
                                             
  return (
      <div style={{background:" #6593f7"}}className='d-flex flex-column justify-content-center align-items-center vh-100'>
         {error && <p className="fs-4 text-danger">{error}</p>}
      <div style={{width:"500px"}}className='bg-white rounded p-5'>
        <form>
          <h1 className='text-center'>Login</h1>
          <InputController req={true} label="Enter your Email" placeholder="example@gmail.com"  type="email" required name="email" value={userDetails.email} onChange={(event)=>setUserDetails((prev)=>({...prev,email:event.target.value}))}/>
          <InputController req={true} label="Enter Password"  type="password"  placeholder="Enter password" required name="password" value={userDetails.password }onChange={(event)=>setUserDetails((prev)=>({...prev,password:event.target.value}))}/>
         <div className='d-grid'><Button type="submit" msg="Login" onClick={handleLogin}/></div> 
          <p className='text-center mt-3'>Have not registerd?
          Click here to <Link to="/">Signup </Link>  </p> 
        </form>
        </div>
        </div>

  )
}

export default Login