import { useCallback, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

function Modal({ isOpen, onClose, onSubmit, title, body, footer, actionLabel, disabled, redirect, href = '/' }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (isOpen) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'style' && mutation.target.style.display === 'none') {
                        // Nếu modal bị tắt bằng cách thay đổi CSS, bật lại modal
                        mutation.target.style.display = 'flex';
                    }
                });
            });

            const modalElement = document.querySelector('#modal');
            if (modalElement) {
                observer.observe(modalElement, { attributes: true });
            }

            return () => {
                if (modalElement) {
                    observer.disconnect();
                }
            };
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if (disabled) return;
        if (!redirect) {
            navigate(href);
        }
        onClose();
    }, [disabled, onClose]);

    const handleSubmit = useCallback(() => {
        if (disabled) {
            return;
        }
        if (href && redirect) {
            navigate(`${href}`);
        }
        onSubmit();
    }, [disabled, onSubmit]);
    if (!isOpen) {
        return null;
    }
    return (
        <>
            <div
                id="modal"
                className="justify-center items-center flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 bg-opacity-70"
            >
                <div className={`relative max-w-lg  lg:w-3/6 my-6 mx-auto lg:max-w-lg h-auto lg:h-auto`}>
                    {/* Content */}
                    <div className="h-full lg:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/* Header */}
                        <div className="flex items-center justify-between p-10 rounded-t">
                            <h3 className="text-3xl font-semibold">{title}</h3>
                            {href && !redirect ? (
                                <a
                                    className="p-1 ml-auto border-0 hover:opacity-70 transition"
                                    onClick={handleClose}
                                    href={`${href}`}
                                >
                                    <AiOutlineClose size={26} />
                                </a>
                            ) : (
                                <button
                                    className="p-1 ml-auto border-0 hover:opacity-70 transition"
                                    onClick={handleClose}
                                >
                                    <AiOutlineClose size={26} />
                                </button>
                            )}
                        </div>
                        {/* Body */}
                        <div className="relative p-10 flex-auto">{body}</div>
                        {/* Footer */}
                        <div className="flex flex-col gap-2 p-10">
                            {href && !redirect ? (
                                <Button href={`/signin`} primary rounded onClick={handleSubmit}>
                                    {actionLabel}
                                </Button>
                            ) : (
                                <Button primary rounded onClick={handleSubmit}>
                                    {actionLabel}
                                </Button>
                            )}
                            {footer}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;
