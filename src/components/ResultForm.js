import React,{useState,useEffect} from 'react'
import Styles from "./StudentForm.module.css";
import Cards from "./Cards"
import { RxCross1 } from "react-icons/rx";


function ResultForm(props) {
  const[resultTitileList,setResultTitileList]=useState([])
  const[resultList,setResultList]=useState([]);
  let semList=[];
  const sem=props.sem
  console.log(sem)
  for(let i=0;i<sem;i++){
    semList[i]=i+1;
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
          <div className={`${Styles.body} your-div` }>
            <div className='d-flex justify-content-between'>

            <h3 className="pt-3 pb-2">
             Result of {props.nameOfStudent}
            </h3> 
            <button style={{background:"transparent",border:"none"}} onClick={()=>props.setShowResultForm(false)}><h3 className="pt-3 pb-2"><RxCross1 color="red"/></h3></button> </div>
            {/* {ShowCards()} */}
            {semList.map((sem,i)=>{
              return <Cards key={i} semester={i+1} id={props.idToUpdate} resultUploaded={resultTitileList.includes(i+1)}  resultList={resultList}  />
            })}
          </div>
        </React.Fragment>
      );
}

export default ResultForm