import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
// import Modal from './components/Modal/index.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Toaster position="top-right" reverseOrder={true} />

        {/* <Modal actionLabel="Submit" isOpen title="Test modal"></Modal> */}
        <App />
    </StrictMode>,
);
