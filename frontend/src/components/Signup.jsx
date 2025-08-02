import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MailIcon, LockIcon, HeartIcon, UserIcon } from 'lucide-react';

const Signup = () => {
  const [formdata, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formdata.username || !formdata.password || !formdata.firstname || !formdata.lastname) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!formdata.username.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formdata.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    localStorage.setItem('email', formdata.username);
  console.log('Signup URL:', `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`);


    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,
        formdata,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      // Store authentication token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        
        // Store user ID for comment ownership checks
        if (response.data.user && response.data.user._id) {
          localStorage.setItem('userId', response.data.user._id);
          
          // Store other user data if needed
          if (response.data.user.firstname) {
            localStorage.setItem('firstname', response.data.user.firstname);
          }
          if (response.data.user.lastname) {
            localStorage.setItem('lastname', response.data.user.lastname);
          }
        }
      }
  
      toast.success('Signup successful! Welcome to our community!', {
        position: "top-right",
        autoClose: 3000,
      });
  
      // Short delay before redirect to allow user to see the toast
      setTimeout(() => {
        navigate('/funds');
      }, 2000);
      
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.response?.data?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card with subtle shadow and rounded corners */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Decorative header with fundraising theme */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 flex flex-col items-center">
            <div className="bg-white p-3 rounded-full mb-3">
              <HeartIcon size={32} className="text-green-500" />
            </div>
            <h2 className="text-white text-xl font-bold">Start Your Fundraising Journey</h2>
            <p className="text-green-100 text-sm mt-1">Create an account to make a difference</p>
          </div>
          
          <div className="px-8 py-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Join Our Community</h1>
              <p className="text-gray-500 mt-2">Create an account to start fundraising</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* First name field */}
              <div className="mb-4">
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formdata.firstname}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 transition duration-150"
                    placeholder="John"
                  />
                </div>
              </div>
              
              {/* Last name field */}
              <div className="mb-4">
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formdata.lastname}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 transition duration-150"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              {/* Email field */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="username"
                    name="username"
                    value={formdata.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 transition duration-150"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              {/* Password field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formdata.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 transition duration-150"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Password must be at least 6 characters</p>
              </div>
              
              {/* Terms and conditions */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-500">
                      I agree to the <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Sign up button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Join & Start Fundraising"
                )}
              </button>
            </form>
            
            {/* Sign in link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a
                  href="/signin"
                  className="text-green-600 hover:text-green-800 hover:underline font-medium transition duration-150"
                >
                  Sign in
                </a>
              </p>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Join thousands of fundraisers making a difference every day
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;