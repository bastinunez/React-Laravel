import React from 'react'

const TitleTemplate = (props) => {
  return (
    <div className='bg-white rounded-md p-4 me-4 ms-4 mb-4 '>
        <h1 className='text-4xl'>{props.children}</h1>
    </div>
  )
}

export default TitleTemplate
