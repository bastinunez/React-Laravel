import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    
    theme: {
        extend: {
            ringOpacity: {
                '0': '0', // Establecer la opacidad del anillo a 0
              },
            boxShadow: {
                none: 'none', // Elimina completamente las sombras
              },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [forms,nextui()],
};
