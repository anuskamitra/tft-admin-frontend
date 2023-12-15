import React, { useEffect } from 'react';
import Styles from "./Students.module.css"
import Button from "./Button"
import { useState } from 'react';
import StudentForm from './StudentForm';
import axios from "axios";
import Table from 'react-bootstrap/Table';


function Students() {
const[showStudentFrom,setShowStudentForm]=useState(false);
const[studentList,setStudentList]=useState([]);
const[collegeList,setCollegeList]=useState([])
const[updateStudent,setUpdateStudent]=useState(false);
const[studentDetails,setStudentDetails]=useState({id:"",name:"",email:"",parent:"",college:"",birthDay:"",department:null,address:"",photo:"",selectedColl:{}})
const backendURL="http://localhost:8080";
const getStudent=async()=>{
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
const getCollege = () => {
    try {
      axios
        .get("http://localhost:8080/college/fetchcolleges")
        .then((response) => {
          console.log(response);
          setCollegeList(response.data);
        });
    } catch (err) {
      console.log(err);
    }
  };
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
        axios.post(backendURL+"/api/fetchStudentToUpdate",{id})
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
                    prevCollege:studentInfo.College._id,
                    college:studentInfo.College._id,
                    collegeName:studentInfo.College.Name,
                    birthDay:studentInfo.Birthday,
                    department:studentInfo.Department?._id,
                    prevDepartment:studentInfo.Department?._id,
                    departmentName:studentInfo.Department?.Name,
                    photo:studentInfo.Photo,
                    selectedColl:selectedCollege
                 })
            }
           
        })
    }
    useEffect(()=>{
        getStudent();
        getCollege()
        },[])
  return (
    <div className={Styles.container}> 
    <h2 className='text-center'> Students List</h2>
     <div>
     <p className="mt-2 text-center text-success">To add a new Student  <Button className="btn btn-success" msg="Add" type="submit" onClick={()=>setShowStudentForm(true)}/></p>
     </div>
     {showStudentFrom && <StudentForm setShowStudentForm={setShowStudentForm} setStudentList={setStudentList} getStudent={getStudent} studentDetails={studentDetails} setStudentDetails={setStudentDetails} updateStudent={updateStudent} setUpdateStudent={setUpdateStudent}/>}
     <div className={Styles.tableContainer}>

     <Table striped bordered size="lg">
     <thead>
        <tr>
           <th>Image</th>
          <th>Name</th>
          <th>Email</th>
          <th>College</th>
          <th>Department</th>
          <th>Birthday</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        
     {studentList.map((student)=>{
        return (
            <tr key={student.Email}>
             <td><img className={Styles.zoomImage} src={student.Photo}></img></td>
             <td>{student.Name} </td>
             <td>{student.Email} </td>
             <td>{student.College?.Name} </td>
             <td>{student.Department?.Name}</td>
             <td>{student.Birthday}</td>
            <td> <Button type="submit" msg="Update" className="btn btn-primary"onClick={()=>handleUpdateStudent(student._id)}/></td>
            <td><Button type="submit" msg="Delete" className="btn btn-danger" onClick={()=>handleDeleteStudent(student)}/></td>
      
       </tr>
        )
     })}
     </tbody>
     </Table>
     </div>
   
     </div>
  )
}

export default Students