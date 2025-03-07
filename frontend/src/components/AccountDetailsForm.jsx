import { useState } from "react";

export default function AccountDetailsForm({ onNext }) {
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
      return;
    }
    
    setError("");
    onNext({ upiId }); // Pass UPI ID to parent component
  };

  return (
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

      <div className="flex justify-between items-center">
        <button
          type="button"
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}