import React, { useEffect, useState } from "react";
import Styles from "./Students.module.css";
import Button from "./Button";

import axios from "axios";
import Table from "react-bootstrap/Table";
import ProfessorForm from "./ProfessorForm";

function TeacherList(props) {
  const [showProfessorForm, setShowProfessorForm] = useState(false);
  const [professorList, setProfessorList] = useState([]);
  const [professorDetails,setProfessorDetails]=useState({Name:"",Email:"",College:"",Department:"",Photo:""})
  const [updateProfessor,setUpdateProfessor]=useState(false)
  const [collegeList,setCollegeList]=useState([])
  const typeOfUser = props.typeOfUser;


  const getCollege = () => {
    try {  
        axios
          .get("http://localhost:8080/college/fetchcolleges")
          .then((response) => {
            console.log(response);
            setCollegeList(response.data);
          });
      
   } catch (err) {
      console.log(err);
    }
  };
  const getProfessor = () => {
    try {
      if (typeOfUser.type === "College") {
        const collegeId = typeOfUser.id;
        axios
          .post("http://localhost:8080/professor/fetchprofessors", {
            collegeId,
          })
          .then((response) => {
            setProfessorList(response.data);
          });
      } else {
        axios
          .get("http://localhost:8080/professor/fetchprofessors")
          .then((response) => {
            setProfessorList(response.data);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdateProf = async(id) => {
    console.log(id);
    axios.post("http://localhost:8080/professor/fetchprofessortoupdate",{id})
    .then(response=>{
      const profInfo=response.data;
      console.log(response.data)
       let selectedCollege= collegeList.find(ob=>ob._id===profInfo.College._id)
       setShowProfessorForm(true)
    setUpdateProfessor(true)
        setProfessorDetails({
          _id:response.data._id,
            Photo:response.data.Photo,
            Name:response.data.Name,
            Email:response.data.Email,
            College:response.data.College?._id,
            Department:response.data.Department?._id,
            SelectedCollege:selectedCollege,
            SelectedDepartment:response.data.Department

        })
    })
   
  };
  const handleDeleteProf = (professor) => {
    try{
      axios.post("http://localhost:8080/professor/delete",professor)
      .then(response=>{
        console.log(response);
        getProfessor();
      })
    }
    catch(err){
      console.log(err);
    }
  };
  useEffect(() => {
    getProfessor();
    getCollege()
  }, []);
  return (
    <div className={Styles.container}>
      <h2 className="text-center"> Professors List</h2>
      <div>
        <p className="mt-2 text-center text-success">
          To add a new Professor{" "}
          <Button
            className="btn btn-success"
            msg="Add"
            type="submit"
            onClick={() => setShowProfessorForm(true)}
          />
        </p>
      </div>
      {showProfessorForm && <ProfessorForm typeOfUser={typeOfUser} setShowProfessorForm={setShowProfessorForm} setProfessorList={setProfessorList} getProfessor={getProfessor} professorDetails={professorDetails} setProfessorDetails={setProfessorDetails} updateProfessor={updateProfessor} setUpdateProfessor={setUpdateProfessor}/>}
      <div className={Styles.tableContainer}>
        <Table striped bordered size="lg">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              {typeOfUser.type !== "College" && <th>College</th>}
              <th>Department</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {professorList.map((professor) => {
              return (
                <tr key={professor.Email}>
                  <td>
                    <img
                      className={Styles.zoomImage}
                      src={professor.Photo}
                    ></img>
                  </td>
                  <td>{professor.Name} </td>
                  <td>{professor.Email} </td>
                  {typeOfUser.type !== "College" && (
                    <td>{professor.College?.Name} </td>
                  )}
                  <td>{professor.Department?.Name}</td>
                  <td>
                    {" "}
                    <Button
                      type="submit"
                      msg="Update"
                      className="btn btn-primary"
                      onClick={() => handleUpdateProf(professor._id)}
                    />
                  </td>
                  <td>
                    <Button
                      type="submit"
                      msg="Delete"
                      className="btn btn-danger"
                      onClick={() => handleDeleteProf(professor)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default TeacherList;
