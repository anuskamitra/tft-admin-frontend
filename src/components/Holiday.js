import React, { useEffect, useState } from "react";
import Styles from "./Students.module.css"
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/esm/Table";
import InputController from "./InputController";

function Holiday() {
  const userState = useSelector((state) => {
    return state.user;
  });
  const typeOfUser = userState.type;
  const loggedIn = userState.loggedIn;
  const [holidayList, setHolidayList] = useState([]);
  const[error,setError]=useState({});
  const [holidayDetails, setHolidayDetails] = useState({
    collegeId: "",
    StartDate: "",
    EndDate: "",
    StartDay: "",
    EndDay: "",
    Reason: "",
  });
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getCollege = async () => {
    let collegeId="";
    try {
      if (typeOfUser.type === "Student") {
        const id = typeOfUser.id;
        const response = await axios.post(
          process.env.REACT_APP_BACKEND_URL+"/api/fetchOneStudent",
          { id }
        );
        console.log(response.data.College._id);
           collegeId = response.data.College._id;
      } else  {
         collegeId = typeOfUser.type === "College"?(typeOfUser.id): (loggedIn.collegeId);
        }
        console.log(collegeId);
        axios
          .post(process.env.REACT_APP_BACKEND_URL+"/college/fetchonecollege", { collegeId })
          .then((response) => {
            console.log("called");
            console.log(response.data);
             setHolidayList(response.data.Holidays);
          });
      }
     catch (err) {
      console.log(err);
    }
  };

  const handleHoliday = async (e) => {
    e.preventDefault();
    setError({});
    let validationError=false;
    if(holidayDetails.StartDate===""){
      setError((prev) => ({ ...prev, startDate: "FirstDate is required!" }));
      validationError=true;
    }
    if(holidayDetails.EndDate===""){
      setError((prev) => ({ ...prev, endDate: "FirstDate is required!" }));
      validationError=true;
    }
    if(holidayDetails.Reason===""){
      setError((prev) => ({ ...prev, reason: "FirstDate is required!" }));
      validationError=true;
    }
    if(!validationError){
    const selectedFirstDate = new Date(holidayDetails.StartDate);
    const selectedLastDate = new Date(holidayDetails.EndDate);
    console.log(selectedFirstDate);
    const firstWeekDayIndex = selectedFirstDate.getDay();

    const lastWeekDayIndex = selectedLastDate.getDay();
    const firstWeekDay = weekdays[firstWeekDayIndex];
    console.log(firstWeekDay);
    const LastWeekDay = weekdays[lastWeekDayIndex];
    console.log(LastWeekDay);
    setHolidayDetails({
      ...holidayDetails,
      FirstDay: firstWeekDay,
      collegeId: typeOfUser.id,
    });
    const details = {
      collegeId: typeOfUser.id,
      StartDate: holidayDetails.StartDate,
      EndDate: holidayDetails.EndDate,
      StartDay: firstWeekDay,
      EndDay: LastWeekDay,
      Reason: holidayDetails.Reason,
    };
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL+"/college/addHoliday",
      details
    );
    console.log(response);
    setHolidayDetails( {collegeId: "",
    StartDate: "",
    EndDate: "",
    StartDay: "",
    EndDay: "",
    Reason: ""});

    getCollege();
  };
}

  useEffect(() => {
    getCollege();
    console.log("Hello");
  }, []);
  useEffect(()=>{
 console.log(holidayList)

  },[holidayList])
  return (
    <div >
     
      {typeOfUser.type == "College" && (
        <>
         <h3 className="text-center">Add Holiday</h3>
        <div className=" w-75 m-auto align-center justify-content-between mt-5">
          <InputController
          label="Start Date"
          error={error.startDate}
          req={true}
            type="date"
            value={holidayDetails.StartDate}
            onChange={(event) => {
              setHolidayDetails({
                ...holidayDetails,
                StartDate: event.target.value,
              });
            }}
          />
          <InputController
          label="End Date"
          req={true}
          value={holidayDetails.EndDate}
          error={error.endDate}
            type="date"
            onChange={(event) => {
              setHolidayDetails({
                ...holidayDetails,
                EndDate: event.target.value,
              });
            }}
          />
          <div>
          <InputController
          error={error.reason}
          value={holidayDetails.Reason}
          label="Reason of the holiday"
          placeholder="Eg: New Year"
          req={true}
            type="text"
            onChange={(event) => {
              setHolidayDetails({
                ...holidayDetails,
                Reason: event.target.value,
              });
            }}
          />
          </div >
          <div className="text-center">
          <button type="submit" onClick={handleHoliday}>
            submit
          </button>
          </div>
          <hr />{" "}
        </div>
        </>
      )}
        <h3 className="text-center" style={{position: "sticky"}}>List of Holidays <span className="text-danger">2024</span></h3>
    <div className="d-flex w-75 flex-row m-auto align-center justify-content-between mt-5">
      <Table bordered  >
        {holidayList?.map((holiday) => {
          return (
            // <div key={holiday.StartDate}>
            
                <tbody > 
              {holiday.StartDate == holiday.EndDate ? 
               <tr>
                <td className="fw-bold" style={{color:"#190000" }}>{holiday.StartDate}</td> 
                <td className="fw-bold" style={{color:"#800000"}}>{holiday.StartDay}</td>
                <td className="fw-bold" style={{color:"#990000"}}>{holiday.Reason}</td>
                </tr>
                  : 
                  
                <tr>
                  <td  className="fw-bold" style={{color:"#190000"}}>{holiday.StartDate} to {holiday.EndDate}</td> 
                  <td className="fw-bold" style={{color:"#800000"}}>{holiday.StartDay} to{" "}{holiday.EndDay}</td> 
                  <td className="fw-bold" style={{color:"#990000"}}>{holiday.Reason} </td>
                </tr>
              }
             
              </tbody>
              
            // </div>
          );
        })}
         </Table>
      </div>
    </div>
  );
}

export default Holiday;
