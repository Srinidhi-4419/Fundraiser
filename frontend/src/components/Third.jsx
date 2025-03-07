import { useState, useEffect } from "react";
import { IndianRupee, Info } from "lucide-react";

export function Third({ onSelect, amount }) {
    const [localAmount, setLocalAmount] = useState(amount || 0);
    const [isValid, setIsValid] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        // Update local state when amount prop changes
        setLocalAmount(amount || 0); // Make sure to set a fallback value if amount is undefined or null
    }, [amount]);

    const handle = (e) => {
        const newAmount = e.target.value;
        // Only allow numbers
        if (/^\d*$/.test(newAmount)) {
            setLocalAmount(newAmount);
            onSelect(newAmount);  // Pass the updated value immediately
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    const formatAmountDisplay = (value) => {
        // Format the amount with commas for better readability (Indian numbering system)
        if (!value) return "";
        const number = parseInt(value);
        return number.toLocaleString('en-IN');
    };

    return (
        <div className="flex flex-col space-y-6 pt-36 max-w-md mx-auto w-full">
            <div className="text-black font-semibold text-2xl">Enter your starting goal in rupees</div>
            
            <div className="space-y-2">
                <div className={`
                    relative bg-white rounded-lg shadow-sm transition-all
                    ${isFocused ? 'ring-2 ring-blue-500 border-transparent' : 'border border-gray-300'}
                    ${!isValid ? 'ring-2 ring-red-500 border-transparent' : ''}
                `}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <IndianRupee className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        value={localAmount || ""} // Ensure a valid value (empty string as fallback)
                        placeholder="0"
                        className="w-full pl-12 pr-4 py-4 rounded-lg text-xl focus:outline-none bg-transparent"
                        onChange={handle}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                </div>
                
                {!isValid && (
                    <p className="text-red-500 text-sm flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Please enter numbers only
                    </p>
                )}
            </div>
            
            <div className="grid gap-3 grid-cols-4">
                {[5000, 10000, 25000, 50000].map(suggestion => (
                    <button
                        key={suggestion}
                        onClick={() => {
                            setLocalAmount(suggestion.toString());
                            onSelect(suggestion.toString());
                            setIsValid(true);
                        }}
                        className={`
                            py-2 rounded-full text-sm font-medium transition-all
                            ${localAmount == suggestion ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                        `}
                    >
                        ₹{suggestion.toLocaleString('en-IN')}
                    </button>
                ))}
            </div>
        </div>
    );
}