import React from 'react'

const FilterTemplate = (props) => {
  return (
    <div className='bg-white rounded-md p-4 mt-3 me-4 ms-4 mb-4 ' style={{maxWidth:'365px',
    '@media (min-width: 600px)': {
        maxWidth: 'none', // Si es mayor que sm, quitar el maxWidth o ajustarlo según sea necesario
      }}} >
        {props.children}
    </div>
  )
}

export default FilterTemplate
