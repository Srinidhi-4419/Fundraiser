import { useState, useEffect } from "react";
import { Type } from "../pages/Type";

export function Second({ onSelect, selectedType }) {
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

    return (
        <div className="flex flex-col space-y-4 pt-24">
            <div className="text-black font-normal text-md">Who are you fundraising for?</div>
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
    );
}
