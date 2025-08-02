import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Save, ArrowLeft, Upload } from "lucide-react";
// import { ToastContainer } from "react-toastify";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export function UpdateFundraisers() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        targetAmount: 0,
        name: "",
        email: "",
        type: "",
        category: "",
        upiId: ""
    });
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null); // Store the actual file for upload

    // Updated categories with icons
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

    // Types for dropdown
    const types = ["Yourself", "Charity", "Someone Else"];

    // Fetch fundraiser data on component mount
    useEffect(() => {
        async function fetchFundraiser() {
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch(`${process.env.backend_url}/api/fund/fundraisers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch fundraiser details");
                }

                const data = await response.json();
                setFormData({
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    targetAmount: data.targetAmount,
                    name: data.name,
                    email: data.email,
                    type: data.type,
                    category: data.category,
                    upiId: data.upiId
                });
                
                if (data.imageUrl) {
                    setImagePreview(data.imageUrl);
                }
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchFundraiser();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "targetAmount" ? Number(value) : value
        }));
    };

    // Handle image upload
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Store the file for later upload
        setImageFile(file);

        // Preview the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Trigger file input click
    const handleImageUploadClick = () => {
        fileInputRef.current.click();
    };

    // Upload image to server/Cloudinary
    const uploadImage = async () => {
        if (!imageFile) {
            // If no new image was selected, return the existing URL
            return formData.imageUrl;
        }

        try {
            const token = localStorage.getItem("authToken");
            const formDataObj = new FormData();
            formDataObj.append('image', imageFile);

            const response = await fetch(`${process.env.backend_url}/api/fund/upload-image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formDataObj
            });

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();
            return data.imageUrl; // Return the URL from the server
        } catch (err) {
            throw new Error("Failed to upload image: " + err.message);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // First, upload the image if a new one was selected
            let updatedImageUrl = formData.imageUrl;
            if (imageFile) {
                updatedImageUrl = await uploadImage();
            }

            // Update formData with the new image URL
            const updatedFormData = {
                ...formData,
                imageUrl: updatedImageUrl
            };

            const token = localStorage.getItem("authToken");
            const response = await fetch(`${process.env.backend_url}/api/fund/fundraisers/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedFormData)
            });

            if (!response.ok) {
                toast.error(error.response?.data?.message || 'Updation failed please try again.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update fundraiser");
            }

            setUpdateSuccess(true);
            setLoading(false);
            
            // Reset success message after 3 seconds
            setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
            toast.success('Saved Successfully.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Go back to previous page
    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading && !formData.title) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <>
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <button 
                    onClick={handleGoBack}
                    className="mr-4 text-gray-600 hover:text-green-600"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Update Fundraiser</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex items-center">
                        <AlertCircle className="text-red-500 mr-2" size={20} />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {updateSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <p className="text-green-700">Fundraiser updated successfully!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Fundraiser Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fundraiser Image
                    </label>
                    <div className="mt-1 flex flex-col items-center">
                        {imagePreview ? (
                            <div className="relative w-full mb-4">
                                <img 
                                    src={imagePreview} 
                                    alt="Fundraiser preview" 
                                    className="h-48 w-full object-cover rounded-md"
                                    onError={(e) => {
                                        e.target.src = "/placeholder-image.jpg";
                                        e.target.alt = "Preview not available";
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="h-48 w-full bg-gray-100 flex items-center justify-center rounded-md mb-4">
                                <p className="text-gray-500">No image selected</p>
                            </div>
                        )}
                        
                        <button
                            type="button"
                            onClick={handleImageUploadClick}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <Upload size={16} className="mr-2" />
                            {imagePreview ? "Change Image" : "Upload Image"}
                        </button>
                        
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                            Target Amount
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                            <input
                                type="number"
                                id="targetAmount"
                                name="targetAmount"
                                value={formData.targetAmount}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map(category => (
                                <option key={category.name} value={category.name}>
                                    {category.icon} {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Fundraiser Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="" disabled>Select Type</option>
                            {types.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                            UPI ID
                        </label>
                        <input
                            type="text"
                            id="upiId"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition duration-150 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
        <ToastContainer/>
        </>
    );
}

export default UpdateFundraisers;