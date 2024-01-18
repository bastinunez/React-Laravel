import React from 'react'

const TitleTemplate = (props) => {
  return (
    <div className='bg-white rounded-md p-4 mt-3 me-4 ms-4 mb-4 '>
        <h1>{props.children}</h1>
    </div>
  )
}

export default TitleTemplate
