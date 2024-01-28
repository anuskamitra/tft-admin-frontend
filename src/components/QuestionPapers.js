import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useSelector } from "react-redux";
import InputController from "./InputController";
import QuestionCard from "./QuestionCard";
import Button from "./Button";
import Styles from "./StudentForm.module.css";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { MdUploadFile } from "react-icons/md";
import  app from "../firebase"

function QuestionPapers() {
  const userState = useSelector((state) => {
    return state.user;
  });
  const typeOfUser = userState.type;
  const loggedIn = userState.loggedIn;
  const [departmentList, setDepartmentList] = useState([]);
  const[err,setError]=useState({});
  const [chosenDepartment, setChosenDepartment] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [chosenSemester, setChosenSemester] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [showSemester, setShowSemester] = useState(false);
  const [chosenCollege, setChosenCollege] = useState("");
  const [showInputForm, setShowInputForm] = useState(false);
  const[chosenDepartmentName,setChosenDepartmentName]=useState("")
  const [pDFPerc,setPDFPerc]=useState("");
  const [paper, setPaper] = useState("");

  const sem = [1, 2, 3, 4, 5, 6, 7, 8];
  const backEndURL = process.env.REACT_APP_BACKEND_URL+"";


  const getCollege = async () => {
    let collegeId = "";
    try {
      if (typeOfUser.type === "Student") {
        const id = typeOfUser.id;
        const response = await axios.post(
          process.env.REACT_APP_BACKEND_URL+"/api/fetchOneStudent",
          { id }
        );
        console.log(response.data.College._id);
        collegeId = response.data.College._id;
      } else if(typeOfUser.type === "College"){
        collegeId = typeOfUser.id;
      }
      else {
        collegeId=loggedIn.collegeId
      }
      console.log(collegeId);
      setChosenCollege(collegeId);
      axios
        .post(process.env.REACT_APP_BACKEND_URL+"/college/fetchonecollege", { collegeId })
        .then((response) => {
          console.log("called");
          console.log(response.data);
          setDepartmentList(response.data.Departments);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddnewSubject = async () => {
    
   let validationError=false;
   setError({});
    if(!subjectName){
      console.log("Hello")
      setError((prev) => ({ ...prev, subjectName: "Name is required!" }));
      validationError=true;

    }
    if(!paper){
      setError((prev) => ({ ...prev, paper:"Uploadin PDF is required"}));
      // setError({...err,paper:"Uploadin PDF is required"})
      
      validationError=true;
    }

    if(!validationError){
    await uploadPDF(paper); 
    console.log(paper)
  };
}

const handlePostReq=async(url)=>{
  const details={
    PDF: url,
    CollegeID: chosenCollege,
    DepartmentID: chosenDepartment,
    Semester: chosenSemester,
    SubjectName: subjectName
  }
  const result = await axios.post(
    backEndURL + "/samplePaper/addPaper",
   details
  );
  if (result) {
    getSubjectList();
    setShowInputForm(false);
    setPaper("");
    setSubjectName("");
  }
}

  const handleShowSubjectList = async (s) => {
    setChosenSemester(s);
    const details = {
      CollegeID: chosenCollege,
      DepartmentID: chosenDepartment,
      Semester: s,
    };
    const result = await axios.post(
      backEndURL + "/samplePaper/getPapers",
      details
    );
    setSubjectList(result.data);
    console.log(result.data);
  };
  const getSubjectList = async () => {
    const details = {
      CollegeID: chosenCollege,
      DepartmentID: chosenDepartment,
      Semester: chosenSemester,
    };
    const result = await axios.post(
      backEndURL + "/samplePaper/getPapers",
      details
    );
    setSubjectList(result.data);
    console.log(result.data);
  };
  const getStudentQustionPaper=async()=>{
    setChosenCollege(typeOfUser.college);
    console.log(typeOfUser.college)
    setChosenSemester(typeOfUser.sem)
    setChosenDepartment(typeOfUser.department)
    const details = {
      CollegeID: typeOfUser.college,
      DepartmentID: typeOfUser.department,
      Semester: typeOfUser.sem,
    };
    console.log(details)
    const result = await axios.post(
      backEndURL + "/samplePaper/getPapers",
      details
    );
    setSubjectList(result.data);
    console.log(result.data);
  };
  
  const clearForm=()=>{
    setShowInputForm(false)
    setPaper("");
    setSubjectName("")
    setError({})
  }

  useEffect(() => {
    if(typeOfUser.type==="Student"){
      console.log("getStudent")
      getStudentQustionPaper();
    }
    else{
    getCollege();
    }
  }, []);
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
    setPDFPerc(Math.round(progress));
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
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log(error);
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
        default:
          break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      setPaper(downloadURL);
      handlePostReq(downloadURL);
    });
  }
);


  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h2 className="mb-4">{!chosenDepartment && "Choose Department"}  </h2>
      {!chosenDepartment && (
        <>
        
        <div className="container text-center">
          <div className="row">
            {departmentList.map((department) => {
              return (
                <div key={department._id}>
                    <button className="btn border border-primary  mb-3 fs-4 content"
                      onClick={() => {
                        setShowSemester(true);
                        setChosenDepartment(department._id);
                        setChosenDepartmentName(department.Name)

                      }}
                    >
                      {department.Name}
                    </button>
                  
                </div>
              );
            })}
          </div>
        </div>
        </>
      )}
      {chosenDepartment && !chosenSemester &&
        showSemester &&
        <>
        <div className="d-flex">
        <div style={{marginRight:"50px"}}> <button className="btn border-danger-subtle" onClick={() => setChosenDepartment(false)}>
        <IoReturnUpBackSharp/>
          </button></div>
         <h2 className="text-center">Choose a Semester</h2></div>
        <div className="container text-center ms-5">
        <div className="row">
        {sem.map((s) => {
          return (
            <div className="col-4">
            <button className="shadow mb-2 pe-4 ps-4 rounded m-2 ms-0 text-center btn fs-5"
              key={s}
              onClick={() => {
                handleShowSubjectList(s);
              }}
            >
              Semester {s}
            </button>
            </div>
          );
        })}
       
       </div>
        </div> </>}
      {chosenSemester  && (
        <>
        {typeOfUser.type!=="Student" ?
        <div className="d-flex w-75 justify-content-between mb-4">
      
        <div className=""> <button  className="btn border-danger-subtle" onClick={() => setChosenSemester(false)}>
            <IoReturnUpBackSharp/>
          </button></div>
          <h2 className="text-center">Paper List of {chosenDepartmentName}, Sem-{chosenSemester}</h2>
          <div > <button className="btn border-success-subtle" onClick={() => setShowInputForm(!showInputForm)}>
            Add new
          </button></div>
          
          </div>:<h2 className="text-center">Paper List of {chosenDepartmentName}, Sem-{chosenSemester}</h2>}


         {subjectList.length===0 && <h2 className="text-danger">No Sample Question Paper To Show</h2>}
          {showInputForm && (
            <>
            <div className={Styles.container} onClick={clearForm} ></div>
            <div className={`${Styles.body} your-div`}>
            <h3 className="text-center pt-3">Add Paper</h3>
              <InputController
                req={true}
                type='text'
                error={err.subjectName}
                value={subjectName}
                label="Subject Name"
                placeholder="Eg :cs01sub1"
                onChange={(event) => {
                  setSubjectName(event.target.value);
                }}
              />
              <InputController
              req={true}
              label={pDFPerc}
                type="file"
                error={err.paper}
                accept="application/pdf"
                onChange={(e) => {
                  setPaper(e.target.files[0])
                }}
              />
               <div className="d-grid mt-2">
              <Button msg="Add" onClick={handleAddnewSubject} /></div>
              </div>
            </>
          )}

          {subjectList.map((subject) => {
            return (
              <>
                <QuestionCard
                  Name={subject.SubjectName}
                  id={subject._id}
                  pdfUploaded={subject.PDF}
                  subjectList={getSubjectList}
                />
              </>
            );
          })}
        </>
      )}
    </div>
  );
}

export default QuestionPapers;
