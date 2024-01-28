import React from "react";
import InputController from "./InputController";
import Button from "./Button";
import { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const Navigate = useNavigate();

  useEffect(()=>{
     const user=JSON.parse(localStorage.getItem("userInfo"));
     if(user){
        Navigate("/home");
     }
  },[])

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userExistsError,setUserExistsError]=useState("");
    const [error,setError]=useState({})
  const rgExp=/^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/;
  var namePattern = /^[a-zA-Z\s]+$/;
  const handleRegister = async (e) => {
    e.preventDefault();
   let validationError=false;
    setError({});

    if (userDetails.name=== "") {
      setError((prev)=>({...prev,name:"Name is required!"})) 
      setUserExistsError("");
      validationError=true;
    }
    else if(!namePattern.test(userDetails.name)){
      setError((prev)=>({...prev,name:"Name is not valid!"}))
      setUserExistsError("");
      validationError=true;
    }
    if (userDetails.email === "") {
      setError((prev)=>({...prev,email:"Email is required!"})) 
      setUserExistsError("");
      validationError=true;
    }
    else if(!rgExp.test(userDetails.email)) {
      setError((prev)=>({...prev,email:"Email is not valid!"}));
      setUserExistsError("");
      validationError=true;
    }
    if (userDetails.password === "") {
      setError((prev)=>({...prev,password:"Password is required!"})) 
      setUserExistsError("");
      validationError=true;
    }

    if(!validationError){
      console.log(userDetails);
      try {
        axios
          .post(process.env.REACT_APP_BACKEND_URL+"/user/register", userDetails)
          .then((response) => {
            if (response.status === 201) {
              localStorage.setItem("userInfo", JSON.stringify(response.data));
              Navigate("/home");
            } else {
              setUserExistsError("User allready exist!")
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div
      style={{ background: "#6593f7" }}
      className="d-flex flex-column justify-content-center align-items-center vh-100"
    >
     
      <div style={{ width: "500px" }} className="bg-white rounded p-5">
        <form className="row">
          <h1 className="text-center mb-3">Signup</h1>
          <InputController
            req={true}
            error={error.name}
            label="Enter your Name"
            type="text"
            placeholder="Enter your name"
            name="name"
            value={userDetails.name}
            onChange={(event) =>
              setUserDetails((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <InputController
          req={true}
            label="Enter your Email"
            error={error.email}
            type="email"
            placeholder="example@gmail.com"
            name="email"
            value={userDetails.email}
            onChange={(event) =>
              setUserDetails((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <InputController
          req={true}
            label="Enter Password"
            error={error.password}
            type="password"
            placeholder="Enter password"
            name="password"
            value={userDetails.password}
            onChange={(event) =>
              setUserDetails((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
          />
        {userExistsError && <p className="fs-5 fw-bold text-center text-danger m-0"> {userExistsError}</p>}
          <div className="d-grid">
            {" "}
            <Button type="submit" msg="Register" onClick={handleRegister} />
          </div>

          <p className="text-center mt-3">
            Already registerd? Click here to <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
