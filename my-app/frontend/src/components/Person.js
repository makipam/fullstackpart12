import React from 'react'

const Person = (props) => {
    return (
      <div>
        {props.name} {props.number} <button value={props.id} name={props.name} onClick={props.onClick}>Delete</button>
      </div>
    )
  }

export default Person