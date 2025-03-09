import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, HeartIcon } from 'lucide-react';

const Signin = ({ setemail }) => {
  const [formdata, setFormData] = useState({
    username: '',
    password: '',
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
    if (!formdata.username || !formdata.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    console.log('Form Data:', formdata);
    setemail(formdata.username);
    localStorage.setItem('email', formdata.username);
    
    try {
      const response = await axios.post(
        'http://localhost:3000/api/user/signin',
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
          
          // Optionally store other user data if needed
          if (response.data.user.firstname) {
            localStorage.setItem('firstname', response.data.user.firstname);
          }
          if (response.data.user.lastname) {
            localStorage.setItem('lastname', response.data.user.lastname);
          }
        }
      }
  
      toast.success('Sign in successful!', {
        position: "top-right",
        autoClose: 3000,
      });
  
      // Short delay before redirect to allow user to see the toast
      setTimeout(() => {
        navigate('/funds');
      }, 2000);
      
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Invalid username or password');
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
            <h2 className="text-white text-xl font-bold">Make A Difference</h2>
            <p className="text-green-100 text-sm mt-1">Join our fundraising community</p>
          </div>
          
          <div className="px-8 py-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-500 mt-2">Sign in to continue your fundraising journey</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email field */}
              <div className="mb-5">
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
              <div className="mb-5">
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
                      <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Forgot password link */}
              <div className="mb-6">
                <div className="flex justify-end">
                  <a
                    href="#"
                    className="text-sm text-green-600 hover:text-green-800 hover:underline transition duration-150"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              
              {/* Sign in button */}
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
                  "Sign In & Make Impact"
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            {/* Sign up link */}
            <div className="text-center">
              <p className="text-gray-600">
                New to our fundraising platform?{' '}
                <a
                  href="/signup"
                  className="text-green-600 hover:text-green-800 hover:underline font-medium transition duration-150"
                >
                  Join the community
                </a>
              </p>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Your support changes lives. 100% secure payment.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signin;