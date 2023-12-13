import React, { useEffect, useState } from "react";
import InputController from "./InputController";
import axios from "axios";
import Button from "./Button";
import Styles from "./StudentForm.module.css";

export default function DepartmentForm(props) {
 
  const [error, setError] = useState({});
  const[departmentExisitsError,setDepartmentExisitsError]=useState("");
  const namePattern = /^[a-zA-Z\s]+$/;
 
  const handleSubmitDepartmentFrom = (e) => {
    e.preventDefault();
    setError({});
    let validationError=false;

    if (props.departmentDetails.Name === "") {
      setError((prev) => ({ ...prev, name: "Name is required!" }));
      console.log("Invalid Name:", props.departmentDetails.name);
      validationError=true;
    } 
    else if (!namePattern.test(props.departmentDetails.Name)) {
      setError((prev) => ({ ...prev, name: "Name is not valid!" }));
      console.log("Invalid Name:"+ props.departmentDetails.Name);
      validationError=true;
      
    }
    if(!validationError){
      setError({});
      try {
        axios
          .post("http://localhost:8080/department/addnew", props.departmentDetails)
          .then((response) => {
            console.log(response.data);
            if (response.data === "DepartmentFound") {
              setDepartmentExisitsError("Department already in the list");
            } else {
              console.log(props.departmentDetails);
              props.setShowDepartmentForm(false);
              props.getDepartment();
              props.setDepartmentDetails({
                id: "",
                Name: "",
              });
            }
          });
      } catch (err) {
        console.log("data not stored");
      }
    }
  };
  const handleUpdateDepartmentFrom = (e) => {
    e.preventDefault();
    setError({});
    console.log(props.departmentDetails);
    let validationError=false;
    if (props.departmentDetails.Name === "") {
      setError((prev) => ({ ...prev, name: "Name is required!" }));
      validationError=true;
    } 
    else if (!namePattern.test(props.departmentDetails.Name)) {
      setError((prev) => ({ ...prev, name: "Name is not valid!" }));
      validationError=true;  
    }
    if(!validationError){
      props.setShowDepartmentForm(false);
      props.setUpdate(false);
      try {
        console.log(props.departmentDetails);
        axios
          .post("http://localhost:8080/department/update", props.departmentDetails)
          .then((response) => {
            console.log(response);
            props.getDepartment();
            props.setDepartmentDetails({
              id: "",
              Name: "",
            });
          });
      } catch (err) {
        console.log("data not stored");
      }
    }
  };
  const clearForm = () => {
    props.setShowDepartmentForm(false);
    props.setDepartmentDetails({
      id: "",
      Name: "",
    });
    props.setUpdate(false);
  };
  return (
    <React.Fragment>
      <div className={Styles.container} onClick={clearForm}></div>
      <div className={Styles.body}>
        <h3 className="text-center pt-3">
          {props.update ? "Update the Department" : "Add a Department"}
        </h3>
        <form className="mt-2">
          <InputController
            label="Name of the department"
            error={error.name}
            req={true}
            type="text"
            placeholder="Enter Deparment"
            name="department"
            value={props.departmentDetails.Name}
            onChange={(event) =>
              props.setDepartmentDetails({
                ...props.departmentDetails,
                Name: event.target.value,
              })
            }
          />
        {departmentExisitsError && <p className="fs-5 fw-bold text-center text-danger m-0">{departmentExisitsError}</p>}
          {props.update ? (
            <div className="d-grid">
              {" "}
              <Button
                msg="Submit"
                type="submit"
                onClick={handleUpdateDepartmentFrom}
              />
            </div>
          ) : (
            <div className="d-grid">
              <Button
                msg="Submit"
                type="submit"
                onClick={handleSubmitDepartmentFrom}
              />{" "}
            </div>
          )}
        </form>
      </div>
    </React.Fragment>
  );

}
