import React,{useState,useEffect} from 'react'
import Styles from "./StudentForm.module.css";
import Cards from "./Cards"
import axios from "axios"


function ResultForm(props) {
  const[resultTitileList,setResultTitileList]=useState([])
  const[resultList,setResultList]=useState([]);
  
  const sem=props.sem
    const ShowCards=()=>{ 
      console.log()
      const cards=[];
      for(let i=0;i<sem-1;i++){
      
        let semester=i+1
        cards.push(<Cards key={i} semester={semester} id={props.idToUpdate} resultUploaded={resultTitileList.includes(semester)}  resultList={resultList}  />)
        console.log(resultTitileList);
        console.log(semester)
        console.log(resultTitileList.includes(semester))
      }
      return cards;
    }
    const clearForm=()=>{
        props.setShowResultForm(false)
    }
    useEffect(()=>{
      let arr=[];
      console.log(props)
      console.log(props.resultList)
      props.resultList.map(r=>arr.push(r.Title))
      setResultList(props.resultList);
      setResultTitileList(arr) 
    }
    ,[])
    return (
        <React.Fragment>
          <div className={Styles.container} onClick={clearForm}></div>
          <div className={`${Styles.body} your-div`}>

            <h3 className="text-center pt-3 pb-2">
             Student's Results
            </h3>  

            {ShowCards()}
          </div>
        </React.Fragment>
      );
}

export default ResultForm