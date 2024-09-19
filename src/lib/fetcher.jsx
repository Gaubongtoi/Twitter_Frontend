import http from '../utils/http';
import useLoginState from '../hooks/state/useLoginState'; // Hook for handling login state
import toast from 'react-hot-toast';
import useLoginNoti from '../hooks/modal/useLoginNoti';

const fetcher = async (url) => {
    try {
        const response = await http.get(url);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }
        const error = new Error('An error occurred while fetching the data.');
        error.info = response.data;
        error.status = response.status;
        throw error;
    } catch (error) {
        if (error.response) {
            error.info = error.response.data;
            error.status = error.response.status;
            if (error.status === 401) {
                // Handle 401 Unauthorized error
                const { logout } = useLoginState.getState();
                const loginState = useLoginNoti.getState();
                if (error.response.data?.message === 'Jwt expired') {
                    // If refresh token has expired
                    toast.error('Session expired. Please log in again.');
                    loginState.onOpen();
                    logout(); // Call the logout function to clear session
                } else {
                    // Any other 401-related error
                    toast.error('Unauthorized access. Please log in again.');
                    loginState.onOpen();
                    logout(); // Call the logout function to clear session
                }
            }
        } else if (!error.status) {
            // If no status is set (network errors)
            error.status = 500;
            error.info = { message: 'An unexpected error occurred.' };
        }

        throw error; // Re-throw the error so SWR can handle it
    }
};

export default fetcher;
