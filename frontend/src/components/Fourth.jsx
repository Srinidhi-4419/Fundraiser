import { useState, useEffect } from "react";
import { Upload, Image, X } from "lucide-react";

export function Fourth({ onSelect, image }) {
    const [localImage, setLocalImage] = useState(image || null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        // Update local image when the image prop changes
        setLocalImage(image);
    }, [image]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];

        if (file && file.type.startsWith("image/")) {
            handleImage(file);
        } else {
            alert("Please drop a valid image file.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            handleImage(file);
        } else {
            alert("Please select a valid image file.");
        }
    };

    const handleImage = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalImage(reader.result);
            onSelect(file); // Pass the file (not the Data URL) to parent component
        };
        reader.readAsDataURL(file); // Generate Data URL for preview
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setLocalImage(null);
        onSelect(null);
    };

    return (
        <div className="flex flex-col items-center space-y-6 pt-36 max-w-md mx-auto w-full">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">Upload Your Image</h2>
                <p className="text-gray-600">Add a cover image for your fundraising campaign</p>
            </div>

            <div
                className={`
                    w-full aspect-video relative rounded-lg overflow-hidden transition-all
                    ${isDragging ? 'ring-4 ring-blue-400' : ''}
                    ${localImage ? 'shadow-md' : 'border-4 border-dashed border-gray-300 bg-gray-50'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {localImage ? (
                    <>
                        <img 
                            src={localImage} 
                            alt="Uploaded Preview" 
                            className="w-full h-full object-cover" 
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            <Upload className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-700 font-medium mb-1">Drag & drop your image here</p>
                            <p className="text-gray-500 text-sm mb-4">or click to browse files</p>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all">
                                Select Image
                            </button>
                        </div>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                />
            </div>

            <div className="text-sm text-gray-500 text-center w-full">
                Recommended: Use a high-quality image with 16:9 aspect ratio
            </div>
        </div>
    );
}