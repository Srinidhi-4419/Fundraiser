import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Seventh({ formdata, handlePrev }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // Generate image preview for uploaded file
  useEffect(() => {
    if (formdata.image instanceof File) {
      const objectUrl = URL.createObjectURL(formdata.image);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Cleanup to prevent memory leaks
    }
    setPreviewImage(formdata.image);
  }, [formdata.image]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(formdata).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Ensure image is present
      if (!(formdata.image instanceof File)) {
        throw new Error("Please upload a valid image.");
      }
const token=localStorage.getItem('authToken');
      const response = await axios.post(
        "http://localhost:3000/api/fund/fundraisers",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`  // ✅ Added Authorization Header
            },
        }
    );

    toast.success('Fundraiser Created Successfully', {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

      // Navigate after a short delay to ensure toast is visible
      setTimeout(() => {
        navigate("/funds");
      }, 2000);

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to submit fundraiser.");
        toast.error('Failed to create Fundraiser', {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with progress indicator */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 py-4 px-8">
        <div className="flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">Final Review</h2>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center space-x-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-800">Preview Your Fundraiser</h2>
        </div>
        
        <p className="text-gray-600 mb-8">Please review all details below before submitting your fundraiser.</p>

        {/* Main content in two-column layout for larger screens */}
        <div className="lg:flex lg:space-x-8">
          {/* Left column - Image */}
          <div className="lg:w-2/5 mb-6 lg:mb-0">
            {previewImage ? (
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <img
                  src={previewImage}
                  alt="Fundraiser Cover"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Featured Image</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Approved</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-100 border border-dashed border-gray-300 h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">No image uploaded</p>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Details */}
          <div className="lg:w-3/5">
            {/* Fundraiser Details as Cards */}
            <div className="space-y-4">
              {formdata.title && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-sm font-medium uppercase text-gray-500">Title</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{formdata.title}</p>
                </div>
              )}

              {formdata.category && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h3 className="text-sm font-medium uppercase text-gray-500">Category</h3>
                  </div>
                  <p className="text-xl font-medium text-gray-800">{formdata.category}</p>
                </div>
              )}

              {formdata.targetAmount && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-sm font-medium uppercase text-gray-500">Target Amount</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">₹{formdata.targetAmount}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Description in full width */}
        {formdata.description && (
          <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-sm font-medium uppercase text-gray-500">Your Story</h3>
            </div>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {formdata.description}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-red-700 font-medium">Submission Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
          <button
            className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            onClick={handlePrev}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Edit
          </button>
          
          <div className="flex items-center text-sm text-gray-500 mx-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Your data is secure
          </div>
          
          <button
            className={`flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-md transition-all ${
              loading ? "opacity-70 cursor-wait" : "hover:shadow-lg hover:translate-y-0.5"
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                Launch Fundraiser
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
    <ToastContainer />
    </>
  );
}