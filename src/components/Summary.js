import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card"

function Summary(props) {
  const [studentListLength, setStudentListLength] = useState();
  const [collegeListLength, setCollegeListLength] = useState();
  const [ departmentListLength, setDepartmentListLength]=useState();
  const[professorListLength,setProfessorListLength]=useState();
 const typeOfUser=props.typeOfUser.type
  const getStudent = async () => {
    if(typeOfUser==="College"){
      const collegeId=props.typeOfUser.id;
      try{
        axios.post("http://localhost:8080/api/countStudents",{collegeId}).then(response=>{
          const data=response.data.count;
          setStudentListLength(data);
        })
      }catch(err){
        console.log(err);
      }
    }
    else{
    try {
      axios.get("http://localhost:8080/api/fetchStudents").then((response) => {
        const data = response.data.length;;
         setStudentListLength(data);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
  const getCollege = () => {
    try {
      axios
        .get("http://localhost:8080/college/fetchcolleges")
        .then((response) => {
          setCollegeListLength(response.data.length);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const getDepartment=()=>{
    if(typeOfUser==="College"){
      const collegeId=props.typeOfUser.id;
      try{
        axios.post("http://localhost:8080/college/fetchdepartments",{collegeId})
        .then(response=>{
          setDepartmentListLength(response.data.length);
        })
      }catch(err){
        console.log(err)
      }
    }
    else{

    try{
        axios.get("http://localhost:8080/department/fetchdepartments")
        .then(response=>{
            setDepartmentListLength(response.data.length);
        })
      }catch(err){
        console.log(err)
      }
    }
}
const getProfessor = () => {
  try {
    if (typeOfUser.type === "College") {
      const collegeId = typeOfUser.id;
      axios
        .post("http://localhost:8080/professor/fetchprofessors", {
          collegeId,
        })
        .then((response) => {
         setProfessorListLength(response.data.length);
        });
    } else {
      axios
        .get("http://localhost:8080/professor/fetchprofessors")
        .then((response) => {
          setProfessorListLength(response.data.length);
        });
    }
  } catch (err) {
    console.log(err);
  }
};
  useEffect(() => {
    getStudent();
    getCollege();
    getDepartment();
    getProfessor();
  }, []);
  return (
    <React.Fragment>
      <div className="d-flex flex-column justify-content-around align-items-center">
      <h2 className="mt-3">Welcome to {props.typeOfUser.type} Dashboard</h2>
        <h2>{props.typeOfUser.type} : {props.typeOfUser.name}</h2><br/><br/>
        <div>
      <p className="fs-3 "> Number of Students in the Student List : {studentListLength} </p>
        </div>
      {props.typeOfUser.type!=="College" &&  <div>
       <p className="fs-3 ">Number of Colleges in the Colleg List : {collegeListLength}</p> 
        </div>}
        <div>
        <p className="fs-3 ">   Number of Departments in the Department List : {departmentListLength}</p> 
        </div>
        <div>
        <p className="fs-3 ">   Number of Professors in the Professor List : {professorListLength}</p> 
        </div>
      </div>
      {/* <div className="h-25" style={{background:"blue"}}><Card/></div> */}
    </React.Fragment>
  );
}

export default Summary;
