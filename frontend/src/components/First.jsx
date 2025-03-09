import { useState, useEffect } from "react";

export function First({ onSelect, selectedCategory, handleNext }) {
    const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory || "");

    useEffect(() => {
        // Update local state if selectedCategory prop changes
        setLocalSelectedCategory(selectedCategory);
    }, [selectedCategory]);

    const handleSelect = (category) => {
        setLocalSelectedCategory(category); // Update local state
        onSelect(category); // Pass the selected category to parent (Create)
    };

    // Check if continue button should be disabled
    const isContinueDisabled = !localSelectedCategory;

    const categories = [
        { name: "Medical", icon: "🏥" },
        { name: "Education", icon: "🎓" },
        { name: "Animals", icon: "🐾" },
        { name: "Disaster Relief", icon: "🆘" },
        { name: "Environment", icon: "🌱" },
        { name: "Community", icon: "🏘️" },
        { name: "Sports", icon: "🏆" },
        { name: "Technology", icon: "💻" },
        { name: "Arts & Culture", icon: "🎭" },
        { name: "Business", icon: "💼" },
        { name: "Personal", icon: "👤" },
        { name: "Other", icon: "✨" }
    ];

    return (
        <div className="flex flex-col h-full justify-center px-8 relative">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">What best describes your cause?</h2>
                <p className="text-gray-600">Choose a category that will help donors understand your fundraising goal</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:gap-6">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => handleSelect(category.name)}
                        className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-xl transition-all duration-300 ${
                            localSelectedCategory === category.name
                                ? "bg-green-100 border-2 border-green-500 shadow-lg"
                                : "bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50"
                        }`}
                    >
                        <span className="text-3xl mb-2">{category.icon}</span>
                        <span className={`text-lg font-medium ${
                            localSelectedCategory === category.name ? "text-green-700" : "text-gray-700"
                        }`}>
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>
            
            {localSelectedCategory && (
                <div className="mt-8 text-center bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800">
                        <span className="font-semibold">Selected: </span>
                        {localSelectedCategory}
                    </p>
                </div>
            )}
            
            {/* Continue Button */}
            <button
                className="absolute bottom-5 right-5 bg-black text-2xl font-normal text-white px-6 py-2 rounded-lg shadow-md"
                onClick={handleNext}
                disabled={isContinueDisabled}
            >
                Continue
            </button>
        </div>
    );
}