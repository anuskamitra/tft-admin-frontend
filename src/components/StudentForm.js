import React, { useEffect, useState } from 'react'
import InputController from "./InputController"
import axios from 'axios'
import Button from './Button'
import Styles from "./StudentForm.module.css"

function StudentForm(props) {
   const [error,setError]=useState("");
   const[collegeName,setCollegeName]=useState([]);
   const rgExp=/^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/
   const getCollege=()=>{ 
    console.log("getCOllegese from 12")
    try{
      axios.get("http://localhost:8080/college/fetchcolleges")
      .then(response=>{
        console.log(response);
          setCollegeName(response.data);
      })
    }catch(err){
      console.log(err)
    }
  }
    const handleSubmitStudentFrom=(e)=>{
        e.preventDefault();
       
         if(!props.studentDetails.name||!props.studentDetails.email||!props.studentDetails.college){
            console.log(props.studentDetails)
            setError("Please fillup the required details")
        }
        else  if(!rgExp.test(props.studentDetails.email)) {
            setError("Email is not valid!");
           
          }
        else{
         
        try{  
         axios.post("http://localhost:8080/api/addnew",props.studentDetails)
         .then(response=>{
            console.log(response.data);
            if(response.data==="alreadyexist"){
                setError("Student allready in the list");
            }
            else{
            console.log(props.studentDetails)
            props.setShowStudentForm(false)
            props.getStudent();
            props.setStudentDetails({id:"",name:"",email:"",parent:"",college:"",birthDay:"",department:"",address:""})
            }
         })
        }catch(err){
            console.log("data not stored")
        }
    }
    }
    const handleUpdateStudentFrom=(e)=>{
        e.preventDefault();
        console.log(props.studentDetails)
        if(!props.studentDetails.name||!props.studentDetails.email||!props.studentDetails.college){
            setError("Please fillup the required details")
        }
        else  if(!rgExp.test(props.studentDetails.email)) {
            setError("Email is not valid!");
          }
        else{
        props.setShowStudentForm(false)
       props.setUpdateStudent(false);
        try{
            console.log(props.studentDetails)
         axios.post("http://localhost:8080/api/update",props.studentDetails)
         .then(response=>{
            console.log(response);
            props.getStudent();
            props.setStudentDetails({id:"",name:"",email:"",parent:"",college:"",birthDay:"",department:"",address:""})
         })
        }catch(err){
            console.log("data not stored")
        }
    }

    }
    const clearForm=()=>{
        props.setShowStudentForm(false);
        props.setStudentDetails({id:"",name:"",email:"",parent:"",college:"",birthDay:"",department:"",address:""})
        props.setUpdateStudent(false)
    }
useEffect(()=>{
getCollege();
},[])
  return (
    <React.Fragment>
    <div className={Styles.container}onClick={clearForm} ></div>

    <div className={Styles.body}>
        <h3 className='text-center pt-5'>{props.updateStudent?"Update the Student":"Add a Student"}</h3> 
        <form className='m-3'>
            <InputController label="Name of the Student" req={true} type="text" placeholder="Enter your name"name="name" value={props.studentDetails.name} onChange={(event)=>props.setStudentDetails({...props.studentDetails,name:event.target.value})}/>
            <InputController label="Email" type="email" req={true} name="email" placeholder="example@gmail.com" required value={props.studentDetails.email} onChange={(event)=>props.setStudentDetails({...props.studentDetails,email:event.target.value})}/>
            {/* <InputController label="College/University name" req={true} type="text" placeholder="College name" name="college" value={props.studentDetails.college} onChange={(event)=>props.setStudentDetails({...props.studentDetails,college:event.target.value})} /> */}
            <h6>College/University name</h6>
            <select className="form-select" onChange={(event)=>props.setStudentDetails({...props.studentDetails,college:event.target.value})}>
            <option value={props.studentDetails.college}>{props.studentDetails.collegeName}</option>
             {collegeName.map(college=>{
            return <option value={college._id}>{college.Name}</option>
           })}
            </select>
            <InputController label="Date Of birth" type="date"  name="birthDay" value={props.studentDetails.birthDay} onChange={(event)=>props.setStudentDetails({...props.studentDetails,birthDay:event.target.value})} />
            <InputController label="Department" type="text"  name="department" placeholder="Department" value={props.studentDetails.department} onChange={(event)=>props.setStudentDetails({...props.studentDetails,department:event.target.value})}/>
            {error.length>0 && <p className='text-center fw-bold text-danger'>{error}</p>}
            {props.updateStudent? <div className='d-grid'> <Button msg="Submit" type="submit" onClick={handleUpdateStudentFrom}/></div>: <div className='d-grid'><Button msg="Submit" type="submit" onClick={handleSubmitStudentFrom}/> </div> }
        </form>
      
</div>

    </React.Fragment>
  )
}

export default StudentForm