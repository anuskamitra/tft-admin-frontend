import React, { useState } from "react";
import InputController from "./InputController";
import Button from "./Button";
import axios from "axios";
import { LuView } from "react-icons/lu";


function Card(props) {
  const [showInput, setShowInput] = useState(false);
  const [paper, setPaper] = useState("");

  const viewPaper = (url) => {
    console.log("hello");
    const pdfURL = url;
    console.log(url);
    console.log(pdfURL);

    window.open(
       pdfURL,
      "_blank",
      "noreferrer"
    );
  };

  const deletePaper = async (id) => {
    const confirm = window.confirm("Are you sure, you want to delete?");
    if (confirm) {
      const response = await axios.post(
        "http://localhost:8080/samplePaper/deletePaper",
        { id }
      );
      console.log(response);
      props.subjectList();
    } else {
      return;
    }
  };
  return (
    <>
      <div className="shadow p-2 mb-2 bg-white rounded d-flex flex-row w-50 justify-content-between">
        <h3 className="fs-5  ps-3 mt-2">{props.Name}</h3>
        {props.pdfUploaded && (
          <div className="d-flex pe-3">
            <div>
              <button
                className="btn"
                onClick={() => viewPaper(props.pdfUploaded)}
              >
                <LuView className="text-success" />
              </button>
            </div>
            <div>
              {" "}
              <button className="btn " onClick={() => deletePaper(props.id)}>
                {" "}
                <i class="bi bi-trash text-danger"></i>
              </button>
            </div>
          </div>
        )}

        {!props.pdfUploaded && (
          <>
            <button onClick={() => setShowInput(!showInput)}>Add</button>
            {showInput && (
              <>
                <InputController
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    setPaper(e.target.files[0]);
                  }}
                />
                <Button
                  className="bg-success me-3"
                  msg="submit"
                  // onClick={submitPaper}
                  name={paper}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Card;
