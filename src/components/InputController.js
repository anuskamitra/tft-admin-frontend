import React from 'react'

function InputController(props) {
  return (
    <div className="mb-3" >
    <label className='ms-1 form-control-label fw-2'>{props.label} {props.req&&<span style={{color:"red"}}>*</span>}</label>
    <input className='form-control'  {...props} />
    </div>
  )
}

export default InputController