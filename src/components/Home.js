import React from "react"
import { useEffect,useState} from "react"
import { useNavigate } from "react-router-dom"
import LeftBar from "./LeftBar";
import Styles from "./Home.module.css"
import Students from "./Students";
import CollegeList from "./CollegeList";
import DepartmentList from "./DepartmentList"
import Summary from "./Summary";
import ProfessorList from "./ProfessorList";
import PersonalDetails from "./students/PersonalDetails"
import Result from "./students/StudentResult"
import UpdateForm from "./students/UpdateForm";
import { useDispatch } from 'react-redux';
import { typeOfUser } from "../store/slices/UserSlice";
function Home(){
   const Navigate=useNavigate();
   const dispatch = useDispatch();
   // const[typeOfUser,setTypeOfUser]=useState({type:"",email:"",id:""});
   useEffect(()=>{
      const user=JSON.parse(localStorage.getItem("userInfo"));
      if(!user){
         Navigate("/");
      }
      else{
            // setTypeOfUser({type:user.typeOfUser,email:user.email,id:user._id,name:user.name,sem:user.sem});
            const userInfo={
               type:user.typeOfUser,
               email:user.email,
               id:user._id,
               name:user.name,
               sem:user.sem
            }
            dispatch(typeOfUser(userInfo))
            
         
      }
   },[])
   const[showStudentList,setShowStudentList]=useState(false);
   const[showCollegeList,setShowCollegeList]=useState(false);
   const[showDepartmentList,setShowDepartmentList]=useState(false);
   const[showSummaryList,setShowSummaryList]=useState(false);
   const [showProfessorList,setShowProfessorList]=useState(false);
   const[showProfile,setShowProfile]=useState(false)
   const[showResult,setShowResult]=useState(false)
   const [showUpdateForm,setShowUpdateForm]=useState(false)
 return (
   <React.Fragment>
      <div className="d-flex">
    <div className={Styles.LeftBar}>
    <LeftBar showStudentList={showStudentList} setShowStudentList={setShowStudentList} showCollegeList={showCollegeList} setShowCollegeList={setShowCollegeList} setShowDepartmentList={setShowDepartmentList} showDepartmentList={showDepartmentList} setShowSummaryList={setShowSummaryList} showSummaryList={showSummaryList} showProfessorList={showProfessorList} setShowProfessorList={setShowProfessorList} showProfile={showProfile} setShowProfile={setShowProfile} showResult={showResult} setShowResult={setShowResult} showUpdateForm={showUpdateForm} setShowUpdateForm={setShowUpdateForm}/></div>
    <div className={Styles.rightContent} > 
     {showStudentList ?<Students/>:
      showCollegeList?<CollegeList/>:
   //   showDepartmentList?<DepartmentList typeOfUser={typeOfUser}/>:
   //   showSummaryList?<Summary typeOfUser={typeOfUser}/>:
   //   showProfessorList?<ProfessorList typeOfUser={typeOfUser}/>:
   //   showProfile?<PersonalDetails typeOfUser={typeOfUser}/>:
   //   showResult?<Result  typeOfUser={typeOfUser} />: 
   //   showUpdateForm?<UpdateForm  typeOfUser={typeOfUser}/>:
     <div className={Styles.nothing}>
      <p>Choose a list from</p>
      <p>the modules to </p>
      <p> show the list of </p>
      <p>  Students or Colleges</p>
     </div>
     }</div>  
    </div>

    </React.Fragment>
 )
}
export default Home
