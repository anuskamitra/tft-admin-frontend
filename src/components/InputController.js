import React from 'react'

function InputController(props) {
  return (
    <div >
    <label className='ms-1 form-control-label fw-2'>{props.label} {props.req&&<span style={{color:"red"}}>*</span>}</label>
    <input className={`form-control ${props.error && "border border-danger"}  `} {...props} />
     <p className='text-danger ms-1'>{props.error}</p>
    </div>
  )
}

export default InputController