import React, { useState, useMemo, useCallback } from "react";
import { User, Mail, Bookmark, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export function Six({ onSelect }) {
  // Use useMemo for initial state to prevent re-initialization
  const initialFormData = useMemo(() => ({
    title: "",
    name: "",
    email: "",
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
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
      toast.success("Details saved successfully", {
        duration: 2000,
        position: "top-right"
      });

      // Call parent component's select method
      onSelect(formData);
    } else {
      // Show error toast if validation fails
      toast.error("Please correct the errors in the form");
    }
  }, [validateForm, onSelect, formData]);

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

  return (
    <div className="flex flex-col space-y-6 pt-36 max-w-md mx-auto w-full">
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
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(Six);