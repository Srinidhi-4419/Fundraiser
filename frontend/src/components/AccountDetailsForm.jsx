import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AccountDetailsForm({ handleNext, handlePrev }) {
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const validateUPI = (id) => {
    // Simple UPI validation - checks for username@provider format
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/;
    return upiRegex.test(id);
  };

  const handleSubmit = () => {
    if (!upiId.trim()) {
      setError("Please enter your UPI ID");
      return;
    }
    
    if (!validateUPI(upiId)) {
      setError("Please enter a valid UPI ID (e.g., username@ybl)");
      toast.error('Please enter a valid upi id', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    toast.success('Saved Successfully', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    setError("");
    // Pass UPI ID to parent component and navigate to next page
    handleNext({ upiId });
  };

  // Check if continue button should be disabled
  const isContinueDisabled = !upiId.trim() || !validateUPI(upiId);

  return (
    <>
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold ml-4 text-gray-800">Payment Details</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            We'll use this UPI ID to transfer funds raised through your campaign.
          </p>

          <div className="mb-6">
            <label htmlFor="upiId" className="block text-gray-700 font-medium mb-2">
              UPI ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="upiId"
                name="upiId"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                placeholder="username@ybl"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <p className="mt-2 text-sm text-gray-500">
              Format: username@provider (e.g., johndoe@okicici)
            </p>
          </div>

          <div className="flex items-center bg-blue-50 p-4 rounded-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">
              Make sure your UPI ID is active and linked to your bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Styled similar to Fifth component */}
      <div className="flex justify-between items-center mt-auto py-6 max-w-md mx-auto w-full">
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
          onClick={handleSubmit}
          disabled={isContinueDisabled}
        >
          Continue
        </button>
      </div>
    </div>
    <ToastContainer />
    </>
  );
}