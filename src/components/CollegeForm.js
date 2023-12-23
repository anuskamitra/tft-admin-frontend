import React, { useEffect, useState } from 'react'
import InputController from './InputController'
import Styles from "./StudentForm.module.css"
import Button from './Button.js'
import axios from "axios"


function CollegeForm(props) {
   
    const rgExp=/^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/;
    var namePattern = /^[a-zA-Z\s]+$/;
    const [collegeExsistError,setCollegeExistError]=useState("")
    const [departmentList,setDepartmentList]=useState([])
    const [selectedDepartments,setSelectedDepartments]=useState([])
    const [removedDepartments,setremovedDepartments]=useState([])
    const [error,setError]=useState({});
    const clearForm=()=>{
        props.setShowCollegeForm(false);
        props.setCollegeDetails({Name:"", Email:"",State:"",City:"", Rating:""})    
        props.setUpdate(false) 
    }
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
  const handleCheckboxChange=(event)=>{
    console.log(event.target.value)
    const departmentId=event.target.value;
    setSelectedDepartments((prevDepartments)=>{
      if(prevDepartments?.includes(departmentId)){
       setremovedDepartments( [...removedDepartments, departmentId])
        return prevDepartments.filter((id)=>id!==departmentId)
      }
      else{
        setremovedDepartments(prevRemovedDep=>
          prevRemovedDep? prevRemovedDep.filter((id)=>id!==departmentId):[]
        )
        return[...prevDepartments,departmentId]
      }
    })
  }
  
    const handleSubmitCollegeForm=async(e)=>{
      e.preventDefault();
      setError({})
      let validationError=false;

      console.log(selectedDepartments)
      if(selectedDepartments?.length===0){
        setError((prev) => ({ ...prev, department: "Atleast one department is required!" }));
          validationError=true;
      }
      let details={...props.collegeDetails,departments:selectedDepartments}
      console.log(details);
  
        if (props.collegeDetails.Name === "") {
          setError((prev) => ({ ...prev, name: "Name is required!" }));
          validationError=true;
        } 
        if (props.collegeDetails.Password === "") {
          setError((prev) => ({ ...prev, password: "Password is required!" }));
          validationError=true;
        } 
        else if (!namePattern.test(props.collegeDetails.Name)) {
          setError((prev) => ({ ...prev, name: "Name is not valid!" }));
          validationError=true;  
        }
        if (props.collegeDetails.State === "") {
          setError((prev) => ({ ...prev, state: "State is required!" }));
          validationError=true
        }
        if (props.collegeDetails.Email === "") {
          setError((prev) => ({ ...prev, email: "Email is required!" }));
          validationError=true
        } else if (!rgExp.test(props.collegeDetails.Email)) {
          setError((prev) => ({ ...prev, email: "Email is not valid!" }));
          validationError=true
        } 
      if(!validationError){
        setError({})
      try{
        axios.post("http://localhost:8080/college/addnew",details)
        .then(response=>{
              console.log(response.data);
            if(response.data==="alreadyexist"){
                setCollegeExistError("College already in the list");
            }
            else{
                props.setShowCollegeForm(false)
                props.getCollege();
                props.setCollegeDetails({Name:"",Password:"",Email:"",State:"",City:"", Rating:"",departments:[]})
            }
        })
      }catch(err){
        console.log("failed to add");
      }
    }
  }
    const handleupdateCollegeForm=async(e)=>{
      e.preventDefault();
      let validationError=false;
      setError({})
      console.log(selectedDepartments)
      if(selectedDepartments.length===0){
        validationError=true;
        setError((prev) => ({ ...prev, department: "Atleast one department is required!" }));
         
      }
      let details={...props.collegeDetails,Departments:selectedDepartments,RemovedDepartments:removedDepartments}
      console.log(details);
      if (props.collegeDetails.Name === "") {
        setError((prev) => ({ ...prev, name: "Name is required!" }));
        validationError=true;
      } 
      else if (!namePattern.test(props.collegeDetails.Name)) {
        setError((prev) => ({ ...prev, name: "Name is not valid!" }));
        validationError=true;  
      }
      if (props.collegeDetails.Password === "") {
        setError((prev) => ({ ...prev, password: "Password is required!" }));
        validationError=true;
      } 
      if (props.collegeDetails.State === "") {
        setError((prev) => ({ ...prev, state: "State is required!" }));
        validationError=true
      }
      if (props.collegeDetails.Email === "") {
        setError((prev) => ({ ...prev, email: "Email is required!" }));
        validationError=true
      } else if (!rgExp.test(props.collegeDetails.Email)) {
        setError((prev) => ({ ...prev, email: "Email is not valid!" }));
        validationError=true
      } 
     
      if(!validationError){
        setError({})
      try{
        props.setShowCollegeForm(false) 
        props.setUpdate(false);
        console.log(details)
       axios.post("http://localhost:8080/college/update",details)
       .then(response=>{
          console.log(response);
          props.getCollege();
          props.setCollegeDetails({id:"",Name:"", State:"",City:"", Rating:"",Departments:"",Password:""})
          props.setUpdate(false);
       })
      }catch(err){
          console.log("data not stored")
      }
    }
  
}

useEffect(()=>{
  getDepartment()
  console.log(props.collegeDetails)
  setSelectedDepartments(props.collegeDetails.Departments)
},[])
  return (
    <React.Fragment>
    <div className={Styles.container}onClick={clearForm} ></div>

    <div className={`${Styles.body} your-div`}>
        <h3 className='text-center pt-3'>{props.update?"Update the college":"Add a college"}</h3> 
        <form className='mt-2'>
            <InputController label="Name of the College" error={error.name} req={true} type="text" placeholder="Enter the college name" name="name" value={props.collegeDetails.Name} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,Name:event.target.value})}/>
            <InputController label="Email" type="email" error={error.email} req={true} name="email" placeholder="example@gmail.com" value={props.collegeDetails.Email} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,Email:event.target.value})}/>
            <InputController label="Password" type="password" req={true} error={error.password} name="password" placeholder="Password" value={props.collegeDetails.Password} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,Password:event.target.value})}/>
            <InputController label="State" req={true} error={error.state} placeholder="State" name="state" value={props.collegeDetails.State} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,State:event.target.value})} />
            <InputController label="City" type="text" placeholder="City" name="city" value={props.collegeDetails.City} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,City:event.target.value})} />
            <label className="fw-2">
            Department name
          </label>
          <div>
            {departmentList.map((department) => (
              <div key={department.Name}>
             <input type="checkbox" id={department._id} value={department._id}  onChange={handleCheckboxChange}  checked={selectedDepartments?.includes(department._id)}/>
            <label htmlFor={department.Name}>{department.Name}</label> 
            </div>       
            ))}
             <p className="text-danger">{error.department}</p>
           </div>
            <InputController label="Rating" type="number"  name="rating" placeholder="Department" value={props.collegeDetails.Rating} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,Rating:event.target.value})}/>

            {collegeExsistError && <p className="fs-5 fw-bold text-center text-danger mb-2">{collegeExsistError}</p>}
             <div className='d-grid'>{props.update?<Button msg="Update" type="submit" onClick={handleupdateCollegeForm}/>:<Button msg="Submit" type="submit" onClick={handleSubmitCollegeForm}/>} </div> 
        </form>
      
</div>

    </React.Fragment>
  )
}


export default CollegeForm