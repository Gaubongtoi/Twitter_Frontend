import { useCallback, useState } from 'react';
import Modal from '..';
import useLoginNoti from '../../../hooks/modal/useLoginNoti';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button';

function ModalLoginNoti() {
    const loginModal = useLoginNoti();
    const [isLoading, setIsLoading] = useState(false); // Sửa lại để sử dụng đúng hook useState
    const bodyContent = <div className="flex flex-col gap-4">Your session has expired. Please log in again.</div>;
    const redirectClick = useCallback(() => {
        loginModal.onClose();
        setIsLoading(false);
    }, [loginModal]);
    const footerContent = (
        <div className="flex flex-col gap-4 items-center pt-2">
            <Button href={`/signin`} primary rounded onClick={redirectClick}>
                Signin
            </Button>
            <p>
                Don&apos;t have an account?{' '}
                <a
                    onClick={() => {
                        loginModal.onClose();
                    }}
                    className="font-semibold underline cursor-pointer hover:text-primary"
                    href="/signup"
                >
                    Signup
                </a>
            </p>
        </div>
    );
    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen} // Đảm bảo loginModal.isOpen đúng
            title="Notification"
            onClose={loginModal.onClose}
            onSubmit={redirectClick}
            body={bodyContent}
            footer={footerContent}
            href={'/signin'}
        />
    );
}

export default ModalLoginNoti;
