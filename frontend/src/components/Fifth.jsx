import { useState, useEffect } from "react";
import { FileText, Check, AlertCircle } from "lucide-react";

export function Fifth({ selectedDescription, onSelect, handleNext, handlePrev }) {
    const [wordCount, setWordCount] = useState(0);
    const minWords = 50;

    useEffect(() => {
        // Calculate initial word count when component mounts or selectedDescription changes
        if (selectedDescription) {
            const words = selectedDescription.trim().split(/\s+/).filter(word => word.length > 0);
            setWordCount(words.length);
        }
    }, [selectedDescription]);

    const handleChange = (event) => {
        const newValue = event.target.value;
        onSelect(newValue); // Update parent component with the input value
        
        // Calculate word count
        const words = newValue.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
    };

    const getProgressColor = () => {
        if (wordCount >= minWords) return "bg-green-600";
        if (wordCount >= minWords * 0.6) return "bg-yellow-500";
        return "bg-red-500";
    };

    const progressPercentage = Math.min(100, (wordCount / minWords) * 100);
    
    // Check if continue button should be disabled
    const isContinueDisabled = wordCount < minWords;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex flex-col space-y-5 pt-24 max-w-3xl mx-auto w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-semibold text-gray-800">Tell us your story</h2>
                        </div>
                        <div className="flex items-center">
                            {wordCount >= minWords ? (
                                <span className="flex items-center text-green-600 text-sm font-medium">
                                    <Check className="h-4 w-4 mr-1" />
                                    Minimum reached
                                </span>
                            ) : (
                                <span className="flex items-center text-amber-600 text-sm font-medium">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Minimum {minWords} words
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="relative">
                        <textarea
                            value={selectedDescription || ""} // Make sure it's not undefined or null
                            onChange={handleChange}
                            className="w-full h-64 p-5 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto resize-none bg-white"
                            placeholder="Share details about your fundraising campaign. Describe why you're raising funds, how the money will be used, and why it matters. A compelling story increases your chances of reaching your goal."
                        />
                        
                        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                            <div className="text-sm text-gray-500">
                                {wordCount} {wordCount === 1 ? 'word' : 'words'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all ${getProgressColor()}`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                        <p>Tips for a compelling story:</p>
                        <ul className="list-disc ml-5 mt-1 space-y-1">
                            <li>Be authentic and personal</li>
                            <li>Explain clearly how funds will be used</li>
                            <li>Share why this cause matters to you</li>
                            <li>Include specific details and goals</li>
                        </ul>
                    </div>
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
