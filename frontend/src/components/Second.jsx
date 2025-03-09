import { useState, useEffect } from "react";
import { Type } from "../pages/Type";

export function Second({ onSelect, selectedType, handleNext, handlePrev }) {
    // Initialize local state with the prop value
    const [localSelectedType, setLocalSelectedType] = useState(selectedType || "");

    useEffect(() => {
        // Update local state when selectedType prop changes
        setLocalSelectedType(selectedType);
    }, [selectedType]);

    const handleSelect = (type) => {
        setLocalSelectedType(type); // Update local state
        onSelect(type); // Pass the selected type to parent (Create)
    };

    // Check if continue button should be disabled
    const isContinueDisabled = !localSelectedType;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                <div className="text-black font-normal text-md pt-24 mb-4">Who are you fundraising for?</div>
                <div className="space-y-4">
                    <Type 
                        label1={"Yourself"} 
                        label2={"Funds are delivered to your bank account"}
                        onClick={() => handleSelect("Yourself")} 
                        selected={localSelectedType === "Yourself"} // Highlight selected type
                    />
                    <Type 
                        label1={"Someone Else"} 
                        label2={"You will receive funds and distribute to some beneficiary."}
                        onClick={() => handleSelect("Someone Else")} 
                        selected={localSelectedType === "Someone Else"} // Highlight selected type
                    />
                    <Type 
                        label1={"Charity"} 
                        label2={"Funds are delivered to your non-profit organization"}
                        onClick={() => handleSelect("Charity")} 
                        selected={localSelectedType === "Charity"} // Highlight selected type
                    />
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-auto py-6">
                <button
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                    onClick={handlePrev}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                </button>
                <button
                    className={`px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-all duration-200 ${
                        isContinueDisabled 
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                            : "bg-black text-white hover:bg-gray-800"
                    }`}
                    onClick={handleNext}
                    disabled={isContinueDisabled}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}