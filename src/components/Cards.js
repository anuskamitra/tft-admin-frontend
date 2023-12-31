import React, { useEffect, useState } from "react";
import { LuView } from "react-icons/lu";
import { TiTick } from "react-icons/ti";
import { LuUpload } from "react-icons/lu";
import Styles from "./StudentForm.module.css";
import axios from "axios";
import Button from "./Button";
import InputController from "./InputController";

function Cards(props) {
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [result, setResult] = useState("");
  const [title, setTitle] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [showInputField, setShowInputField] = useState(false);
  const[showView,setShowView]=useState(true);
  const semOfStudent = props.semester;

  const submitResult = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", props.id);
    formData.append("title", title);
    formData.append("result", result);
    console.log(title);
    console.log(result);
    console.log(formData);

    const response = await axios.post(
      "http://localhost:8080/api/uploadResult",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(formData);
    console.log(response);
    if (response) {
      setShowSubmitButton(false);
      setShowInputField(false);
      setShowView(true)
     
    }
    
  };

  const viewResult = async () => {
    const pdfURL = props.resultList.find((obj) => obj.Title === semOfStudent);
    console.log(pdfURL.Result);
    window.open(
      "http://localhost:8080/files/" + pdfURL.Result,
      "_blank",
      "noreferrer"
    );
  };
  const deleteResult=async()=>{
    const deleteDetails={id:props.id,resultToBeDeleted:semOfStudent}
    const sureDelete=window.confirm("Are you sure to delete?")
    if(!sureDelete){
      return ;
    }
    else{
    await axios.post("http://localhost:8080/api/deleteResult",deleteDetails)
    .then(response=>{
     setShowView(false);
    setShowSubmitButton(true);;
    })
  }
  }
  useEffect(() => {
    setTitle(props.semester);
  }, [result]);
 
  return (
    <React.Fragment>
      <div
        className={`${Styles.cart} d-flex justify-content-between ps-3 mb-3`}
      >
        <h6>Semester {props.semester} </h6>

        <div className="d-flex">
          {((props.resultUploaded && showView) || (!props.resultUploaded && showView && !showSubmitButton) )&& (
            <>
              <h6 className="pe-3">
                <button
                  onClick={viewResult}
                  className="pb-1"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "green",
                  }}
                >
                  <LuView />{" "}
                </button>
              </h6>
              <h6 className="pe-3 text-success">
                <button
                  className="pb-1"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "black",
                  }}
                  onClick={deleteResult}
                >
                  {" "}
                  <i class="bi bi-trash"></i>
                </button>
              </h6>
            </>
          )}
        </div>

        {((!props.resultUploaded  
            &&  showSubmitButton)||(props.resultUploaded && !showView && showSubmitButton)) &&(
            <div div style={{ display: "flex", flexDirection: "column" }}>
              <button
                style={{ background: "transparent", border: "none" }}
                onClick={() => setShowInputField(true)}
              >
                <i class="bi bi-plus-circle pe-3 text-danger fw-bold"></i>
              </button>
            </div>
          )}
    
      </div>
      {showInputField && (
        <form className="">
          <InputController
            type="file"
            accept="application/pdf"
            id="resultInput"
            //   style={{ display: "none" }}
            onChange={(e) => {
              setResult(e.target.files[0]);
              setDisabled(false);
            }}
            name={result}
          />

          <div className="text-center ">
            <Button
              className="bg-success me-3"
              msg="submit"
              onClick={submitResult}
              type="submit"
              disabled={disabled}
            />
            <Button
              className="bg-dark ms-3"
              msg="Cancel"
              onClick={() => setShowInputField(false)}
              type="submit"
            />
          </div>
        </form>
      )}
    </React.Fragment>
  );
}

export default Cards;
