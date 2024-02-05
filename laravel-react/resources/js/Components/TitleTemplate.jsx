import React from 'react'

const TitleTemplate = (props) => {
  return (
    <div className='bg-white rounded-md p-4 me-4 ms-4 mb-4 '>
        <div className='text-2xl xl:text-4xl'>{props.children}</div>
    </div>
  )
}

export default TitleTemplate
