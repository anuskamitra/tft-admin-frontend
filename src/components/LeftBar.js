import React,{Profiler, useEffect,useState} from 'react'
import Styles from './Leftbar.module.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

function LeftBar(props) {
  const Navigate=useNavigate();
 const[studentDetails,setStudentDetails]=useState({});
 
const typeOfUser=useSelector((state)=>{
  return state.user
})


  const handleStudentShow=()=>{
       props.setShowCollegeList(false);
       props.setShowDepartmentList(false);
       props.setShowSummaryList(false);
       props.setShowProfessorList(false);
      props.setShowStudentList(!props.showStudentList);
  }
  const handleCollegeShow=()=>{
     props.setShowStudentList(false);
     props.setShowDepartmentList(false);
     props.setShowSummaryList(false);
     props.setShowProfessorList(false);
    props.setShowCollegeList(!props.showCollegeList);
  }
  const handleDepartmentShow=()=>{
     props.setShowStudentList(false);
     props.setShowProfessorList(false);
    props.setShowSummaryList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(!props.showDepartmentList);

  }
  const handleSummaryShow=()=>{
    props.setShowStudentList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(false);
    props.setShowProfessorList(false);
    props.setShowSummaryList(!props.showSummaryList)
  }
  const handleTeacherShow=()=>{
    props.setShowStudentList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(false);
    props.setShowSummaryList(false);
    props.setShowProfessorList(!props.showProfessorList);
  }
  const handleProfileShow=()=>{
    props.setShowResult(false);
   
    props.setShowProfile(!props.showProfile);
  }
  const handleResultShow=()=>{
    props.setShowProfile(false);
   
    props.setShowResult(!props.showResult);
  }
 
  const getStudent=()=>{
    const id=typeOfUser.id;
    axios.post("http://localhost:8080/api/fetchOneStudent",{id})
      .then(response=>{
         console.log(response.data)
        setStudentDetails(response.data);
      });
  }
  const handleLogout=()=>{
  const confirm=  window.confirm("Are you sure you want to logout")
  if(!confirm){
    console.log("logout");
    return;
  }
  else{ 
    localStorage.removeItem('userInfo')
    Navigate("/")
  }
  }
  useEffect(()=>{
    // if(typeOfUser.type==="Student"){
    //   // getStudent();
    //   console.log()
    // }
  },[])

  return (
    <React.Fragment> 
      {typeOfUser.type==="College" || typeOfUser.type==="Admin" ?
    <div className={Styles.container}>
    <div className={Styles.heading}><i className="bi bi-speedometer2 ps-3"><span className={Styles.spanItem}>Dashboard</span></i></div>
    <hr/>
    <div  className={Styles.list}>
    <div className={`${Styles.listItem} ${props.showSummaryList && Styles.active}`}onClick={handleSummaryShow}><i className="bi bi-list-check ps-3"><span className={Styles.spanItem}>Summary</span></i></div>
    <div className={`${Styles.listItem} ${props.showStudentList && Styles.active}`} onClick={handleStudentShow}><i className="bi bi-person ps-3"><span className={Styles.spanItem}>Students List</span></i></div>
    {typeOfUser.type!="College" && <div className={`${Styles.listItem} ${props.showCollegeList && Styles.active}`} onClick={handleCollegeShow}><i className="bi bi-building ps-3"><span className={Styles.spanItem}>College List</span></i></div>}
    <div className={`${Styles.listItem} ${props.showDepartmentList && Styles.active}`} onClick={handleDepartmentShow}><i className="bi bi-briefcase ps-3"><span className={Styles.spanItem}>Department List</span></i></div>
    <div className={`${Styles.listItem} ${props.showProfessorList && Styles.active}`} onClick={handleTeacherShow}><i className="bi bi-person-square ps-3"><span className={Styles.spanItem}>Professors List</span></i></div>
   <div className={Styles.navButton} onClick={handleLogout}><i className="bi bi-box-arrow-left ps-3 "><span className={`${Styles.spanItem}`}>Logout</span></i></div>
    </div>
    </div>
    :
    <div className={Styles.container}>
      <div className={Styles.heading}><i className="bi bi-speedometer2 ps-3"><span className={Styles.spanItem}>Dashboard</span></i></div>
        <hr/>
      <br/>
         <div  className={`${Styles.list} `}>
         <div className={`${Styles.listItem} ps-3 ${props.showProfile && Styles.active}`} onClick={handleProfileShow}><i className="bi bi-person-circle ps-3"><span className={Styles.spanItem}>Profile</span></i></div>
         <div className={`${Styles.listItem} ps-3 ${props.showResult && Styles.active}`} onClick={handleResultShow}><i className="bi bi-file-earmark-text ps-3"><span className={Styles.spanItem}>Result</span></i></div>
         <div className={`${Styles.navButton} ps-3`} onClick={handleLogout}><i className="bi bi-box-arrow-left ps-3 "><span className={`${Styles.spanItem}`}>Logout</span></i></div>
        </div>
      </div>
    }
     {/* <div className={`${Styles.navButton} ps-3`} onClick={handleLogout}><i className="bi bi-box-arrow-left ps-3 "><span className={`${Styles.spanItem}`}>Logout</span></i></div> */}

    </React.Fragment>
  )
}

export default LeftBar