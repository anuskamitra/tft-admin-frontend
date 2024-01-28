import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Styles from "../Students.module.css";
import { LuView } from "react-icons/lu";
import { LuDownload } from "react-icons/lu";
import { GrView } from "react-icons/gr";
import { useSelector } from "react-redux";
import axios from "axios";

function StudentResult(props) {
  const userState=useSelector((state)=>{
    return state.user
  }) 
  const typeOfUser=userState.type;
  console.log(typeOfUser)
  
  const [resultList, setResultList] = useState([]);

  const id = typeOfUser.id;
  const sem = typeOfUser.sem;
  const Name=typeOfUser.name
  const backendURL = "http://localhost:8080";
  const getResults = () => {
    axios.post(backendURL + "/api/fetchOneStudent", { id }).then((response) => {
      console.log(response.data);
      setResultList(response.data?.Results);
    });
  };
  const handleDownload = (sem) => {
    console.log("downloaded" + sem);
    const resultTOBeShown = resultList.find((obj) => obj.Title === sem);
    const url = process.env.REACT_APP_BACKEND_URL+"/files/" + resultTOBeShown.Result;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = window.URL.createObjectURL(blob);
        const fileName = url.split("/").pop();
        const aTag = document.createElement("a");
        aTag.href = blobURL;
        aTag.setAttribute("download", fileName);
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  };
  const handleShowResult = (sem) => {
    const resultTOBeShown = resultList.find((obj) => obj.Title === sem);
    console.log(resultTOBeShown);
    window.open(
      process.env.REACT_APP_BACKEND_URL+"/files/" + resultTOBeShown.Result,
      "_blank",
      "noreferrer"
    );
  };
  let semestersToShow = Array.from(
    { length: sem},
    (_, index) => index + 1
  );
  useEffect(() => {
    getResults();
  }, []);
  return (
    <div className="">
      <h3 className=" text-muted text-center pb-3">
        All Semesters Results of {Name}
      </h3>
      <div className={Styles.resultContainer}>
        <Table striped bordered size="lg">
          <tbody>
            {semestersToShow.map((sem, index) => {
              return (
                <tr>
                  <td>
                    <h5 className="text-muted">Result in {index + 1} sem </h5>
                  </td>
                 
                    {resultList.find((obj) => obj.Title === sem) ? (
                      <>
                       <td>
                        <h5 className="text-muted">
                          <button
                            className="fw-bold w-25 pb-1"
                            style={{
                              background: "rgb(101,147,247)",
                              border: "none",
                              color: "white",
                            }}
                            type="submit"
                            onClick={() => handleShowResult(index + 1)}
                          >
                            {<GrView />}
                          </button>
                        </h5>
                        </td>
                        <td>
                    <h5>
                      <button  className="fw-bold pb-1"
                          style={{
                            background:"#6aa84f",
                            border: "none",
                            color: "white",
                          }}
                           onClick={()=>handleDownload(index+1)} ><LuDownload /></button> 
                           </h5>
                    </td>
                        </>
                     
                    ) : (
                      <>
                      <td>
                      <h5 className="text-muted">
                        <button
                         
                          className="fw-bold w-25 pb-1"
                          style={{
                            background: "rgba(101,147,247,0.2)",
                            border: "none",
                            color: "white",
                          }}
                        >
                          {<GrView />}
                        </button>
                      </h5>
                      </td>
                      <td>
                    <h5>
                      <button  className="fw-bold pb-1"
                       disabled="true"
                          style={{
                            background:"rgba(182,215,168,0.5)",
                            border: "none",
                            color: "white",
                          }}
                          ><LuDownload /></button> 
                           </h5>
                    </td>
                      </>
                    )}
                 
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default StudentResult;
