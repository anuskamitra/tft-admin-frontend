import React, { useEffect, useState } from "react";
import Styles from "./StudentForm.module.css";
import axios from "axios";
import Button from "./Button";
import InputController from "./InputController";
import { useSelector } from "react-redux";


function ProfessorForm(props) {
  const userState=useSelector((state)=>{
    return state.user
  })
  
  const typeOfUser=userState.type;
  const loggedIn=userState.loggedIn

  const [pic, setPic] = useState("");
  const [error, setError] = useState({});

  const [collegeList, setCollegeList] = useState([]);
  const [professorExistsError, setProfessorExistsError] = useState("");
  let selectedCollegeId = "";
  let selectedCollege = {};
  let details={}
  const rgExp=/^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/;
  var namePattern = /^[a-zA-Z.\s]+$/;
  const getCollege = () => {
    try {
      if (typeOfUser.type === "College") {
        const collegeId = typeOfUser.id;
        axios
          .post(process.env.REACT_APP_BACKEND_URL+"/college/fetchonecollege", { collegeId })
          .then((response) => {
            let data = response.data;
            props.setProfessorDetails({
              ...props.professorDetails,
              College:collegeId,
              SelectedCollege: data,
            });
          });
      } else {
        axios
          .get(process.env.REACT_APP_BACKEND_URL+"/college/fetchcolleges")
          .then((response) => {
            console.log(response);
            setCollegeList(response.data);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdateProfessorFrom = async(e) => {
    e.preventDefault();
    let validationError=false
    setError({});
    if(!props.professorDetails.Name){
      setError((prev) => ({ ...prev, name: "Name is required!" }));
      validationError=true; 
    }
    else if (!namePattern.test(props.professorDetails.Name)) {
      setError((prev) => ({ ...prev, name: "Name is not valid!" }));
      validationError=true;  
    }
    if(!props.professorDetails.Email){
      setError((prev) => ({ ...prev, email: "Email is required!" }));
      validationError=true; 
    }
    if(!props.professorDetails.College){
      setError((prev) => ({ ...prev, college: "College is required!" }));
      validationError=true; 
    }
    else if (!rgExp.test(props.professorDetails.Email)) {
      setError((prev) => ({ ...prev, email: "Email is not valid!" }));
      validationError=true
    }
    if(!props.professorDetails.Department){
      setError((prev) => ({ ...prev, department: "department is required!" }));
      validationError=true; 
    }
    if(!validationError){
    try{
      await uploadPic()
      axios
      .post(process.env.REACT_APP_BACKEND_URL+"/professor/update", details)
      .then((response) => {
        console.log(response.data);
        props.getProfessor();
        clearForm()
      });
    }
    catch(err){
      console.log(err);
    }

  }
  };
  const uploadPic=async()=>{
    details={...props.professorDetails}
    if(pic.type=="image/jpeg" || pic.type=="image/png"||pic.type=="image/jpg"){
      const data=new FormData();
      data.append("file",pic);
      data.append("upload_preset","admin_panel");
      data.append("cloud_name","dys9lcsqr");
     await fetch("https://api.cloudinary.com/v1_1/dys9lcsqr/image/upload",{
        method:'post',
        body:data,
      })
      .then(res=>res.json())
      .then(data=>{
        let URL=data.url.toString();
        props.setProfessorDetails({
          ...props.professorDetails,
          Photo:URL
        })
        details={...props.professorDetails,Photo:URL};
        })
      .catch(err=>{
        console.log(err);
      })  
    }
  }
  const handleSubmitProfessorFrom = async(e) => {
    e.preventDefault();
  
    let validationError=false
    setError({})
    if(!props.professorDetails.Name){
      setError((prev) => ({ ...prev, name: "Name is required!" }));
      validationError=true; 
    }
    else if (!namePattern.test(props.professorDetails.Name)) {
      setError((prev) => ({ ...prev, name: "Name is not valid!" }));
      validationError=true;  
    }
    if(!props.professorDetails.Email){
      setError((prev) => ({ ...prev, email: "Email is required!" }));
      validationError=true; 
    }
    if(!props.professorDetails.College){
      setError((prev) => ({ ...prev, college: "College is required!" }));
      validationError=true; 
    }
    else if (!rgExp.test(props.professorDetails.Email)) {
      setError((prev) => ({ ...prev, email: "Email is not valid!" }));
      validationError=true
    }
    if(!props.professorDetails.Department){
      setError((prev) => ({ ...prev, department: "department is required!" }));
      validationError=true; 
    }

    console.log(props.professorDetails);
    if(!validationError){
    try {
      await uploadPic();
      console.log(details)
      axios
        .post(process.env.REACT_APP_BACKEND_URL+"/professor/addnew", details)
        .then((response) => {
          console.log(response.data);
          props.getProfessor();
          clearForm()
        });
    } catch (err) {
      console.log(err);
    }
  }
};
  const clearForm = () => {
    props.setShowProfessorForm(false);
    props.setProfessorDetails({
      id: "",
      Name: "",
      Email: "",
      College: "",
      Department: "",
      photo: "",
    });
    props.setUpdateProfessor(false);
  };
  useEffect(() => {
    getCollege();
    console.log(props.professorDetails)
  }, []);
  return (
    <React.Fragment>
      <div className={Styles.container} onClick={clearForm}></div>
      <div className={`${Styles.body} your-div`}>
        <h3 className="text-center pt-3">
          {props.updateProfessor
            ? "Update the Professor details "
            : "Add a Professor"}
        </h3>
        <form className="mt-2">
          <InputController
            type="file"
            name="photo"
            accept=".jpeg, .png, .jpg"
            error={error.photo}
            onChange={(event) => setPic(event.target.files[0])}
          />
          {/* <div>
          <label>Previous Photo:</label>
          <input type="text" readOnly value={props.ProfessorDetails.photo} /> */}
          {/* </div> */}

          <InputController
            label="Name of the Professor"
            error={error.name}
            req={true}
            type="text"
            placeholder="Enter your name"
            name="name"
            value={props.professorDetails.Name}
            onChange={(event) =>
              props.setProfessorDetails({
                ...props.professorDetails,
                Name: event.target.value,
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
            value={props.professorDetails.Email}
            onChange={(event) =>
              props.setProfessorDetails({
                ...props.professorDetails,
                Email: event.target.value,
              })
            }
          />

          {(typeOfUser.type === "College"||loggedIn.loggedInAsCollege) ? (
            ""
          ) : (
            <div>
              <label className="fw-2">
                College/University name<span style={{ color: "red" }}>*</span>
              </label>
              <select
                className={`form-select ${
                  error.college && "border border-danger"
                }`}
                onChange={(event) => {
                  selectedCollegeId = event.target.value;
                  selectedCollege = collegeList.find(
                    (ob) => ob._id === selectedCollegeId
                  );
                  props.setProfessorDetails({
                    ...props.professorDetails,
                    College: event.target.value,
                    SelectedCollege:selectedCollege
                  });
                }}
              >
                <option value={props.professorDetails?.SelectedCollege?._id || ""}>{props.professorDetails?.SelectedCollege?.Name||"Select a College"}</option>
                {collegeList
                .filter((college) => college._id !== props.professorDetails?.SelectedCollege?._id)
                .map((college) => {
                  return <option key={college._id} value={college._id}>{college.Name}</option>;
                })}
              </select>
              <p className="text-danger">{error.college}</p>{" "}
            </div>
          )}

          <label className="fw-2">
            Department name<span style={{ color: "red" }}>*</span>
            {(typeOfUser.type !== "College" && loggedIn.loggedInAsCollege) && (
              <span style={{ fontSize: "12px", color: "red" }}>
                {" "}
                (Please first select college to see the available departments)
              </span>
            )}
          </label>
          <select
            className={`form-select ${
              error.department && "border border-danger"
            }`}
            onChange={(event) =>
              props.setProfessorDetails({
                ...props.professorDetails,
                Department: event.target.value,
              })
            }
          >
            <option value={props.professorDetails?.Department||""}>{props.professorDetails?.SelectedDepartment?.Name||"Select one Department"}</option>
           { props.professorDetails.SelectedCollege?.Departments?.map(
              (department) => {
                if(department.Name!=props.professorDetails?.SelectedDepartment?.Name)
                return (  
                  <option key={department._id} value={department._id}>{department.Name}</option>
                );
              }
            )}
          </select>
          <p className="text-danger">{error.department}</p>

          {professorExistsError && (
            <p className="fs-5 fw-bold text-center text-danger m-0">
              {professorExistsError}
            </p>
          )}
          {props.updateProfessor ? (
            <div className="d-grid mt-2">
              {" "}
              <Button
                msg="Submit"
                type="submit"
                onClick={handleUpdateProfessorFrom}
              />
            </div>
          ) : (
            <div className="d-grid mt-2">
              <Button
                msg="Submit"
                type="submit"
                onClick={handleSubmitProfessorFrom}
              />{" "}
            </div>
          )}
        </form>
      </div>
    </React.Fragment>
  );
}

export default ProfessorForm;
