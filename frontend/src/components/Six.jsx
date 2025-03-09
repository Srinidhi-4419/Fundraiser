import React, { useState, useMemo, useCallback } from "react";
import { User, Mail, Bookmark, ChevronRight } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Six({ onSelect, handleNext, handlePrev }) {
  // Use useMemo for initial state to prevent re-initialization
  const initialFormData = useMemo(() => ({
    title: "",
    name: "",
    email: "",
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDataSaved, setIsDataSaved] = useState(false);

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Reset saved state when form changes
    setIsDataSaved(false);
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Memoized blur handler
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  // Memoized validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Fundraiser title is required";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "Your name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    setTouched({
      title: true,
      name: true,
      email: true
    });
    
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Memoized submit handler
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      // Show success toast
      toast.success('Saved successfully! Click Continue to proceed.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Call parent component's select method
      onSelect(formData);
      setIsDataSaved(true);
    } else {
      // Show error toast if validation fails
      toast.error("Please correct the errors in the form");
    }
  }, [validateForm, onSelect, formData]);

  // Handle continue click with validation
  const handleContinueClick = useCallback(() => {
    if (!isDataSaved) {
      // If not saved, try to save first
      if (validateForm()) {
        onSelect(formData);
        handleNext();
      } else {
        toast.error("Please save your information before continuing");
      }
    } else {
      // If already saved, proceed
      handleNext();
    }
  }, [validateForm, onSelect, formData, handleNext, isDataSaved]);

  // Render input field with consistent styling and error handling
  const renderInputField = useCallback((name, label, type, icon) => {
    const Icon = icon;
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={`Enter your ${label.toLowerCase()}`}
            className={`pl-10 pr-4 py-3 w-full rounded-lg border ${
              touched[name] && errors[name] 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:ring-blue-500"
            } focus:border-transparent focus:outline-none focus:ring-2`}
          />
        </div>
        {touched[name] && errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    );
  }, [formData, touched, errors, handleChange, handleBlur]);

  // Check if continue button should be disabled
  const isContinueDisabled = !isDataSaved || Object.keys(errors).length > 0;

  return (
    <>
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex flex-col space-y-6 pt-24 max-w-md mx-auto w-full">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Fundraiser Details</h2>
            <p className="text-gray-600">Complete your fundraiser information</p>
          </div>

          <div className="space-y-4">
            {renderInputField('title', 'Fundraiser Title', 'text', Bookmark)}
            {renderInputField('name', 'Your Name', 'text', User)}
            {renderInputField('email', 'Email Address', 'email', Mail)}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center font-medium"
          >
            Save
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
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
          onClick={handleContinueClick}
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

// Memoize the component to prevent unnecessary re-renders
export default React.memo(Six);