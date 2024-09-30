function ButtonExpand({ label, secondary, fullWidth, large, onClick, disabled, outline }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-full font-semibold hover:opacity-80 transition border-2 ${
                fullWidth ? 'w-full' : 'w-fit'
            } ${secondary ? 'bg-black' : 'bg-primary'} ${secondary ? 'text-white' : 'text-white'} ${
                secondary ? 'border-black' : 'border-primary'
            } ${large ? 'px-5' : 'px-4'} ${large ? 'py-3' : 'py-2'}  ${outline ? 'bg-transparent' : ''}  ${
                outline ? 'border-white' : ''
            }  ${outline ? 'text-white' : ''}`}
        >
            {label}
        </button>
    );
}

export default ButtonExpand;
