import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Styles from "../Students.module.css";
import { LuView } from "react-icons/lu";
import { LuDownload } from "react-icons/lu";
import axios from "axios";

function StudentResult(props) {
  const [resultList, setResultList] = useState([]);
  const results = [];
  const [arr, setArr] = useState([]);
  const id = props.typeOfUser.id;
  const sem = props.typeOfUser.sem;
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
    const url = "http://localhost:8080/files/" + resultTOBeShown.Result;
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
        //  aTag.remove();
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
      "http://localhost:8080/files/" + resultTOBeShown.Result,
      "_blank",
      "noreferrer"
    );
  };
  let semestersToShow = Array.from(
    { length: sem - 1 },
    (_, index) => index + 1
  );
  useEffect(() => {
    getResults();
  }, []);
  return (
    <div className="">
      <h3 className=" text-muted text-center pb-3">
        Results of All the Semesters
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
                            className="fw-bold  pb-1"
                            style={{
                              background: "#6593f7",
                              border: "none",
                              color: "white",
                            }}
                            type="submit"
                            onClick={() => handleShowResult(index + 1)}
                          >
                            {<LuView />}
                          </button>
                        </h5>
                        </td>
                        <td>
                    <h5>
                      <button  className="fw-bold pb-1"
                          style={{
                            background:"black",
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
                            background: "#c5c6d0",
                            border: "none",
                            color: "white",
                          }}
                        >
                          {<LuView />}
                        </button>
                      </h5>
                      </td>
                      <td>
                    <h5>
                      <button  className="fw-bold pb-1"
                       disabled="true"
                          style={{
                            background:"#c5c6d0",
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
