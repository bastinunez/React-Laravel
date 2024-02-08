import { Accordion, AccordionItem } from '@nextui-org/react'
import Icon from '@mdi/react';
import { mdiFilterOutline } from '@mdi/js';
import React from 'react'

const FilterTemplate = (props) => {
  return (
    <div className='bg-white rounded-md  mt-3 me-4 ms-4 mb-4 max-w-[365px] sm:max-w-none' 
    //style={{maxWidth:'365px', '@media (min-width: 600px)': { maxWidth: 'none',  }}} 
    >
      <Accordion>
        <AccordionItem startContent={<Icon path={mdiFilterOutline} size={1} className='text-indigo-900' />} key={1} classNames={{title:""}} title="Filtros">
        {props.children}
        </AccordionItem>
      </Accordion>
        {/* {props.children} */}
    </div>
  )
}

export default FilterTemplate
