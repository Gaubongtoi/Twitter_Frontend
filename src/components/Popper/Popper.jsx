function Popper({ children, overflow = false }) {
    return (
        <div
            // max-h-[200px]
            className="min-w-full max-h-[min(calc(100vh-96px-60px),760px)] rounded-lg bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] "
            style={{ overflowY: overflow ? 'scroll' : '' }}
        >
            {children}
        </div>
    );
}

export default Popper;
