import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_URL_SERVER, {
    auth: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
});
export default socket;
