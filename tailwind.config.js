/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/tailwind-datepicker-react/dist/**/*.js'],
    theme: {
        extend: {
            colors: {
                primary: '#1DA1F2',
                primary_darken: '#1A8CCF',
                background: '#f5f5f5',
                dark_1: '#17202A',
                dark_2: '#1C2733',
                dark_3: '#283340',
                dark_4: '#3A444C',
                dark_5: '#5B7083',
                dark_6: '#8899A6',
                dark_7: '#EBEEF0',
                dark_8: '#F7F9FA',
            },
        },
    },
    plugins: [],
};
