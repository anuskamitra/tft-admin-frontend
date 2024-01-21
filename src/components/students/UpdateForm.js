import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../Button";
import InputController from "../InputController";
import Styles from "../StudentForm.module.css";
import { useSelector } from "react-redux";

function UpdateForm(props) {
  const userState=useSelector((state)=>{
    return state.user
  })
  const typeOfUser=userState.type
  const [fieldToBeUpdated, setFieldToBeUpdated] = useState("");
  const [error, setError] = useState({});
  const[studentNumberUpdate,setStudentNumberUpdate]=useState({id:typeOfUser.id,currentNumber:"",newNumber:"",confirmNumber:""});
  const[studentEmailUpdate,setStudentEmailUpdate]=useState({id:typeOfUser.id,currentEmail:"",newEmail:"",confirmEmail:""});
  const [notMatch,setNotMatch]=useState("");
 
  // const getStudent=()=>{
  //   const id=typeOfUser.id;
  //   axios.post("http://localhost:8080/api/fetchOneStudent",{id})
  //     .then(response=>{
  //       //  console.log(response.data)
  //       setStudentDetails(response.data);
  //     });
  // }
  const handleUpdateStudentFrom=(e)=>{
    e.preventDefault();
    setError({});
    setNotMatch(false);
    let validationError=false;
    if(props.mobileNoUpdate){
    console.log(studentNumberUpdate)
    if (studentNumberUpdate?.currentNumber === "") {
      setError((prev) => ({ ...prev, currentNumber: "Current Number is required!" }));
      validationError=true;
    }
    else if (studentNumberUpdate?.currentNumber !=props.studentDetails?.Mobile) {
      setError((prev) => ({ ...prev, currentNumber: "Current Number do not match!" }));
      validationError=true;
    }

    else if(studentNumberUpdate?.currentNumber.length!=10){
      setError((prev) => ({ ...prev, currentNumber: "Enter Valid number" }));
      validationError=true;
    } 
    if (studentNumberUpdate.newNumber === "") {
   
      setError((prev) => ({ ...prev, newNumber: "New Number required!" }));
      validationError=true;
    } 
    else if(studentNumberUpdate?.newNumber.length!=10){
      setError((prev) => ({ ...prev, newNumber: "Enter Valid number" }));
      validationError=true;
    }
    if (studentNumberUpdate.confirmNumber === "") {   
      setError((prev) => ({ ...prev, confirmNumber: "Have to confirm the new number!" }));
      validationError=true;
    }
    else if(studentNumberUpdate?.confirmNumber.length!=10){
      setError((prev) => ({ ...prev,confirmNumber: "Enter Valid number" }));
      validationError=true;
    } 
    if(studentNumberUpdate?.confirmNumber!==studentNumberUpdate?.newNumber){
      setNotMatch("Number do not match" );
      validationError=true;
    }
   
    if(!validationError){ 
      try{
        console.log("studentNumberUpdate")
        axios.post("http://localhost:8080/api/updateMobile",studentNumberUpdate)
        .then(response=>{
          console.log(response.data);
          clearForm()
          props.getStudent();
        })
      }
      catch(err){
        console.log(err);
      }
    }
  }
  else{
    if (studentEmailUpdate?.currentEmail === "") {
      setError((prev) => ({ ...prev, currentEmail: "Current Email is required!" }));
      validationError=true;
    }
    else if(studentEmailUpdate?.currentEmail!=props.studentDetails?.Email){
      setError((prev) => ({ ...prev, currentEmail: "Current email do not match" }));
      validationError=true;
    } 
    if (studentEmailUpdate.newEmail === "") {
   
      setError((prev) => ({ ...prev, newEmail: "New Email required!" }));
      validationError=true;
    } 
    // else if(studentEmailUpdate?.newEmail.length!=10){
    //   setError((prev) => ({ ...prev, newEmail: "Enter Valid Email" }));
    //   validationError=true;
    // }
    if (studentEmailUpdate.confirmEmail === "") {   
      setError((prev) => ({ ...prev, confirmEmail: "Have to confirm the new Email!" }));
      validationError=true;
    }
    if(studentEmailUpdate.confirmEmail!==studentEmailUpdate.newEmail){
      setNotMatch("Email do not match" );
      validationError=true;
    }
    // else if(studentEmailUpdate?.confirmEmail.length!=10){
    //   setError((prev) => ({ ...prev,confirmEmail: "Enter Valid Email" }));
    //   validationError=true;
    // } 
   
    if(!validationError){ 
      try{
        console.log(studentEmailUpdate)
        axios.post("http://localhost:8080/api/updateEmail",studentEmailUpdate)
        .then(response=>{
          console.log(response.data);
          clearForm()
          props.getStudent();
        })
      }
      catch(err){
        console.log(err);
      }
    }
  }

  }

  useEffect(() => {
    console.log(props.mobileNoUpdate);
    if (props.mobileNoUpdate) {
      setFieldToBeUpdated("Mobile Number");
    } else {
      setFieldToBeUpdated("Email");
    }
  }, []);
  const clearForm = () => {
     props.setUpdateForm(false);
    props.setMobileNoUpdate(false);
    props.setEmailUpdate(false);
  };
  return (
    <React.Fragment>
      <div className={Styles.container} onClick={clearForm}></div>
      <div className={`${Styles.body} your-div`}>
        <div>

          <h4 className="text-center pt-3">Update {fieldToBeUpdated}</h4>

        {props.mobileNoUpdate ?  <div><InputController
            label="Enter the current phone number"
            error={error.currentNumber}
            req={true}
            type="number"
            placeholder="Enter Phone Number"
            name="currentNumber"
            onChange={(event)=>setStudentNumberUpdate({...studentNumberUpdate,currentNumber:event.target.value})}
          />
          <InputController
            label="Enter the new phone number"
            error={error.newNumber}
            req={true}
            type="number"
            placeholder="Enter new Phone Number"
            name="newNumber"
            onChange={(event)=>setStudentNumberUpdate({...studentNumberUpdate,newNumber:event.target.value})}
          />
          <InputController
            label="Confirm the new phone number"
            error={error.confirmNumber}
            req={true}
            type="number"
            placeholder="reenter new phone Number"
            name="confirmNumber"
            onChange={(event)=>setStudentNumberUpdate({...studentNumberUpdate,confirmNumber:event.target.value})}
          /></div>:

          // {props.setEmailUpdate &&
          <div><InputController
          label="Enter the current Email"
          error={error.currentEmail}
          req={true}
          type="text"
          placeholder="Enter email"
          name="currentEmail"
          onChange={(event)=>setStudentEmailUpdate({...studentEmailUpdate,currentEmail:event.target.value})}
        />
        <InputController
          label="Enter the new Email"
          error={error.newEmail}
          req={true}
          type="text"
          placeholder="Enter new Email"
          name="newEmail"
          onChange={(event)=>setStudentEmailUpdate({...studentEmailUpdate,newEmail:event.target.value})}
        />
        <InputController
          label="Confirm the new Email"
          error={error.confirmEmail}
          req={true}
          type="text"
          placeholder="reenter new Email"
          name="confirmEmail"
          onChange={(event)=>setStudentEmailUpdate({...studentEmailUpdate,confirmEmail:event.target.value})}
        /></div>
          }
            {notMatch && <p className="fs-5 fw-bold text-center text-danger m-0">{notMatch}</p>}
           <div className="d-grid mt-2">
              <Button
                msg="Submit"
                type="submit"
                 onClick={handleUpdateStudentFrom}
              />
            </div>
          
        </div>
      </div>
    </React.Fragment>
  );
}

export default UpdateForm;
