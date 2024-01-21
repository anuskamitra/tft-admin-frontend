import React, { useState ,useEffect} from 'react'
import Table from 'react-bootstrap/esm/Table'
import Button from "./Button.js"
import axios from "axios"
import Styles from "./Students.module.css"
import CollegeForm from './CollegeForm.js';
import { useDispatch } from 'react-redux'
import {loggedInAsCollege} from '../store/slices/UserSlice.js'
import { useNavigate } from 'react-router-dom'
import Summary from './Summary.js'



export default function CollegeList() {
  const Navigate=useNavigate();
    const [collegeList,setCollegeList]=useState([]);
    const [update,setUpdate]=useState(false);
    const [showCollegeForm,setShowCollegeForm]=useState(false);
    const[showSummary,setShowSummary]=useState(false);
    const [collegeDetails,setCollegeDetails]=useState({id:"",Name:"", Email:"",Password:"",State:"",City:"", Rating:"",Departments:[]})
    const dispatch=useDispatch();
    const getCollege=()=>{ 
  try{
    axios.get("http://localhost:8080/college/fetchcolleges")
    .then(response=>{
      console.log("called")
        setCollegeList(response.data);
    })
  }catch(err){
    console.log(err)
  }
}

const handleDeleteCollege=(college)=>{
  const shouldDelete = window.confirm('Are you sure you want to delete this college and all associated students?');
  if(!shouldDelete){
    return
  }
    axios.post("http://localhost:8080/college/delete",college)
    .then(response=>{
        console.log(response.data);
        getCollege();
    })
  
    

}
const handleUpdateCollege=(id)=>{
    axios.post("http://localhost:8080/college/fetchcollegetoupdate",{id})
    .then(response=>{
       let college={
        id:response.data._id,
        Name:response.data.Name,
        Email:response.data.Email,
        State:response.data.State,
        City:response.data.City, 
        Departments:response.data.Departments,
        Rating:response.data.Rating,
        Password:response.data.Password
        }
        setCollegeDetails(college);
        setShowCollegeForm(true);
        setUpdate(true);
    })
}
const handleDetails=(college)=>{
  console.log(college);
  const loggedInAs={
    loggedInAsCollege:true,
    collegeId:college._id,
    collegeName:college.Name
  }
  console.log(loggedInAs);
  dispatch(loggedInAsCollege(loggedInAs))
 setShowSummary(true);

}
const handleBlockCollege=async(college)=>{
      const sureBlock=window.confirm(`Are you sure want to Black list ${college.Name}?`);
  if(sureBlock){
    let id=college._id
    const details={
      id:id,
      blackListed:true
    }
   const result= await axios.post("http://localhost:8080/college/block",details)
   if(result){
    console.log(result)
    getCollege()
   }
  }
  else{
    return
  }
}
const handleUnBlockCollege=async(college)=>{
  const sureUnBlock=window.confirm(`Are you sure want to Unblock ${college.Name}?`);
  if(sureUnBlock){
    let id=college._id
    const details={
      id:id,
      blackListed:false
    }
   const result= await axios.post("http://localhost:8080/college/block",details)
   if(result){
    console.log(result)
    getCollege();
   }
  }
  else{
    return
  }
}
useEffect(()=>{
 getCollege();
},[])
  return (
    <div>
      {showSummary ?<Summary/>:
      <>
       <h3 className='text-center'> College List</h3>
       <p className="mt-2 text-center text-success">To add a new College  <Button className="btn btn-success" msg="Add" type="submit" onClick={()=>setShowCollegeForm(true)}  /></p>
       {showCollegeForm && <CollegeForm collegeDetails={collegeDetails} setCollegeDetails={setCollegeDetails} setShowCollegeForm={setShowCollegeForm} getCollege={getCollege} update={update} setUpdate={setUpdate} />}
       <div className={Styles.tableContainer}>
        <Table striped bordered size="lg">
     <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>State</th>
          <th>City</th> 
          <th>Departments</th>
          <th>BlackList</th>
          <th>Update</th>
          <th>Details</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {collegeList.map((college,index)=>{
            return(
           
            <tr key={index} >
              {console.log(college.BlackListed)}
                <td className={college?.BlackListed && "text-muted font-italic"}>{college.Name}</td>
                <td className={college?.BlackListed && "text-muted"}>{college.Email}</td>
                <td className={college?.BlackListed && "text-muted"}>{college.State}</td>
                <td className={college?.BlackListed && "text-muted"}>{college.City}</td>
                <td className={college?.BlackListed && "text-muted"}>{college.Departments.map(((dep,index)=>{
                 return <ul key={index} className="list-unstyled">
                  <li className='decoration-none'>{dep.Name}</li></ul>
                }))}</td>
                <td className={college?.BlackListed && "text-muted"}> {!college.BlackListed?<Button type="submit" msg="Block" className="btn btn-dark"onClick={()=>handleBlockCollege(college)}/>:<Button type="submit" msg="Unblock" className="btn btn-light"onClick={()=>handleUnBlockCollege(college)}/>}</td>
                <td className={college?.BlackListed && "text-muted"}> <Button type="submit" msg="Update"disabled={college.BlackListed} className="btn btn-primary"onClick={()=>handleUpdateCollege(college._id)}/></td>
                <td className={college?.BlackListed && "text-muted"}><Button type="submit" msg="View" disabled={college.BlackListed} className="btn btn-info" onClick={()=>handleDetails(college)}/></td>
            <td className={college?.BlackListed && "text-muted"}><Button type="submit" msg="Delete" disabled={college.BlackListed} className="btn btn-danger" onClick={()=>handleDeleteCollege(college)}/></td>
            </tr>
            )
        })}
     </tbody>
    
        </Table>
        </div></>}

    </div>
  )
}

