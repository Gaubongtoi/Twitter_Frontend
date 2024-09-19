function Input({ disabled, placeholder, value, type, onChange }) {
    return (
        <input
            disabled={disabled}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            type={type}
            className="w-full p-4 text-lg bg-white border-2 border-neutral-800 rounded-md outline-none focus:border-primary forcus:border-2 transition disabled:bg-dark_7 disabled:opacity-70 disabled:cursor-not-allowed"
        />
    );
}

export default Input;
