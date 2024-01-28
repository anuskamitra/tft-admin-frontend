import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";


function Summary(props) {
  const userState=useSelector((state)=>{
    return state.user
  })
  
  const typeOfUser=userState.type;
  const loggedIn=userState.loggedIn
  const [studentListLength, setStudentListLength] = useState();
  const [collegeListLength, setCollegeListLength] = useState();
  const [ departmentListLength, setDepartmentListLength]=useState();
  const[professorListLength,setProfessorListLength]=useState();

  const getStudent = async () => {
    console.log("getStudents")
    if(typeOfUser.type==="College"|| loggedIn.loggedInAsCollege){ 
   
      let collegeId="";
      if(typeOfUser.type === "College"){
       

        collegeId = typeOfUser.id
       
     }
     else{
       collegeId=loggedIn.collegeId
     }
      try{
        console.log(collegeId)
        axios.post(process.env.REACT_APP_BACKEND_URL+"/api/countStudents",{collegeId}).then(response=>{
          const data=response.data.length;
          setStudentListLength(data);
        })
      }catch(err){
        console.log(err);
      }
    }
    else{
    try {
      axios.get(process.env.REACT_APP_BACKEND_URL+"/api/fetchStudents").then((response) => {
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
        .get(process.env.REACT_APP_BACKEND_URL+"/college/fetchcolleges")
        .then((response) => {
          setCollegeListLength(response.data.length);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const getDepartment=()=>{
    try{
    if(typeOfUser.type==="College"||loggedIn.loggedInAsCollege){
        let collegeId="";
        if(typeOfUser.type === "College"){
          collegeId = typeOfUser.id
       }
       else{
         collegeId=loggedIn.collegeId
       }
   
        axios.post(process.env.REACT_APP_BACKEND_URL+"/college/fetchdepartments",{collegeId})
        .then(response=>{
          setDepartmentListLength(response.data.length);
        })
    }
    else{
        axios.get(process.env.REACT_APP_BACKEND_URL+"/department/fetchdepartments")
        .then(response=>{
            setDepartmentListLength(response.data.length);
        })
      }
    }catch(err){
      console.log(err)
    }
  }
const getProfessor = () => {
  try {
    if (typeOfUser.type === "College" ||loggedIn.loggedInAsCollege) {
       let collegeId="";
        if(typeOfUser.type === "College"){
          collegeId = typeOfUser.id
       }
       else{
         collegeId=loggedIn.collegeId
       }
      axios
        .post(process.env.REACT_APP_BACKEND_URL+"/professor/fetchprofessors", {
          collegeId,
        })
        .then((response) => {
         setProfessorListLength(response.data.length);
        });
    } else {
      axios
        .get(process.env.REACT_APP_BACKEND_URL+"/professor/fetchprofessors")
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
      <h2 className="mt-3">Welcome to {loggedIn?.loggedInAsCollege?"College":typeOfUser.type} Dashboard</h2>
        <h2>{loggedIn?.loggedInAsCollege?"College":typeOfUser.type} : {loggedIn?.loggedInAsCollege?loggedIn.collegeName:typeOfUser.name}</h2><br/><br/>
        <div>
      <p className="fs-3 "> Number of Students in the Student List : {studentListLength} </p>
        </div>
      {(typeOfUser.type!=="College" && !loggedIn?.loggedInAsCollege)&&  <div>
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
