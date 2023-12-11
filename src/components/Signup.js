import React from "react";
import InputController from "./InputController";
import Button from "./Button";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const Navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const rgExp=/^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/
  const handleRegister = async (e) => {
    e.preventDefault();
   
    if (
      userDetails.email === "" ||
      userDetails.name === "" ||
      userDetails.password === ""
    ) {
      setError("Please fill all the details to register!");
    } 
    else  if(!rgExp.test(userDetails.email)) {
      setError("Email is not valid!");
    }

    else{
      console.log(userDetails);
      try {
        axios
          .post("http://localhost:8080/user/register", userDetails)
          .then((response) => {
            if (response.status === 201) {
              localStorage.setItem("userInfo", JSON.stringify(response.data));
              Navigate("/home");
            } else {
              setError("User allready exist!")
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
      {error && <p className="fs-4 text-danger">{error}</p>}
      <div style={{ width: "500px" }} className="bg-white rounded p-5">
        <form className="row g-3 needs-validation" novalidate>
          <h1 className="text-center mb-3">Signup</h1>
          <InputController
          req={true}
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
