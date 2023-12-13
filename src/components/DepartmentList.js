import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/esm/Table'
import Button from "./Button"
import Styles from "./Students.module.css"
import DepartmentForm from './DepartmentForm'
import axios from 'axios'

function DepartmentList() {
    const[departmentList,setDepartmentList]=useState([]);
    const [showDepartmentForm,setShowDepartmentForm]=useState(false);
    const[departmentDetails,setDepartmentDetails]=useState({id:"",Name:""})
    const[update,setUpdate]=useState(false);
    const backendURL="http://localhost:8080"
const handleDeleteDepartment=async(departmentDetails)=>{
  const shouldDelete = window.confirm('Are you sure you want to delete The Department?');
        if(!shouldDelete){
          return
        }
        else{
   await axios.post(backendURL+"/department/delete",departmentDetails)
   .then(response=>{
    console.log(response);
    getDepartment()
   })
  }
}
const handleUpdateDepartment=async(id)=>{
  axios.post(backendURL+"/department/fetchdepartmenttoupdate",{id})
  .then(result=>{
    console.log(result.data);
     setDepartmentDetails({
       id:result.data._id,
       Name:result.data.Name
     });
     setShowDepartmentForm(true);
     setUpdate(true);
  })
 
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
useEffect(()=>{
    getDepartment();
},[])
  return (
    <div>
    <h3 className='text-center'> Department List</h3>
    <p className="mt-2 text-center text-success">To add a new Department  <Button className="btn btn-success" msg="Add" type="submit" onClick={()=>setShowDepartmentForm(true)}  /></p>
    {showDepartmentForm && <DepartmentForm departmentDetails={departmentDetails} setDepartmentDetails={setDepartmentDetails} setShowDepartmentForm={setShowDepartmentForm} getDepartment={getDepartment} update={update} setUpdate={setUpdate} />}
    <div className={Styles.tableContainer}>
     <Table striped bordered size="lg">
  <thead>
     <tr>
       <th>Department name</th>
       <th>Update</th>
       <th>Delete</th>
     </tr>
   </thead>
   <tbody>
     {departmentList.map((department)=>{
         return(
         <tr key={department._id}>
             <td>{department.Name}</td> 
             <td> <Button type="submit" msg="Update" className="btn btn-primary"onClick={()=>handleUpdateDepartment(department._id)}/></td>
             <td><Button type="submit" msg="Delete" className="btn btn-danger" onClick={()=>handleDeleteDepartment(department)}/></td>
         </tr>
         )
     })}
  </tbody>
     </Table>
     </div>

 </div>
)
  
}

export default DepartmentList