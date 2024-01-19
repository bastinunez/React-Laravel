import React,{useState} from 'react'

const Select = ({opciones,onChange}) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        // Llama a la función de devolución de llamada proporcionada desde el componente padre
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div>
        <select onChange={handleSelectChange} value={selectedValue}
            className="border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full">
                {
                    opciones.map((opcion)=>(
                        <option className="w-100 rounded-md" key={opcion.value}>{ opcion.label}</option>
                    ))
                }
        </select>
        </div>
   )
}

export default Select
