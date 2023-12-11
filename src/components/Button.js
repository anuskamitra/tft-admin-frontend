import React from 'react'
import ReactButton from 'react-bootstrap/Button'
function Button(props) {
  return (
   
       <ReactButton {...props}>{props.msg}</ReactButton>
  
  )
}

export default Button