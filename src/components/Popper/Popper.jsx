function Popper({ children, overflow = false, search }) {
    return (
        <div
            // max-h-[200px]
            className={`min-w-full  rounded-lg ${
                search ? `max-h-96` : `max-h-[min(calc(100vh-96px-60px),760px)]`
            } bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] `}
            style={{ overflowY: overflow ? 'auto' : '' }}
        >
            {children}
        </div>
    );
}

export default Popper;
