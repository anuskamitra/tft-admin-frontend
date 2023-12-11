import React from 'react'
import Styles from './Leftbar.module.css'
function LeftBar(props) {
    const handleStudentShow=()=>{
        props.setShowCollegeList(false);
        props.setShowStudentList(!props.showStudentList);
    }
    const handleCollegeShow=()=>{
      props.setShowStudentList(false);
      props.setShowCollegeList(!props.showCollegeList);
  }
  return (
    <React.Fragment>
    <div className={Styles.container}>
    <div className={Styles.heading}>Modules</div>
    <hr/>
    <div  className={Styles.list}>
    <div className={Styles.listItem} onClick={handleStudentShow}>Students List</div>
    <div className={Styles.listItem} onClick={handleCollegeShow}>College List</div>
    <div className={Styles.listItem}>Summary</div>
    </div>
    </div>
    </React.Fragment>
  )
}

export default LeftBar