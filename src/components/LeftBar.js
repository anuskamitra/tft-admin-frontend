import React from 'react'
import Styles from './Leftbar.module.css'
function LeftBar(props) {
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
    console.log("Summary" + props.showSummaryList)
  }
  return (
    <React.Fragment>
    <div className={Styles.container}>
    <div className={Styles.heading}>Modules</div>
    <hr/>
    <div  className={Styles.list}>
    <div className={Styles.listItem} onClick={handleStudentShow}>Students List</div>
    <div className={Styles.listItem} onClick={handleCollegeShow}>College List</div>
    <div className={Styles.listItem} onClick={handleDepartmentShow}>Department List</div>
    <div className={Styles.listItem}onClick={handleSummaryShow}>Summary</div>
    </div>
    </div>
    </React.Fragment>
  )
}

export default LeftBar