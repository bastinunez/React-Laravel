import { forwardRef, useEffect, useRef,useState } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, onValueChange, ...props }, ref) {
    const input = ref ? ref : useRef();
    const [inputValue, setInputValue] = useState('');


    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);

        // Llama a la función de devolución de llamada proporcionada por el componente padre
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <input 
            {...props}
            type={type}
            className={  'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' + className  }
            ref={input}
        />
    );
});
