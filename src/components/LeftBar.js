import React from 'react'
import Styles from './Leftbar.module.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useNavigate } from 'react-router-dom'
import Button from "./Button"
function LeftBar(props) {
  const Navigate=useNavigate();
  const handleStudentShow=()=>{
       props.setShowCollegeList(false);
       props.setShowDepartmentList(false);
       props.setShowSummaryList(false);
      props.setShowStudentList(!props.showStudentList);
  }
  const handleCollegeShow=()=>{
     props.setShowStudentList(false);
     props.setShowDepartmentList(false);
     props.setShowSummaryList(false);
    props.setShowCollegeList(!props.showCollegeList);
  }
  const handleDepartmentShow=()=>{
     props.setShowStudentList(false);
    
    props.setShowSummaryList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(!props.showDepartmentList);

  }
  const handleSummaryShow=()=>{
   
    props.setShowStudentList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(false);
    props.setShowSummaryList(!props.showSummaryList)
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
  return (
    <React.Fragment>
      
    <div className={Styles.container}>
    <div className={Styles.heading}><i className="bi bi-speedometer2 ps-3"><span className={Styles.spanItem}>Dashboard</span></i></div>
    <hr/>
    <div  className={Styles.list}>
    <div className={`${Styles.listItem} ${props.showSummaryList && Styles.active}`}onClick={handleSummaryShow}><i className="bi bi-list-check ps-3"><span className={Styles.spanItem}>Summary</span></i></div>
    <div className={`${Styles.listItem} ${props.showStudentList && Styles.active}`} onClick={handleStudentShow}><i className="bi bi-person ps-3"><span className={Styles.spanItem}>Students List</span></i></div>
    {props.typeOfUser.type!="College" && <div className={`${Styles.listItem} ${props.showCollegeList && Styles.active}`} onClick={handleCollegeShow}><i className="bi bi-building ps-3"><span className={Styles.spanItem}>College List</span></i></div>}
    <div className={`${Styles.listItem} ${props.showDepartmentList && Styles.active}`} onClick={handleDepartmentShow}><i className="bi bi-briefcase ps-3"><span className={Styles.spanItem}>Department List</span></i></div>
   <div className={Styles.navButton} onClick={handleLogout}><i className="bi bi-box-arrow-left ps-3 "><span className={`${Styles.spanItem}`}>Logout</span></i></div>
    </div>
    </div>
    </React.Fragment>
  )
}

export default LeftBar