export function Type({ icon, label1, label2, onClick, selected }) {
    return (
        <div
            onClick={onClick}
            className={`
                flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selected 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
            `}
        >
            <div className={`
                flex items-center justify-center h-10 w-10 rounded-full mr-4
                ${selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}
            `}>
                {icon}
            </div>
            
            <div className="flex-1">
                <div className="font-medium text-lg text-gray-800">{label1}</div>
                <div className="text-sm text-gray-600 mt-1">{label2}</div>
            </div>
            
            <div className={`
                h-5 w-5 rounded-full border-2 flex items-center justify-center
                ${selected 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300'
                }
            `}>
                {selected && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
            </div>
        </div>
    );
}