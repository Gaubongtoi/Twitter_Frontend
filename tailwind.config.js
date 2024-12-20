/** @type {import('tailwindcss').Config} */
// import flowbite from 'flowbite/plugin';
import plugin from 'tailwindcss/plugin';
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/tailwind-datepicker-react/dist/**/*.js'],
    theme: {
        extend: {
            colors: {
                primary: '#1DA1F2',
                primary_lighten: '#4CA2FF',
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
            boxShadow: {
                custom: '0px 7px 29px 0px rgba(100, 100, 111, 0.2)', // Giá trị shadow tùy chỉnh
            },
        },
    },
    variants: {
        extend: {
            display: ['group-hover'],
        },
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.scrollbar-hide': {
                    /* IE and Edge */
                    '-ms-overflow-style': 'none',

                    /* Firefox */
                    'scrollbar-width': 'none',

                    /* Safari and Chrome */
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
            });
        }),
    ],
};
