import { useState, useEffect } from 'react';

// custom Hook: Nói đơn giản custom hook là cách sử dụng những hook có sẵn của React library để tạo ra 1 hook mới để đáp ứng nhu cầu của dev
// useDebounce: Khi chúng ta thay đổi dữ liệu liên tục (onChange) => setValue liên tục => Liên tục gửi request => không nên
// thì với việc sử dụng setTimeout để delay khi người dùng nhập vào sau 1 khoảng thời gian => mới bắt đầu gửi 1 request
function useDebounce(value, delay) {
    //
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounceValue(value), delay);
        return () => clearTimeout(handler);
    }, [value]);
    return debounceValue;
}

export default useDebounce;
