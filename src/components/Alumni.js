import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table';
import Button from './Button';
import Styles from "./Students.module.css"


function Alumni(props) {
    const[studentList,setStudentList]=useState([]);
   
    const userState=useSelector((state)=>{
        return state.user
      })
      const typeOfUser=userState.type;
      const loggedIn=userState.loggedIn;
      const year=props.chosenYear
    
      const fetchAlumni=async()=>{
        try{
            console.log(year)
            axios.post("http://localhost:8080/api/fetchAlumni",{year})
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
     
      useEffect(()=>{
        fetchAlumni();
      },[year])
  return (
    <div className={Styles.container}> 
    <h2 className='text-center'>{year} Alumni List</h2>
    {console.log(studentList)}
    {studentList.length==0 ? <div className='text-center text-danger fs-2  '>No Alumni to Show!!!</div>:
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
        </tr>
      </thead>
      <tbody>
        
     {studentList.map((student)=>{
        return (<>
          { student.Alumni && student.PassingYear==props.chosenYear &&  < tr key={student.Email}>
             <td className={student.College?.BlackListed && "text-muted"}><img className={Styles.zoomImage} src={student.Photo}></img></td>
             <td className={student.College?.BlackListed && "text-muted"}>{student.Name} </td>
             <td className={student.College?.BlackListed && "text-muted"}>{student.Email} </td>
             {(typeOfUser.type!=="College"  && !loggedIn.loggedInAsCollege) &&<td className={student.College?.BlackListed && "text-muted"}>{student.College?.Name} </td>}
             <td className={student.College?.BlackListed && "text-muted"}>{student.Department?.Name}</td>
             <td className={student.college?.BlackListed && "text-muted"}>{student.Sem}</td>
             <td className={student.college?.BlackListed && "text-muted"}>{student.Birthday}</td> 
       </tr>
     }</>)
     })}
     </tbody>
     </Table>

  </div>}
    </div>
  )
}

export default Alumni