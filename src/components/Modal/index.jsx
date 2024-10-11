import { useCallback, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

function Modal({ isOpen, onClose, title, body, footer, disabled, redirect, href, large = false, remove_left = false }) {
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
        if (href) {
            navigate(href);
        }
        onClose();
    }, [disabled, onClose, href, navigate]);
    if (!isOpen) {
        return null;
    }
    return (
        <>
            <div
                id="modal"
                // overflow-y-auto overflow-x-hidden
                className="justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 bg-opacity-70"
            >
                <div
                    className={`relative ${
                        large ? 'w-full h-full' : 'max-w-lg lg:w-3/6 lg:max-w-lg h-auto lg:h-auto'
                    } my-6 mx-auto bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none`}
                >
                    {/* Content */}
                    <div className="h-full lg:h-auto relative rounded-lg flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between p-10 rounded-t">
                                <h3 className="text-3xl font-semibold">{title}</h3>
                            </div>
                        )}
                        {/* Body */}
                        <div className={`relative px-10 ${!title && 'py-6'} flex-auto`}>{body}</div>
                        {/* Footer */}

                        {footer && <div className="flex flex-col gap-2 p-10">{footer}</div>}
                    </div>
                    {href && !redirect ? (
                        <a
                            className={`p-1 ml-auto border-0 hover:opacity-70 transition absolute  ${
                                remove_left ? 'top-3 left-3' : 'top-3 right-3'
                            }`}
                            onClick={handleClose}
                            href={`${href}`}
                        >
                            <AiOutlineClose size={26} />
                        </a>
                    ) : (
                        <button
                            className={`p-1 ml-auto border-0 hover:opacity-70 transition absolute  ${
                                remove_left ? 'top-3 left-3' : 'top-3 right-3'
                            }`}
                            onClick={handleClose}
                        >
                            <AiOutlineClose size={26} />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Modal;
