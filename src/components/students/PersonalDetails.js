import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/esm/Table";
import UpdateForm from "./UpdateForm";
import { useSelector } from "react-redux";

function PersonalDetails(props) {
  const userState=useSelector((state)=>{
    return state.user
  })
  const typeOfUser=userState.type
  console.log(typeOfUser)
  
  const [studentDetails, setStudentDetails] = useState({});
  const [updateForm, setUpdateForm] = useState(false);
  const [mobileNoUpdate, setMobileNoUpdate] = useState(false);
  const [emailUpdate, setEmailUpdate] = useState(false);
  const getStudent = () => {
    const id = typeOfUser.id;
    axios
      .post(process.env.REACT_APP_BACKEND_URL+"/api/fetchOneStudent", { id })
      .then((response) => {
        console.log(response.data);
        setStudentDetails(response.data);
      });
  };
  useEffect(() => {
    getStudent();
  }, []);

  return (
    <React.Fragment>
      <h4 className="text-center text-muted">Basic Details</h4>
      <div className="d-flex w-75 flex-row m-auto align-center justify-content-between mt-5">
        {updateForm && (
          <UpdateForm
          studentDetails={studentDetails}
            setUpdateForm={setUpdateForm}
            updateForm={updateForm}
            setMobileNoUpdate={setMobileNoUpdate}
            mobileNoUpdate={mobileNoUpdate}
            emailUpdate={emailUpdate}
            setEmailUpdate={setEmailUpdate}
            getStudent={ getStudent}
          />
        )}
        <Table striped bordered hover size="lg">
          <tbody>
            <tr>
              <td>
                <h5 className="text-muted">Name</h5>{" "}
              </td>
              <td>
                <h5 className="text-muted"> {studentDetails?.Name}</h5>
              </td>
            </tr>
            <tr>
              <td>
                <h5 className="text-muted">Email</h5>
              </td>{" "}
              <td>
                <h5 className="text-muted">
                  {studentDetails?.Email}
                  <i
                    class="bi bi-pencil-square fs-6 ps-3 text-black cursor-pointer"
                    onClick={() => {
                      setUpdateForm(true);
                      setEmailUpdate(true);
                      setMobileNoUpdate(false);
                    }}
                  ></i>
                </h5>
              </td>
            </tr>

            <tr>
              <td>
                <h5 className="text-muted">Father</h5>
              </td>{" "}
              <td>
                <h5 className="text-muted">{studentDetails.Father}</h5>
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                <h5 className="text-muted">Mother</h5>
              </td>{" "}
              <td>
                <h5 className="text-muted">{studentDetails.Mother}</h5>
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                <h5 className="text-muted"> D.O.B</h5>
              </td>
              <td>
                <h5 className="text-muted">
                  {" "}
                  {studentDetails?.Birthday || "17/01/2001"}
                </h5>
              </td>
            </tr>
            <tr>
              <td>
                <h5 className="text-muted">Semester</h5>
              </td>{" "}
              <td>
                <h5 className="text-muted">{studentDetails.Sem}</h5>
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                <h5 className="text-muted"> Mobile</h5>
              </td>
              <td>
                {" "}
                <h5 className="text-muted">
                  {studentDetails.Mobile}
                  <i
                    class="bi bi-pencil-square fs-6 ps-3 text-black cursor-pointer"
                    onClick={() => {
                      setUpdateForm(true);
                      setMobileNoUpdate(true);
                      setEmailUpdate(false);
                    }}
                  ></i>
                </h5>
              </td>
            </tr>
            <tr>
              <td>
                <h5 className="text-muted">College Name</h5>
              </td>
              <td>
                <h5 className="text-muted">{studentDetails?.College?.Name}</h5>
              </td>
            </tr>
            <tr>
              <td>
                <h5 className="text-muted"> Department </h5>
              </td>
              <td>
                <h5 className="text-muted">
                  {" "}
                  {studentDetails?.Department?.Name}
                </h5>
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="d-flex  align-items-center ms-3">
          {" "}
          <img
            src={studentDetails.Photo}
            style={{
              width: "200px",
              height: "250px",
              borderRadius: "0%",
              border: "5px solid #e5e7e9",
            }}
          ></img>
        </div>
        {/* </div> */}
      </div>
    </React.Fragment>
  );
}

export default PersonalDetails;
