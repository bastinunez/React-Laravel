import React from 'react'

const ContentTemplate = (props) => {
  return (
    <div className='bg-white rounded-md p-4 mt-3 me-4 ms-4 mb-4 '>
        {props.children}    
    </div>
  )
}

export default ContentTemplate
