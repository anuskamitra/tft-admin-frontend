import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";

function Summary() {
  const [studentList, setStudentList] = useState([]);
  const [collegeList, setCollegeList] = useState([]);
  const getStudent = async () => {
    try {
      axios.get("http://localhost:8080/api/fetchStudents").then((response) => {
        const data = response.data;
        setStudentList(data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const getCollege = () => {
    try {
      axios
        .get("http://localhost:8080/college/fetchcolleges")
        .then((response) => {
          setCollegeList(response.data);
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getStudent();
    getCollege();
  }, []);
  return (
    <React.Fragment>
      <div className="d-flex flex-row justify-content-around align-items-center">
        <div>
          <h3 className="text-center">Student List</h3>
          <Table striped bordered >
            <thead>
              <tr>
                <th>Name</th>
                <th>College</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student) => {
                return (
                  <tr key={student.Email}>
                    <td>{student.Name}</td>
                    <td>{student.College?.Name}</td>
                    <td>{student.Department?.Name}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div>
          <h3 className="text-center">College List</h3>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {collegeList.map((college) => {
                return (
                  <tr key={college.Email}>
                    <td>{college.Name}</td>
                    <td>{college.State}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Summary;
