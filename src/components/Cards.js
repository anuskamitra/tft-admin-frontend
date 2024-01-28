import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { LuView } from "react-icons/lu";
import { TiTick } from "react-icons/ti";
import { LuUpload } from "react-icons/lu";
import Styles from "./StudentForm.module.css";
import axios from "axios";
import Button from "./Button";
import InputController from "./InputController";
import app from "../firebase"

function Cards(props) {
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [result, setResult] = useState("");
  const [title, setTitle] = useState("");
  const[status,setStatus]=useState("");
  const [showInputField, setShowInputField] = useState(false);
  const[uploadPerc,setUploadPerc]=useState(0);
  const[showView,setShowView]=useState(true);
  const semOfStudent = props.semester;

  const submitResult = async (e) => {
    e.preventDefault();
    await uploadPDF(result);    
  };

  const uploadPDF=async(file)=>{
    const storage = getStorage(app);
    const metadata = {
      contentType: 'application/pdf'
    };
    console.log(file)
    const fileName=new Date().getTime()+file.name;
    const storageRef = ref(storage, 'files/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    uploadTask.on('state_changed',
  (snapshot) => {

    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    setUploadPerc(Math.round(progress));
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    switch (error.code) {
      case 'storage/unauthorized':
        console.log(error);
        break;
      case 'storage/canceled':
        break;
      case 'storage/unknown':
        break;
        default:
          break;
    }
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      setResult(downloadURL);
      handlePostReq(downloadURL);
    });
  }
);
  }
  const handlePostReq=async(url)=>{
  const details={
    id: props.id,
    title: title,
    result: url,
    status:status

  }
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL+"/api/uploadResult",
     details
    );
    console.log(response);
    if (response) {
      setShowSubmitButton(false);
      setShowInputField(false);
      setShowView(true)
     
    }
  }

  const viewResult = async () => {
    console.log(semOfStudent);
    const pdfURL = await props.resultList.find((obj) => obj.Title === semOfStudent);
    console.log(pdfURL);
    console.log(pdfURL.Result);
    window.open(
      pdfURL.Result,
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
    await axios.post(process.env.REACT_APP_BACKEND_URL+"/api/deleteResult",deleteDetails)
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
            onChange={(e) => {
              setResult(e.target.files[0]);
            
            }}
            name={result}
          />
          <div className="form-check">
          <label className="form-check-label" >
          <input className="form-check-input" type="radio" value="true"name="status" onChange={(event=>setStatus(event.target.value))}/>
          <h6>Pass</h6>
          </label><br/>
          <label className="form-check-label">
          <input className="form-check-input" type="radio" value="false" name="status" onChange={(event=>setStatus(event.target.value))}/>
          <h6>Fail</h6>
          </label>
          </div>

          <div className="text-center ">
            <Button
              className="bg-success me-3"
              msg="submit"
              onClick={submitResult}
              type="submit"
             disabled={!result || !status}
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
