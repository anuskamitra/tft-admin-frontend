import React, { useCallback, useEffect, useState } from "react";
import InputController from "./InputController";
import axios from "axios";
import Button from "./Button";
import Styles from "./StudentForm.module.css";

function StudentForm(props) {
 
  const [error, setError] = useState({});
  const[studentExistsError,setStudentExistsError]=useState("");
  const [collegeName, setCollegeName] = useState([]);
  const rgExp = /^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/;
  const namePattern = /^[a-zA-Z\s]+$/;
 
  const getCollege = () => {
    try {
      axios
        .get("http://localhost:8080/college/fetchcolleges")
        .then((response) => {
          console.log(response);
          setCollegeName(response.data);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmitStudentFrom = (e) => {
    e.preventDefault();
    setError({});
    let validationError=false;

    if (props.studentDetails.name === "") {
      setError((prev) => ({ ...prev, name: "Name is required!" }));
      console.log("Invalid Name:", props.studentDetails.name);
      validationError=true;
    } 
    else if (!namePattern.test(props.studentDetails.name)) {
      setError((prev) => ({ ...prev, name: "Name is not valid!" }));
      console.log("Invalid Name:"+ props.studentDetails.name);
      validationError=true;
      
    }
    if (props.studentDetails.college === "") {
      console.log("Invalid Name:"+ props.studentDetails.name);
      setError((prev) => ({ ...prev, college: "College is required!" }));
      validationError=true;
     
    }
    if (props.studentDetails.email === "") {
      setError((prev) => ({ ...prev, email: "Email is required!" }));
      validationError=true;
    } 
    else if (!rgExp.test(props.studentDetails.email)) {
      setError((prev) => ({ ...prev, email: "Email is not valid!" }));
      validationError=true;
    } 
    if(!validationError){
      setError({});
      try {
        axios
          .post("http://localhost:8080/api/addnew", props.studentDetails)
          .then((response) => {
            console.log(response.data);
            if (response.data === "alreadyexist") {
              setStudentExistsError("Student already in the list");
            } else {
              console.log(props.studentDetails);
              props.setShowStudentForm(false);
              props.getStudent();
              props.setStudentDetails({
                id: "",
                name: "",
                email: "",
                parent: "",
                college: "",
                birthDay: "",
                department: "",
                address: "",
              });
            }
          });
      } catch (err) {
        console.log("data not stored");
      }
    }
  };
  const handleUpdateStudentFrom = (e) => {
    e.preventDefault();
    setError({});
    console.log(props.studentDetails);
    let validationError=false;
    if (props.studentDetails.name === "") {
      setError((prev) => ({ ...prev, name: "Name is required!" }));
      validationError=true;
    } 
    else if (!namePattern.test(props.studentDetails.name)) {
      setError((prev) => ({ ...prev, name: "Name is not valid!" }));
      validationError=true;  
    }
    if (props.studentDetails.college === "") {
      setError((prev) => ({ ...prev, college: "College is required!" }));
      validationError=true;
    }
    if (props.studentDetails.email === "") {
      setError((prev) => ({ ...prev, email: "Email is required!" }));
      validationError=true
    } else if (!rgExp.test(props.studentDetails.email)) {
      setError((prev) => ({ ...prev, email: "Email is not valid!" }));
      validationError=true
    } 
    if(!validationError){
      props.setShowStudentForm(false);
      props.setUpdateStudent(false);
      try {
        console.log(props.studentDetails);
        axios
          .post("http://localhost:8080/api/update", props.studentDetails)
          .then((response) => {
            console.log(response);
            props.getStudent();
            props.setStudentDetails({
              id: "",
              name: "",
              email: "",
              parent: "",
              college: "",
              birthDay: "",
              department: "",
              address: "",
            });
          });
      } catch (err) {
        console.log("data not stored");
      }
    }
  };
  const clearForm = () => {
    props.setShowStudentForm(false);
    props.setStudentDetails({
      id: "",
      name: "",
      email: "",
      parent: "",
      college: "",
      birthDay: "",
      department: "",
      address: "",
    });
    props.setUpdateStudent(false);
  };
  useEffect(() => {
    getCollege();
  }, []);
  return (
    <React.Fragment>
      <div className={Styles.container} onClick={clearForm}></div>

      <div className={Styles.body}>
        <h3 className="text-center pt-3">
          {props.updateStudent ? "Update the Student" : "Add a Student"}
        </h3>
        <form className="mt-2">
          <InputController
            label="Name of the Student"
            error={error.name}
            req={true}
            type="text"
            placeholder="Enter your name"
            name="name"
            value={props.studentDetails.name}
            onChange={(event) =>
              props.setStudentDetails({
                ...props.studentDetails,
                name: event.target.value,
              })
            }
          />

          <InputController
            label="Email"
            type="email"
            error={error.email}
            req={true}
            name="email"
            placeholder="example@gmail.com"
            required
            value={props.studentDetails.email}
            onChange={(event) =>
              props.setStudentDetails({
                ...props.studentDetails,
                email: event.target.value,
              })
            }
          />

          <label className="fw-2">
            College/University name<span style={{ color: "red" }}>*</span>
          </label>
          <select
            className={`form-select ${error.college && "border border-danger"}`}
            onChange={(event) =>
              props.setStudentDetails({
                ...props.studentDetails,
                college: event.target.value,
              })
            }
          >
            <option value={props.studentDetails.college}>
              {props.studentDetails.collegeName}
            </option>
            {collegeName.map((college) => {
              return <option value={college._id}>{college.Name}</option>;
            })}
          </select>
          <p className="text-danger">{error.college}</p>

          <InputController
            label="Date Of birth"
            type="date"
            name="birthDay"
            value={props.studentDetails.birthDay}
            onChange={(event) =>
              props.setStudentDetails({
                ...props.studentDetails,
                birthDay: event.target.value,
              })
            }
          />
          <InputController
            label="Department"
            type="text"
            name="department"
            placeholder="Department"
            value={props.studentDetails.department}
            onChange={(event) =>
              props.setStudentDetails({
                ...props.studentDetails,
                department: event.target.value,
              })
            }
          />
        {studentExistsError && <p className="fs-5 fw-bold text-center text-danger m-0">{studentExistsError}</p>}
          {props.updateStudent ? (
            <div className="d-grid">
              {" "}
              <Button
                msg="Submit"
                type="submit"
                onClick={handleUpdateStudentFrom}
              />
            </div>
          ) : (
            <div className="d-grid">
              <Button
                msg="Submit"
                type="submit"
                onClick={handleSubmitStudentFrom}
              />{" "}
            </div>
          )}
        </form>
      </div>
    </React.Fragment>
  );
}

export default StudentForm;
