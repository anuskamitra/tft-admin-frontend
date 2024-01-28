import React,{Profiler, useEffect,useState} from 'react'
import Styles from './Leftbar.module.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {loggedInAsCollege} from "../store/slices/UserSlice"
import { PiStudentFill } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";



function LeftBar(props) {
  const dispatch=useDispatch()
  const Navigate=useNavigate();
 const[showAlumniYear,setShowAlumniYear]=useState(false);
 
 
const userState=useSelector((state)=>{
  return state.user
})

const typeOfUser=userState.type;
const loggedIn=userState.loggedIn
console.log(typeOfUser)
console.log(loggedIn)
  const handleStudentShow=()=>{
       props.setShowCollegeList(false);
       props.setShowDepartmentList(false);
       props.setShowSummaryList(false);
       props.setShowProfessorList(false);
       props.setShowAlumniList(false);
      props.setShowStudentList(!props.showStudentList);
      setShowAlumniYear(false);
      props.setChosenYear("");
      props.setShowHoliday(false);
      props.setShowQuestionPaper(false);
  }
  const handleCollegeShow=()=>{
     props.setShowStudentList(false);
     props.setShowDepartmentList(false);
     props.setShowSummaryList(false);
     props.setShowProfessorList(false);
     props.setShowAlumniList(false);
    props.setShowCollegeList(!props.showCollegeList);
    setShowAlumniYear(false);
    props.setChosenYear("");
    props.setShowHoliday(false);
    props.setShowQuestionPaper(false);
  }
  const handleDepartmentShow=()=>{
     props.setShowStudentList(false);
     props.setShowProfessorList(false);
    props.setShowSummaryList(false);
    props.setShowCollegeList(false);
    props.setShowAlumniList(false);
    props.setShowDepartmentList(!props.showDepartmentList);
    setShowAlumniYear(false);
    props.setChosenYear("");
    props.setShowHoliday(false);
    props.setShowQuestionPaper(false);

  }
  const handleSummaryShow=()=>{
    props.setShowStudentList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(false);
    props.setShowProfessorList(false);
    props.setShowAlumniList(false);
    props.setShowSummaryList(!props.showSummaryList)
    setShowAlumniYear(false);
    props.setChosenYear("");
    props.setShowHoliday(false);
    props.setShowQuestionPaper(false);
  }
  const handleTeacherShow=()=>{
    props.setShowStudentList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(false);
    props.setShowSummaryList(false);
    props.setShowAlumniList(false);
    props.setShowProfessorList(!props.showProfessorList);
    setShowAlumniYear(false);
    props.setChosenYear("");
    props.setShowHoliday(false);
    props.setShowQuestionPaper(false);

  }
  const handleProfileShow=()=>{
    props.setShowResult(false);
    props.setShowProfile(!props.showProfile);
    props.setShowQuestionPaper(false)
    props.setShowHoliday(false)
  }
  const handleStudentPaperShow=()=>{
    props.setShowResult(false);
    props.setShowProfile(false);
    props.setShowQuestionPaper(!props.showQuestionPaper)
    props.setShowHoliday(false)
  }

  const handleResultShow=()=>{
    props.setShowProfile(false);
    props.setShowResult(!props.showResult);
    props.setShowQuestionPaper(false)
    props.setShowHoliday(false)
  }
  
  const handleAlumniShow=()=>{
    props.setShowStudentList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(false);
    props.setShowSummaryList(false);
    props.setShowProfessorList(false);
    setShowAlumniYear(!showAlumniYear);
    props.setShowHoliday(false)
    props.setShowQuestionPaper(false);
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
  const handleBackToAdmin=()=>{
    console.log("back")
    const loggedInAs={
      loggedInAsCollege:false,
      collegeId:"",
      collegeName:""
    }
    dispatch(loggedInAsCollege(loggedInAs))
    props.setShowSummaryList(true);
    props.setShowStudentList(false);
    props.setShowCollegeList(false);
    props.setShowDepartmentList(false);
    props.setShowProfessorList(false);
  }
  const handleShowAlmuniYear=(year)=>{
    console.log(year)
    props.setShowAlumniList(true)
    props.setChosenYear(year);

  }
const handleHolidayShow=()=>{
  props.setShowHoliday(!props.showHoliday)
  props.setShowStudentList(false);
  props.setShowCollegeList(false);
  props.setShowDepartmentList(false);
  props.setShowSummaryList(false);
  props.setShowAlumniList(false);
  props.setShowProfessorList(false);
  setShowAlumniYear(false);
  props.setChosenYear("");
  props.setShowQuestionPaper(false);
}
const handlePaperShow=()=>{
  console.log("hello")
  props.setShowQuestionPaper(!props.showQuestionPaper);
  props.setShowHoliday(false)
  props.setShowStudentList(false);
  props.setShowCollegeList(false);
  props.setShowDepartmentList(false);
  props.setShowSummaryList(false);
  props.setShowAlumniList(false);
  props.setShowProfessorList(false);
  setShowAlumniYear(false);
  props.setChosenYear("");
}

useEffect(()=>{
  console.log(props.showQuestionPaper)
},[props.showQuestionPaper])

  return (
    <React.Fragment> 
      {typeOfUser.type==="College" || typeOfUser.type==="Admin" ?
    <div className={Styles.container}>
    <div className={Styles.heading}><i className="bi bi-speedometer2 ps-3"><span className={Styles.spanItem}>Dashboard</span></i></div>
    <hr/>
    <div  className={Styles.list}>
      { loggedIn?.loggedInAsCollege && <div className="pb-3 ms-auto me-auto" ><button type="button" class="btn btn-light" onClick={handleBackToAdmin}>Admin</button></div>}
    <div className={`${Styles.listItem} ${props.showSummaryList && Styles.active}`}onClick={handleSummaryShow}><i className="bi bi-list-check ps-3"><span className={Styles.spanItem}>Summary</span></i></div>
    <div className={`${Styles.listItem} ${props.showStudentList && Styles.active}`}onClick={handleStudentShow}><i className="bi bi-person ps-3"><span className={Styles.spanItem}>Students List</span></i></div>
    {(typeOfUser.type!=="College"&& !loggedIn?.loggedInAsCollege) && <div className={`${Styles.listItem} ${props.showCollegeList && Styles.active}`} onClick={handleCollegeShow}><i className="bi bi-building ps-3"><span className={Styles.spanItem}>College List</span></i></div>}
    <div className={`${Styles.listItem} ${props.showDepartmentList && Styles.active}`} onClick={handleDepartmentShow}><i className="bi bi-briefcase ps-3"><span className={Styles.spanItem}>Department List</span></i></div>
    <div className={`${Styles.listItem} ${props.showProfessorList && Styles.active}`} onClick={handleTeacherShow}><i className="bi bi-person-square ps-3"><span className={Styles.spanItem}>Professors List</span></i></div>
   {(typeOfUser.type==="College"|| loggedIn?.loggedInAsCollege) && <div className={`${Styles.listItem} ${props.showHoliday && Styles.active}`} onClick={handleHolidayShow}><i className="ps-3"> <MdOutlineHolidayVillage /><span className={Styles.spanItem}>Holiday List</span></i></div>}
   {(typeOfUser.type==="College"|| loggedIn?.loggedInAsCollege) &&  <div className={`${Styles.listItem} ${props.showAlumniList && Styles.active}`} onClick={handleAlumniShow}><i className="ps-3 "> <PiStudentFill size={"26px"} /><span className={Styles.spanItem}>Alumni List</span></i></div>}
    {showAlumniYear &&
     <nav className={`${Styles.yearList} your-div pt-2 `} style={{ overflowY: 'auto', maxHeight: '100px' }}>
      <ul className={`${Styles.yearListItem} ${props.chosenYear===2020 && Styles.yearActive}`} onClick={()=>handleShowAlmuniYear(2020)}><SlCalender /><span className={`${Styles.spanItem}`}>2020</span></ul>
      <ul className={`${Styles.yearListItem} ${props.chosenYear===2021 && Styles.yearActive}` } onClick={()=>handleShowAlmuniYear(2021)}><SlCalender /><span className={Styles.spanItem}>2021</span></ul>
      <ul className={`${Styles.yearListItem} ${props.chosenYear===2022 && Styles.yearActive}`} onClick={()=>handleShowAlmuniYear(2022)}><SlCalender /><span className={Styles.spanItem}>2022 </span></ul>
      <ul className={`${Styles.yearListItem} ${props.chosenYear===2023 && Styles.yearActive}`} onClick={()=>handleShowAlmuniYear(2023)}><SlCalender /><span className={Styles.spanItem}>2023</span></ul>
      </nav>}
    {(typeOfUser.type==="College"|| loggedIn?.loggedInAsCollege) && <div className={`${Styles.listItem} ${props.showQuestionPaper && Styles.active}`} onClick={handlePaperShow}><i className="ps-3"><RiFilePaper2Line /><span className={Styles.spanItem}>Sample papers</span></i></div> }
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
         <div className={`${Styles.listItem} ps-3 ${props.showHoliday && Styles.active}`} onClick={()=>props.setShowHoliday(!props.showHoliday)}><i className="ps-3"> <MdOutlineHolidayVillage/> <span className={Styles.spanItem}>holiday List</span></i></div>
        <div className={`${Styles.listItem} ps-3 ${props.showQuestionPaper && Styles.active}`} onClick={handleStudentPaperShow}><i className="ps-3"><RiFilePaper2Line /> <span className={Styles.spanItem}>Sample papers</span></i></div>
         <div className={`${Styles.navButton} ps-3`} onClick={handleLogout}><i className="bi bi-box-arrow-left ps-3 "><span className={`${Styles.spanItem}`}>Logout</span></i></div>
        </div>
      </div>
    }
     {/* <div className={`${Styles.navButton} ps-3`} onClick={handleLogout}><i className="bi bi-box-arrow-left ps-3 "><span className={`${Styles.spanItem}`}>Logout</span></i></div> */}

    </React.Fragment>
  )
}

export default LeftBar