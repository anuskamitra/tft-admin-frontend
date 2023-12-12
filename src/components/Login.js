import React from 'react'
import InputController from './InputController'
import Button from './Button'
import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
function Login() {
  const navigate=useNavigate();
    const [userDetails,setUserDetails]=useState({email:"", password:""})
    const [userNotFoundError,setUserNotFoundError]=useState("");
    const [error,setError]=useState({})
    const rgExp=/^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/
     const handleLogin=async(e)=>{
      e.preventDefault();
      let validationError=false;
      setError({email:"", password:""})
      console.log(userDetails)
      if (userDetails.email === "") {
        setError((prev)=>({...prev,email:"Email is required!"}))
        setUserNotFoundError(""); 
        validationError=true;
      }
      else if(!rgExp.test(userDetails.email)) {
        setError((prev)=>({...prev,email:"Email is not valid!"}));
        setUserNotFoundError(""); 
        validationError=true;
      }
      if (userDetails.password === "") {
        setError((prev)=>({...prev,password:"Password is required!"})) 
        validationError=true;
      }
      if(!validationError){
      try{
        axios.post("http://localhost:8080/user/login",userDetails)
        .then(response=>{
          if(response.status===201){
            localStorage.setItem("userInfo",JSON.stringify(response.data))
            navigate("/home")
          }
          else{
            if(response.data==="notFound"){
              setUserNotFoundError("User not Found!");
            }
            else{
              setError((prev)=>({...prev,password:"Password do not match!"}));
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
      <div style={{width:"500px"}}className='bg-white rounded p-5'>
        <form>
          <h1 className='text-center'>Login</h1>
          <InputController req={true} label="Enter your Email" error={error.email} placeholder="example@gmail.com"  type="email" required name="email" value={userDetails.email} onChange={(event)=>setUserDetails((prev)=>({...prev,email:event.target.value}))}/>
          <InputController req={true} label="Enter Password" error={error.password} type="password"  placeholder="Enter password" required name="password" value={userDetails.password }onChange={(event)=>setUserDetails((prev)=>({...prev,password:event.target.value}))}/>
          {userNotFoundError && <p className="fs-5 fw-bold text-center text-danger m-0">{userNotFoundError}</p>}

         <div className='d-grid'>
          <Button type="submit" msg="Login" onClick={handleLogin}/>
          </div> 

          <p className='text-center mt-3'>Have not registerd?
          Click here to <Link to="/">Signup </Link>  </p> 
        </form>
        </div>
        </div>

  )
}

export default Login