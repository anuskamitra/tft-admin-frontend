import React from "react"
import { useEffect,useState} from "react"
import { useNavigate } from "react-router-dom"
import LeftBar from "./LeftBar";
import Styles from "./Home.module.css"
import Students from "./Students";
import CollegeList from "./CollegeList";
function Home(){
   const Navigate=useNavigate();
   useEffect(()=>{
      const user=JSON.parse(localStorage.getItem("userInfo"));
      if(!user){
         Navigate("/");
      }
   },[])
   const[showStudentList,setShowStudentList]=useState(false);
   const[showCollegeList,setShowCollegeList]=useState(false);
 return (
   <React.Fragment>
      <div className="d-flex">
         <div className={Styles.LeftBar}>
    <LeftBar showStudentList={showStudentList} setShowStudentList={setShowStudentList} showCollegeList={showCollegeList} setShowCollegeList={setShowCollegeList} /></div>
    <div className={Styles.rightContent} > 
     {showStudentList ?<Students/>:
     showCollegeList?<CollegeList/>:
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