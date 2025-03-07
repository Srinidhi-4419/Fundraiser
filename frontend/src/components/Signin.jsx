import React, { useState } from 'react';
import { Heading } from '../pages/Heading';
import { Subheading } from '../pages/Subheading';
import { Inputbox } from '../pages/Inputbox';
import { Button } from '../pages/Button';
import { ButtonWarning } from '../pages/ButtonWarning';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signin = ({setemail}) => {
  const [formdata, setFormData] = useState({
    username: '', // Email
    password: '',
  });
  const [error, setError] = useState(''); // To handle error messages
  const navigate = useNavigate();  // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,  // Update the form data based on user input
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formdata);
    setemail(formdata.username);
    localStorage.setItem('email',formdata.username);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/user/signin',
        formdata,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Response:', response.data);

      // If authentication is successful and token is received
      if (response.data.token) {
        
        localStorage.setItem('authToken', response.data.token);
        
        
        navigate('/funds');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid username or password'); // Display error message
    }
  };

  return (
    <>
      <div className="flex h-screen bg-slate-300 justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign in"} />
            <Subheading label={"Enter your information to sign in to your account"} />

            {/* Error message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Inputbox
              label={"Email"}
              placeholder="harkirat@gmail.com"
              name="username"
              onChange={handleChange}
              value={formdata.username}
            />
            <Inputbox
              label={"Password"}
              placeholder="123456"
              name="password"
              onChange={handleChange}
              value={formdata.password}
            />
            <div className="pt-4">
              <Button label={"Sign in"} onClick={handleSubmit} />
            </div>
            <ButtonWarning label={"Don't have an account?"} Buttontext={"Sign Up"} to={"/signup"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
