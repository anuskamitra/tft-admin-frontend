import React, { useState ,useEffect} from 'react'
import Table from 'react-bootstrap/esm/Table'
import Button from "./Button.js"
import axios from "axios"
import Styles from "./Students.module.css"
import CollegeForm from './CollegeForm.js';


export default function CollegeList() {
    const [collegeList,setCollegeList]=useState([]);
    const [update,setUpdate]=useState(false);
    const [showCollegeForm,setShowCollegeForm]=useState(false);
    const [collegeDetails,setCollegeDetails]=useState({id:"",Name:"", Email:"",Password:"",State:"",City:"", Rating:"",Departments:[]})
    const getCollege=()=>{ 
  try{
    axios.get("http://localhost:8080/college/fetchcolleges")
    .then(response=>{
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
const handleDetails=()=>{
  console.log("Details")
}
useEffect(()=>{
 getCollege();
},[])
  return (
    <div>
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
          <th>Ratings</th>
          <th>Update</th>
          <th>Details</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {collegeList.map((college)=>{
            return(
            <tr key={college.Email}>
                <td>{college.Name}</td>
                <td>{college.Email}</td>
                <td>{college.State}</td>
                <td>{college.City}</td>
                <td>{college.Departments.map((dep=>{
                 return <ul className="list-unstyled">
                  <li className='decoration-none'>{dep.Name}</li></ul>
                }))}</td>
                <td>{college.Rating}</td>
                <td> <Button type="submit" msg="Update" className="btn btn-primary"onClick={()=>handleUpdateCollege(college._id)}/></td>
                <td><Button type="submit" msg="View" className="btn btn-info" onClick={()=>handleDetails(college)}/></td>
            <td><Button type="submit" msg="Delete" className="btn btn-danger" onClick={()=>handleDeleteCollege(college)}/></td>

            </tr>
            )
        })}
     </tbody>
    
        </Table>
        </div>

    </div>
  )
}

