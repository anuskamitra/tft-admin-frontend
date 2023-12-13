import React, { useCallback, useEffect, useState } from "react";
import InputController from "./InputController";
import axios from "axios";
import Button from "./Button";
import Styles from "./StudentForm.module.css";

function StudentForm(props) {
 
  const [error, setError] = useState({});
  const[studentExistsError,setStudentExistsError]=useState("");
  const [pic,setPic]=useState("");
  const [collegeName, setCollegeName] = useState([]);
  const[departmentList,setDepartmentList]=useState([])
  const rgExp = /^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/;
  const namePattern = /^[a-zA-Z\s]+$/;
 let details={};
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
  const getDepartment=()=>{
    try{
        axios.get("http://localhost:8080/department/fetchdepartments")
        .then(response=>{
            setDepartmentList(response.data);
        })
      }catch(err){
        console.log(err)
      }
}

const uploadPic=async()=>{
  details={...props.studentDetails}
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
      props.setStudentDetails({
        ...props.studentDetails,
        photo:URL
      })
      console.log(pic)   
      console.log(props.studentDetails)
     details={...props.studentDetails,photo:URL};
      })
    .catch(err=>{
      console.log(err);
    })  
  }
}
  const handleSubmitStudentFrom = async(e) => {
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

        await uploadPic();
        console.log(details);
        axios
          .post("http://localhost:8080/api/addnew", details)
          .then((response) => {
            console.log(response.data);
            if (response.data === "alreadyexist") {
              setStudentExistsError("Student already in the list");
            } else {
              clearForm()
              props.getStudent();

             
            }
          });
      } catch (err) {
        console.log("data not stored");
      }
    }
  };
  const handleUpdateStudentFrom = async(e) => {
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
      console.log(pic);
      props.setShowStudentForm(false);
      props.setUpdateStudent(false);
      try {
       await uploadPic().then(res=>{
        axios
        .post("http://localhost:8080/api/update", details)
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
            photo:""
          });
        });
       })
       
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
      photo:"",
    });
    props.setUpdateStudent(false);
  };
  useEffect(() => {
    getCollege();
    getDepartment();
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
           type="file"
           name="photo"
           accept=".jpeg, .png, .jpg"
           error={error.photo}
           onChange={(event) =>
            setPic(event.target.files[0])
          }
          />

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
            <label className="fw-2">
            Department name<span style={{ color: "red" }}>*</span>
          </label>
          <select
            className={`form-select ${error.department && "border border-danger"}`}
            onChange={(event) =>
              props.setStudentDetails({
                ...props.studentDetails,
                department: event.target.value,
              })
            }
          >
            <option value={props.studentDetails.department}>
              {props.studentDetails.departmentName}
            </option>
            {departmentList.map((department) => {
              return <option value={department._id}>{department.Name}</option>;
            })}
          </select>
          <p className="text-danger">{error.department}</p>

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
