import React, { useEffect } from 'react';
import Styles from "./Students.module.css"
import Button from "./Button"
import { useState } from 'react';
import StudentForm from './StudentForm';
import { useSelector } from 'react-redux';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import ResultForm from './ResultForm';



function Students(props) {
const[nameOfStudent,setNameOfStudent]=useState("");
const[idToUpdate,setIdToUpdate]=useState("")
const[showStudentFrom,setShowStudentForm]=useState(false);
const[studentList,setStudentList]=useState([]);
const[collegeList,setCollegeList]=useState([])
const[updateStudent,setUpdateStudent]=useState(false);
const[showResultForm,setShowResultForm]=useState(false);
const[resultList,setResultList]=useState([])
const[sem,setSem]=useState(0)

const userState=useSelector((state)=>{
  return state.user
})
const typeOfUser=userState.type;
const loggedIn=userState.loggedIn;



const[studentDetails,setStudentDetails]=useState({
  id:"",
  name:"",
  email:"",
  parent:"",
  college:typeOfUser.type==="College"?typeOfUser.id:"",
  birthDay:"",
  password:"",
  department:null,
  address:"",
  photo:"",
  fatherName:"",
  motherName:"",
  mobile:"",
  selectedColl:{}})
  
 
  console.log(typeOfUser)

const backendURL="http://localhost:8080";

const getStudent=async()=>{
  console.log("hello");
  if(typeOfUser.type==="College"|| loggedIn.loggedInAsCollege){
    console.log("in if")
    let collegeId="";
    if(typeOfUser.type === "College"){
      collegeId = typeOfUser.id
   }
   else{
     collegeId=loggedIn.collegeId
   }
    try{
      axios.post("http://localhost:8080/api/fetchStudents",{collegeId})
      .then(response=>{
          const data=response.data;
        console.log(data)
          setStudentList(data);       
      })
  }
  catch(err){
    console.log(err);
  }
  }
  else{
    console.log("in else")
    try{
      axios.get("http://localhost:8080/api/fetchStudents")
      .then(response=>{
          const data=response.data;
          setStudentList(data);       
      })
  }
  catch(err){
      console.log(err);
  }
  }  
}
const getCollege = () => {
    try {
      axios
        .get("http://localhost:8080/college/fetchcolleges")
        .then((response) => {
          setCollegeList(response.data);
        });
    } catch (err) {
      console.log(err);
    } 
  }
const handleDeleteStudent=async(student)=>{
        const shouldDelete = window.confirm('Are you sure you want to delete this student?');
        if(!shouldDelete){
          return
        }
        else{  
            axios.post(backendURL+"/api/delete",student)
            .then(response=>{
                if(response.status===200){
                    console.log(response);
                    console.log("deleted");
                    getStudent();
                }
           
            })
        }
    }
const handleUpdateStudent=async(id)=>{
        console.log("student to be updated"+id);
        axios.post(backendURL+"/api/fetchOneStudent",{id})
        .then(response=>{
            if(response.status===200){
                const studentInfo=response.data;
                console.log(studentInfo.College._id)
                let selectedCollege=collegeList.find(ob=>ob._id===studentInfo.College._id)  
                setUpdateStudent(true);
                setShowStudentForm(true);
                 setStudentDetails({
                    id:studentInfo._id,
                    name:studentInfo.Name,
                    email:studentInfo.Email,
                    password:studentInfo.Password,
                    prevCollege:studentInfo.College._id,
                    college:studentInfo.College._id,
                    collegeName:studentInfo.College.Name,
                    birthDay:studentInfo.Birthday,
                    department:studentInfo.Department?._id,
                    prevDepartment:studentInfo.Department?._id,
                    departmentName:studentInfo.Department?.Name,
                    photo:studentInfo.Photo,
                    selectedColl:selectedCollege,
                    fatherName:studentInfo.Father,
                    motherName:studentInfo.Mother,
                    mobile:studentInfo.Mobile,
                    sem:studentInfo.Sem

                 })
            }
           
        })
    }
const handleAddResult=async(id)=>{
  
  axios.post(backendURL+"/api/fetchOneStudent",{id})
  .then(response=>{

    setSem(response.data.Sem)
    // console.log(response.data)
    // console.log(response.data.Results)
    setResultList(response.data?.Results);
    setIdToUpdate(id);
    setNameOfStudent(response.data.Name)
    setShowResultForm(true);
  }) 
}

 useEffect(()=>{
        getStudent();
        getCollege();
    },[])
    useEffect(()=>{
      console.log(idToUpdate)
      console.log(resultList)
    },[idToUpdate])

  return (
    <div className={Styles.container}> 
    <h2 className='text-center'> Students List</h2>
   {(typeOfUser.type!=="College"  && !loggedIn.loggedInAsCollege) && <div>
     <p className="mt-2 text-center text-success">To add a new Student  <Button className="btn btn-success" msg="Add" type="submit" onClick={()=>setShowStudentForm(true)}/></p>
     </div>}
     {showStudentFrom && <StudentForm setShowResultForm={setShowResultForm} typeOfUser={typeOfUser} setShowStudentForm={setShowStudentForm} setStudentList={setStudentList} getStudent={getStudent} studentDetails={studentDetails} setStudentDetails={setStudentDetails} updateStudent={updateStudent} setUpdateStudent={setUpdateStudent} />}
     {showResultForm && <ResultForm showResultForm={showResultForm }setShowResultForm={setShowResultForm} sem={sem} nameOfStudent={nameOfStudent} idToUpdate={idToUpdate} resultList={resultList}/>}
     <div className={Styles.tableContainer}>

     <Table striped bordered size="lg">
     <thead>
        <tr>
           <th>Image</th>
          <th>Name</th>
          <th>Email</th>
         {(typeOfUser.type!=="College"  && !loggedIn.loggedInAsCollege) && <th>College</th>}
          <th>Department</th>
          <th>Semester</th>
          <th>Birthday</th>
          {(typeOfUser.type!=="College" && !loggedIn.loggedInAsCollege)&& <th>Update</th>}
          {(typeOfUser.type!=="College" && !loggedIn.loggedInAsCollege)&&<th>Delete</th>}
          {(typeOfUser.type==="College" || loggedIn.loggedInAsCollege) &&<th>Upload Result</th>}
        </tr>
      </thead>
      <tbody>
        
     {studentList.map((student)=>{
        return (<>
          { !student.Alumni &&  < tr key={student.Email}>
             <td className={student.College?.BlackListed && "text-muted"}><img className={Styles.zoomImage} src={student.Photo}></img></td>
             <td className={student.College?.BlackListed && "text-muted"}>{student.Name} </td>
             <td className={student.College?.BlackListed && "text-muted"}>{student.Email} </td>
             {(typeOfUser.type!=="College"  && !loggedIn.loggedInAsCollege) &&<td className={student.College?.BlackListed && "text-muted"}>{student.College?.Name} </td>}
             <td className={student.College?.BlackListed && "text-muted"}>{student.Department?.Name}</td>
             <td className={student.college?.BlackListed && "text-muted"}>{student.Sem}</td>
             <td className={student.college?.BlackListed && "text-muted"}>{student.Birthday}</td>
             {(typeOfUser.type!=="College"  && !loggedIn.loggedInAsCollege) && <td> <Button disabled={student.College?.BlackListed} type="submit" msg="Update" className="btn btn-primary"onClick={()=>handleUpdateStudent(student._id)}/></td>}
            {(typeOfUser.type!=="College"  && !loggedIn.loggedInAsCollege)  && <td ><Button type="submit" disabled={student.College?.BlackListed} msg="Delete" className="btn btn-danger" onClick={()=>handleDeleteStudent(student)}/></td>}
            {(typeOfUser.type==="College"  || loggedIn.loggedInAsCollege) && <td> <Button type="submit" msg="Upload" className= "btn btn-primary"onClick={()=>handleAddResult(student._id)}/></td>}
      
       </tr>
     }</>)
     })}
     </tbody>
     </Table>
     </div>
   
     </div>
  )
}

export default Students