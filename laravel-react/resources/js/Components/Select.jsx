import React,{useState} from 'react'

const Select = ({opciones,onChange}) => {
    const [selectedValue, setSelectedValue] = useState('');
    //  console.log(opciones)

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
        <select onChange={handleSelectChange}  defaultValue={'DEFAULT'}
            className="border-gray-300 bg-white text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full">
                <option className="text-gray-500" value={"DEFAULT"} disabled>Selecciona una opcion</option>
                {
                    opciones.map((opcion)=>(
                        <option className="w-100 rounded-md" key={opcion.id?opcion.id:opcion.value} value={opcion.id?opcion.id:opcion.value}>{opcion.nombre?opcion.nombre:opcion.nombres?opcion.nombres:""} {opcion.apellidos?opcion.apellidos:""}</option>
                    ))
                }
        </select>
        </div>
   )
}

export default Select
