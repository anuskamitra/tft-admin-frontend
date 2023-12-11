import React, { useState } from 'react'
import InputController from './InputController'
import Styles from "./StudentForm.module.css"
import Button from './Button.js'
import axios from "axios"


function CollegeForm(props) {
    const [error,setError]=useState("");
    const rgExp=/^[a-z0-9._]+@[a-z]+\.[a-z]{2,6}$/
    const clearForm=()=>{
        props.setShowCollegeForm(false);
        props.setCollegeDetails({Name:"", Email:"",State:"",City:"", Rating:""})
    }
    const handleSubmitCollegeForm=async(e)=>{
      e.preventDefault();
      console.log(props.collegeDetails);
      if(!props.collegeDetails.Name||!props.collegeDetails.Email){
        setError("Please fillup the required details")
    }
    else  if(!rgExp.test(props.collegeDetails.Email)) {
        setError("Email is not valid!");
       
      }
      else{
      try{
        axios.post("http://localhost:8080/college/addnew",props.collegeDetails)
        .then(response=>{
              console.log(response.data);
            if(response.data==="alreadyexist"){
                setError("college allready in the list");
            }
            else{
                props.setShowCollegeForm(false)
                props.getCollege();
                props.setCollegeDetails({Name:"", Email:"",State:"",City:"", Rating:""})
            }
        })
      }catch(err){
        console.log("failed to add");
      }
    }
    }
    const handleupdateCollegeForm=async(e)=>{
      e.preventDefault();
      if(!props.collegeDetails.Name||!props.collegeDetails.Email){
          setError("Please fillup the required details")
      }
      else  if(!rgExp.test(props.collegeDetails.Email)) {
          setError("Email is not valid!");
        }
      else{
      try{
        props.setShowCollegeForm(false) 
       axios.post("http://localhost:8080/college/update",props.collegeDetails)
       .then(response=>{
          console.log(response);
          props.getCollege();
          props.setCollegeDetails({id:"",Name:"", State:"",City:"", Rating:""})
          props.setUpdate(false);
       })
      }catch(err){
          console.log("data not stored")
      }
    }
  }
  return (
    <React.Fragment>
    <div className={Styles.container}onClick={clearForm} ></div>

    <div className={Styles.body}>
        <h3 className='text-center pt-5'>{props.update?"Update the college":"Add a college"}</h3> 
        <form className='m-3'>
            <InputController label="Name of the College" req={true} type="text" placeholder="Enter the college name" name="name" value={props.collegeDetails.Name} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,Name:event.target.value})}/>
            <InputController label="Email" type="email" req={true} name="email" placeholder="example@gmail.com" value={props.collegeDetails.Email} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,Email:event.target.value})}/>
            <InputController label="State" req={true}  placeholder="State" name="state" value={props.collegeDetails.State} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,State:event.target.value})} />
            <InputController label="City" type="text" placeholder="City" name="city" value={props.collegeDetails.City} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,City:event.target.value})} />
            <InputController label="Rating" type="number"  name="rating" placeholder="Department" value={props.collegeDetails.Rating} onChange={(event)=>props.setCollegeDetails({...props.collegeDetails,Rating:event.target.value})}/>
            {error.length>0 && <p className='text-center fw-bold text-danger'>{error}</p>}
             <div className='d-grid'>{props.update?<Button msg="Update" type="submit" onClick={handleupdateCollegeForm}/>:<Button msg="Submit" type="submit" onClick={handleSubmitCollegeForm}/>} </div> 
        </form>
      
</div>

    </React.Fragment>
  )
}


export default CollegeForm