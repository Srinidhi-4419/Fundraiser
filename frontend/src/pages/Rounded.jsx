export function Rounded({ label, onClick, selected }) {
    return (
        <div
            className={`rounded-lg text-black font-semibold border border-black px-4 py-2 cursor-pointer 
            hover:bg-green-100 transition duration-200 
            ${selected ? "bg-green-100 text-black" : "bg-white"}`} 
            onClick={onClick}
        >
            {label}
        </div>
    );
}
