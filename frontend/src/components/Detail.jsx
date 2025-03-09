import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
// import { Heart, Share2, Clock, Users, ArrowLeft, AlertCircle, X } from "lucide-react";
import { Heart, Share2, Clock, Users, ArrowLeft, AlertCircle, X, Send, MessageSquare, Trophy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios';
const Detail = ({email}) => {
    const { id } = useParams();
    console.log(email);
    console.log(id);
    const navigate = useNavigate();
    const [fundraiser, setFundraiser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donationAmount, setDonationAmount] = useState(500);
    const [activeTab, setActiveTab] = useState('story');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [processingPayment, setProcessingPayment] = useState(false);
const [donors,setcount]=useState(0);
    // Predefined donation amounts
    const donationOptions = [100, 500, 1000, 5000];
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [donateAnonymously, setDonateAnonymously] = useState(false);
    const [commentText, setCommentText] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const currentUserId = localStorage.getItem("userId") ;
const [updates, setUpdates] = useState([]);
const formatDate = (dateString) => {
    // Check if date is valid
    if (!dateString) return "No date";
    
    // Try parsing the date
    const date = new Date(dateString);
    
    // Check if date is valid after parsing
    if (isNaN(date.getTime())) {
      // Fallback for date that couldn't be parsed
      return "Date unavailable";
    }
    
    // Format the date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
    useEffect(() => {
        const fetchFundraiserDetails = async () => {
            setLoading(true);
            try {
                // First fetch the fundraiser details
                const response = await fetch(`http://localhost:3000/api/fund/fundraisers/${id}`);
                if (!response.ok) {
                    setFundraiser(null);
                    setLoading(false);
                    return;
                }
                
                const data = await response.json();
                setFundraiser(data);
                
                // Then fetch the donors for this fundraiser
                try {
                    const donorsResponse = await fetch(`http://localhost:3000/api/fundraiser/${id}/donors`);
                    if (donorsResponse.ok) {
                        const donorsData = await donorsResponse.json();
                        
                        // Update the fundraiser state with donors information
                        setFundraiser(prevState => ({
                            ...prevState,
                            donors: donorsData.donors || [],
                            donorsCount: donorsData.donorsCount || 0
                        }));
                    }
                } catch (donorsError) {
                    console.error("Error fetching donors:", donorsError);
                    // We don't set fundraiser to null here as we already have the main data
                }
                try {
                    const donorsCountResponse = await fetch(`http://localhost:3000/api/fund/fundraisers/${id}/donors/count`);
                    if (donorsCountResponse.ok) {
                        const countData = await donorsCountResponse.json();
                        if (countData.success) {
                            // Update the donor count state
                            setcount(countData.donorsCount);
                        }
                    }
                } catch (countError) {
                    console.error("Error fetching donors count:", countError);
                }
            } catch (error) {
                console.error("Error fetching fundraiser details:", error);
                setFundraiser(null);
            } finally {
                setLoading(false);
            }
        };
    
        fetchFundraiserDetails();
    }, [id]);
    useEffect(() => {
        const fetchUpdates = async () => {
          if (activeTab === 'updates') {
            try {
              console.log('Fetching updates...');
              const response = await axios.get(`http://localhost:3000/api/fund/${id}/updates`);
              console.log('Raw response:', response.data);
              
              // Debug the response
              if (response.data.updates) {
                console.log('Updates found:', response.data.updates.length);
                console.log('First update:', response.data.updates[0]);
                setUpdates(response.data.updates);
              } else {
                console.log('No updates found in response');
                setUpdates([]);
              }
            } catch (error) {
              console.error('Error fetching updates:', error);
            }
          }
        };
      
        fetchUpdates();
      }, [id, activeTab]);
    // Format currency with commas
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { 
            maximumFractionDigits: 0 
        }).format(amount);
    };

    // Generate UPI payment string for Google Pay
    const generateUpiPaymentString = useCallback((upiId, amount, name, description) => {
        // Fixed format for Google Pay UPI deep links
        // Make sure the amount is a number with exactly 2 decimal places
        const formattedAmount = parseFloat(amount).toFixed(2);
        
        // Proper URL encoding for all parameters
        const encodedUpiId = encodeURIComponent(upiId);
        const encodedName = encodeURIComponent(name);
        const encodedDescription = encodeURIComponent(description || 'fundraiser');
        
        // Use the correct UPI intent format
        return `upi://pay?pa=${encodedUpiId}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedDescription}`;
    }, []);

    const handleDonateClick = () => {
        if (donationAmount <= 0) {
            alert("Please enter a valid donation amount");
            return;
        }
        setShowPaymentModal(true);
    };
    
    // New function to handle payment completion
   // Updated handlePaymentComplete function
   const handlePaymentComplete = async () => {
    setProcessingPayment(true);
    try {
        const token = localStorage.getItem("authToken");

        // We should only update the amount in ONE place
        // Let's keep the /update-amount endpoint as the single source of truth
        const paymentResponse = await fetch(`http://localhost:3000/api/fund/fundraisers/${id}/update-amount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: donationAmount })
        });

        if (!paymentResponse.ok) {
            toast.error("There was a problem processing your payment. Please try again.");
            setProcessingPayment(false);
            return;
        }

        // Update the local fundraiser data after successful payment
        const updatedFundraiser = await paymentResponse.json();
        setFundraiser(updatedFundraiser);

        // Step 2: Get username from localStorage and update donors list
        // This endpoint should NOT update the amount again
        const username = localStorage.getItem('email');
        
        if (username) {
            const donorResponse = await fetch(`http://localhost:3000/api/user/fundraiser/add-donor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    username: donateAnonymously ? "Anonymous" : username, 
                    fundraiserId: id 
                })
            });

            if (!donorResponse.ok) {
                console.error("Warning: Donation was processed but donor name could not be added");
            }
        }

        // Step 3: Record the donation for tracking purposes
        // This endpoint should also NOT update the fundraiser amount
        const donationResponse = await fetch(`http://localhost:3000/api/user/donate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                fundraiserId: id,
                amount: donationAmount 
            })
        });

        if (!donationResponse.ok) {
            console.error("Warning: Donation record could not be saved.");
        }

        toast.success(`Thank you! Your donation of ₹${formatCurrency(donationAmount)} was successful.`, {
            duration: 5000,
            position: 'top-center',
            icon: '🎉',
        });

        setShowPaymentModal(false);
        
        setTimeout(() => {
            navigate('/funds');
        }, 2000);

    } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("There was a problem connecting to the server. Please try again later.");
    } finally {
        setProcessingPayment(false);
    }
};
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading fundraiser details...</p>
                </div>
            </div>
        );
    }

    if (!fundraiser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-lg">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Fundraiser Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the fundraiser you're looking for.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    const raised = fundraiser.targetAmount - fundraiser.remainingAmount;
    const progress = (raised / fundraiser.targetAmount) * 100;
    const circumference = 2 * Math.PI * 28; // 28 is the radius of the circle
    
    // Assuming UPI ID is stored in fundraiser.upiId, if not, provide a default
    const upiId = fundraiser.upiId || "example@upi";
    
    // Generate UPI payment string for the current donation
    const upiPaymentString = generateUpiPaymentString(
        upiId, 
        donationAmount, 
        fundraiser.name, 
        fundraiser.title
    );

    // Google Pay logo SVG code
    const googlePayLogo = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
      <path d="M156.5 63.1l-4.3 9.6C95.1 178.9 73.2 222.5 73.2 278c0 55.1 22.1 99.3 79.4 205l4.1 9.6 152.3-.2 152.3-.3 7.3-7.7c22.8-24.3 40.3-59.6 46.7-94.5 2.6-14.3 2.6-53.5-.1-69-6.5-38-25.5-71.1-54.1-94.5-3.7-3-6.9-5.7-7.1-5.9-.3-.2 7.1-17.4 16.3-38.2 9.2-20.7 16.8-38.5 16.9-39.5.1-.9.7-2.2 1.3-2.7 1.5-1.2-6.9-1.3-165.5-1.3l-167 .1zm306.5 107.3c1 2.2 1 2.2-61.6 140.9l-62.6 138.7-96.4-.2c-53-.1-96.4-.2-96.4-.2 0-.1 44.3-98.9 98.4-219.7l98.4-219.5 59.6.1 59.6.1 1 2.2z" fill="#5f6368"/>
      <path d="M233.1 96.7c-41 91.5-52.9 118.4-52.9 119.7 0 .8 10.4 24.5 23 52.6l23 51.1 29.9-66.8c16.4-36.7 30-67.1 30.1-67.5.2-.5-10.1-24.8-22.9-54.1-12.7-29.3-23.2-53.6-23.2-54 0-1.1 28.8-1.4 52.7-.6l12.2.4 23.3 51.8c12.7 28.5 23.5 51.9 23.8 52 .3 0 10.9-23.1 23.5-51.5 12.7-28.3 23.3-51.9 23.8-52.5.4-.5 15.1-1 32.6-1s31.7-.3 31.5-.6c-.3-.3-43.8-1-96.8-1.6l-96.3-1-35.3 79.6z" fill="#4285f4"/>
      <path d="M152.3 138.7c-45.9 102.7-83.4 186.9-83.4 187.1 0 .3 147.3.2 147.7-.1.4-.2-39.9-89.9-82.9-184.1-4.5-9.9-9.8-21.5-11.6-25.8-1.9-4.3-3.6-7.8-3.9-7.8-.3 0-16.8 13.9-36.6 30.9-19.9 17-36.5 31-37 31-.4 0-1.1-.7-1.5-1.6-.6-1.7 31.3-30.6 71.7-64.8 11.8-10 22.2-18.5 23.2-19 1.6-.8 1.6.2 1.6 5.6v6.6l13.7 30.5zm227.6 127.8c-.5 1.7-.9 3.4-.9 3.7 0 .4 16.3.7 36.3.7s36.3-.3 36.3-.7c0-.5-17.5-39.8-18.4-41.3-.1-.2-11.9-.3-26-.3l-25.8.1-1.5 3.2c-.8 1.8-1.3 2.9-1.3 2.5 0-.5-.4.4-1 1.9-.5 1.6-1 2.8-1 2.7.1-.1-.6 1.4-1.4 3.4-1.9 4.7-2.9 7.1-3.5 9.5-.5 1.9-.5 1.9-.7-.1-.1-1.1-.6-3.8-1.1-6-.5-2.2-1.3-5.5-1.6-7.4-.6-3.1-1-4.5-2.5-9.5-1-3.6-3.1-3.8-3.1-.4 0 1.5-.8 1.7-7.5 1.5l-7.5-.3 1.3 3.2c.7 1.8 1.3 3.6 1.3 4 .1.5.3 1.6.5 2.5.2.9.7 2.5 1 3.5.4 1.1.8 2.7.9 3.5.9 6.4 2.2 8.5 2.3 3.8.1-1.6.4-2.8.8-2.8.9 0 .5-1.9 3.3 17zm-184.4 42.3c0 .7 10 23.1 22.1 49.8 12.2 26.7 22.1 48.9 22.1 49.2 0 .4-21.3.6-47.4.6-45.8-.1-47.3-.1-46.9-2 .5-2.1 97.5-217.9 97.5-217.4 0 .2-10.6 24.1-23.7 53.1-13 29-23.7 54-23.7 55.5 0 1.5-.4 2.7-1 2.7-1.1 0-1.4 4.9-.3 5.1.4.1.7 2.3.7 4.8z" fill="#ea4335"/>
      <path d="M285.8 245.8c24.8 55.1 67.5 149.3 95 209.3l50 109.2.6-6.9c1.9-23.4-3.7-56.5-13.7-80.9-10.5-25.7-21.7-43.9-38.7-63-9.5-10.7-27.2-26.5-35.6-31.7-1.3-.9-2.4-1.9-2.4-2.3 0-.3 5.6-13.1 12.5-28.3 6.9-15.2 12.5-27.9 12.5-28.2 0-.4-42.2-.7-93.7-.7h-93.7l.6 2.7c.8 3.8 2.4 9 7.6 25.5 2.6 8.3 4.7 15.4 4.7 15.8 0 .4-4.5.7-10 .8-5.5 0-10 .1-10 .2s36 80.1 80 177.8c44 97.7 80 177.9 80 178.1 0 .3-17.9.5-39.7.5H152v2.1c0 1.7.6 2.2 2.8 2.5 1.5.2 56.7.3 122.7.3l120-.1 58.7-130.7c32.3-71.9 68.9-153.5 81.2-181.4 12.3-27.9 22.7-51.7 23.1-53l.7-2.3H387.8l-.3 3.9c-.3 3.6-.5 3.9-3.8 4.5-1.9.3-3.8.9-4.2 1.4-.4.4-.5.2-.1-.5.5-.9.3-1.2-.8-1-.8.2-1.3.9-1.1 1.4.2.6-.3 1-1 1s-1.2-.7-1-1.5c.2-.8.1-1.2-.3-.8-.5.4-1.3-.3-2-1.5-.6-1.1-1.7-2.3-2.5-2.7-.8-.4-1.9-1.6-2.5-2.6-1.1-2.1-1.6-1.7 20.9-19.5l11.6-9.1-50.9-.1-50.9-.1-12.2 27.2z" fill="#fbbc04"/>
    </svg>
    `;
    const handleDeleteComment = async (commentId) => {
        if (!commentId) {
          toast.error("Unable to identify comment.");
          return;
        }
        
        if (!window.confirm("Are you sure you want to delete this comment?")) {
          return;
        }
        
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`http://localhost:3000/api/fund/fundraisers/${id}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete comment");
          }
          
          // Update the UI by removing the deleted comment
          setFundraiser(prev => ({
            ...prev,
            comments: prev.comments.filter(comment => comment._id !== commentId)
          }));
          
          toast.success("Comment deleted successfully");
          
        } catch (error) {
          console.error("Error deleting comment:", error);
          toast.error(error.message || "Error deleting comment. Please try again.");
        }
      };
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!commentText.trim()) {
          toast.error('Please enter a comment');
          return;
        }
        
        setIsSubmitting(true);
        
        // Get authToken instead of token
        const token = localStorage.getItem('authToken');
        
        // Debug log
        console.log('Using authToken:', token ? 'exists' : 'missing');
        
        try {
          const response = await axios.post(
            `http://localhost:3000/api/fund/fundraisers/${id}/comments`, 
            { text: commentText },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          console.log('Comment posted successfully:', response.data);
          
          // Update local state with the new comment
          setFundraiser({
            ...fundraiser,
            comments: [...(fundraiser.comments || []), response.data]
          });
          
          // Clear the comment input
          setCommentText('');
          toast.success('Comment posted successfully!');
        } catch (error) {
          console.error('Error posting comment:', error);
          
          if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
            
            if (error.response.status === 403) {
              toast.error('You are not authorized to post comments. Please log in again.');
            } else if (error.response.status === 401) {
              toast.error('Your session has expired. Please log in again.');
            } else {
              toast.error(`Failed to post comment: ${error.response?.data?.message || error.message}`);
            }
          } else {
            toast.error(`Network error: ${error.message}`);
          }
        } finally {
          setIsSubmitting(false);
        }
      };
     
    const handleSendMessage = async () => {
        if (!messageText.trim()) {
            toast.error("Message cannot be empty");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/fundraiser/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fundraiserEmail: fundraiser.email,
                    senderEmail: localStorage.getItem('email'),
                    message: messageText
                })
            });

            if (response.ok) {
                toast.success("Message sent successfully!");
                setShowMessageModal(false);
                setMessageText('');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Google Pay QR Code</h3>
                            <button 
                                onClick={() => setShowPaymentModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                                <p className="text-sm text-gray-600 mb-2">Scan this QR code with Google Pay to donate</p>
                                <div className="flex justify-center">
                                    {/* QR code component */}
                                    <div className="border border-gray-200 rounded-lg p-2 sm:p-4 bg-white">
                                        <QRCodeSVG 
                                            value={upiPaymentString}
                                            size={200}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 mt-2">Open Google Pay app and tap 'Scan QR'</p>
                            </div>
                            
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="text-xl sm:text-2xl font-bold text-emerald-600">₹{formatCurrency(donationAmount)}</p>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-600">UPI ID</p>
                                <p className="text-base sm:text-lg font-medium">{upiId}</p>
                                <p className="text-xs text-gray-500 mt-1">Payment will be processed through Google Pay</p>
                            </div>
                            
                            {/* Added Anonymous Donation Checkbox */}
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="anonymousDonation"
                                    checked={donateAnonymously}
                                    onChange={() => setDonateAnonymously(!donateAnonymously)}
                                    className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="anonymousDonation" className="ml-2 text-sm text-gray-600">
                                    Donate anonymously
                                </label>
                            </div>
                            
                            <div className="flex flex-col space-y-3">
                                <button 
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex justify-center items-center"
                                    onClick={handlePaymentComplete}
                                    disabled={processingPayment}
                                >
                                    {processingPayment ? (
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            <span className="mr-2" dangerouslySetInnerHTML={{ __html: googlePayLogo }} />
                                            I've Completed the Payment
                                        </>
                                    )}
                                </button>
                                <button 
                                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                    onClick={() => setShowPaymentModal(false)}
                                    disabled={processingPayment}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Message Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Send a Message</h3>
                            <button 
                                onClick={() => setShowMessageModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div>
                            <textarea 
                                className="w-full h-32 sm:h-40 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                                placeholder="Write your message to the fundraiser..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                            
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                                <button 
                                    className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex justify-center items-center"
                                    onClick={handleSendMessage}
                                >
                                    <Send size={18} className="mr-2" />
                                    Send Message
                                </button>
                                <button 
                                    className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                    onClick={() => setShowMessageModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Top Navigation */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex items-center">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-1" />
                        <span className="text-sm sm:text-base">Back</span>
                    </button>
                </div>
            </div>
    
            <div className="container mx-auto px-4 py-4 sm:py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
                    <div className="relative h-48 sm:h-64 md:h-80">
                        <img 
                            src={fundraiser.imageUrl} 
                            alt={fundraiser.title} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 leading-tight">{fundraiser.title}</h1>
                            <div className="flex items-center space-x-4 text-white/90 text-sm sm:text-base">
                                <span className="flex items-center">
                                    <Users size={14} className="mr-1" />
                                    <span>{donors} supporters</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    {/* Left Content Area */}
                    <div className="w-full lg:w-2/3 order-2 lg:order-1">
                        {/* Tabs Navigation */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
                            <div className="flex overflow-x-auto scrollbar-hide">
                                <button 
                                    className={`px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none ${activeTab === 'story' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500'}`}
                                    onClick={() => setActiveTab('story')}
                                >
                                    Story
                                </button>
                                <button 
                                    className={`px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none ${activeTab === 'Comments' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500'}`}
                                    onClick={() => setActiveTab('Comments')}
                                >
                                    Comments
                                </button>
                                <button 
                                    className={`px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none ${activeTab === 'donors' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500'}`}
                                    onClick={() => setActiveTab('donors')}
                                >
                                    Donors
                                </button>
                                <button 
                                    className={`px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap focus:outline-none ${activeTab === 'updates' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500'}`}
                                    onClick={() => setActiveTab('updates')}
                                >
                                    Updates
                                </button>
                            </div>
    
                            <div className="p-4 sm:p-6">
                                {activeTab === 'story' && (
                                    <div>
                                        <p className="text-base sm:text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                                            {fundraiser.description}
                                        </p>
                                        
                                        <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200">
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Organizers and Beneficiary</h3>
                                            <div className="flex items-center">
                                                <div className="bg-emerald-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-semibold">
                                                    {fundraiser.name}
                                                </div>
                                                <div className="ml-3 sm:ml-4">
                                                    <p className="text-base sm:text-lg font-medium text-gray-800">{fundraiser.name}</p>
                                                    <p className="text-sm sm:text-base text-gray-600">{fundraiser.email}</p>
                                                    {upiId && <p className="text-sm sm:text-base text-gray-600">UPI: {upiId}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
    
                                {activeTab === 'Comments' && (
                                    <div className="space-y-4 sm:space-y-6">
                                        <h3 className="text-lg sm:text-xl font-semibold">Comments</h3>
                                        
                                        {/* Comments list */}
                                        <div className="space-y-3 sm:space-y-4">
                                            {fundraiser.comments && fundraiser.comments.length > 0 ? (
                                                fundraiser.comments.map((comment, index) => (
                                                    <div key={comment._id || index} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="font-medium text-gray-800 text-sm sm:text-base">
                                                                {comment.userName}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs sm:text-sm text-gray-500">
                                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                                </span>
                                                                
                                                                {/* Delete button - only shown if the comment belongs to the current user */}
                                                                {comment.user && comment.user.toString() === currentUserId && (
                                                                    <button
                                                                        onClick={() => handleDeleteComment(comment._id)}
                                                                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                                                        aria-label="Delete comment"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm sm:text-base text-gray-700">{comment.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 italic text-center py-4 text-sm sm:text-base">
                                                    No comments yet. Be the first to show support!
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Comment form - no username field */}
                                        <form onSubmit={handleCommentSubmit} className="space-y-3">
                                            <textarea
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px] sm:min-h-[100px]"
                                                placeholder="Leave a comment of support or ask a question..."
                                                required
                                            />
                                            <button 
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                                            >
                                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                                            </button>
                                        </form>
                                    </div>
                                )}
    
                                {activeTab === 'donors' && (
                                    <div className="py-2 sm:py-4">
                                        {fundraiser.donors && fundraiser.donors.length > 0 ? (
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                                                    {fundraiser.donorsCount} {fundraiser.donorsCount === 1 ? 'Person' : 'People'} Have Donated
                                                </h3>
                                                <div className="space-y-3 sm:space-y-4">
                                                    {fundraiser.donors.map((donor, index) => (
                                                        <div key={index} className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                            <div className="bg-emerald-100 text-emerald-600 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold">
                                                                {donor.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="ml-2 sm:ml-3">
                                                                <p className="font-medium text-gray-800 text-sm sm:text-base">{donor}</p>
                                                                <p className="text-xs sm:text-sm text-gray-500">Supporter</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 sm:py-12">
                                                <p className="text-gray-500 text-sm sm:text-base">Be the first to donate!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
    
                                {activeTab === 'updates' && (
                                    <div className="py-2 sm:py-4">
                                        {fundraiser && fundraiser.updates && fundraiser.updates.length > 0 ? (
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                                                    Campaign Updates ({fundraiser.updates.length})
                                                </h3>
                                                <div className="space-y-4 sm:space-y-6">
                                                    {fundraiser.updates.map((update, index) => (
                                                        <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
                                                            <div className="flex justify-between items-center mb-2 sm:mb-3 border-b pb-2">
                                                                <h4 className="text-base sm:text-lg font-medium text-gray-800">{update.title}</h4>
                                                                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                    {formatDate(update.createdAt)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">{update.description || update.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 sm:py-12">
                                                <p className="text-gray-500 text-sm sm:text-base">No updates have been posted yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
    
                    {/* Right Sidebar - Donation Card */}
                    <div className="w-full lg:w-1/3 order-1 lg:order-2 mb-6 lg:mb-0">
                        <div className="sticky top-16 sm:top-20">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 sm:mb-6">
                                <div className="p-4 sm:p-6">
                                    {/* Progress Bar & Stats */}
                                    <div className="mb-4 sm:mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xl sm:text-2xl font-bold text-emerald-600">₹{formatCurrency(raised)}</span>
                                            <span className="text-xs sm:text-sm text-gray-500 flex items-end">raised of ₹{formatCurrency(fundraiser.targetAmount)}</span>
                                        </div>
                                        
                                        <div className="w-full h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                            ></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center">
                                                {/* Circle Progress */}
                                                <div className="relative w-10 h-10 sm:w-14 sm:h-14 mr-2 sm:mr-3">
                                                    <svg className="w-10 h-10 sm:w-14 sm:h-14 transform -rotate-90">
                                                        <circle
                                                            className="text-gray-200"
                                                            strokeWidth="4"
                                                            stroke="currentColor"
                                                            fill="transparent"
                                                            r="18"
                                                            cx="20"
                                                            cy="20"
                                                        />
                                                        <circle
                                                            className="text-emerald-500"
                                                            strokeWidth="4"
                                                            strokeDasharray={2 * Math.PI * 18}
                                                            strokeDashoffset={2 * Math.PI * 18 - (progress / 100) * 2 * Math.PI * 18}
                                                            strokeLinecap="round"
                                                            stroke="currentColor"
                                                            fill="transparent"
                                                            r="18"
                                                            cx="20"
                                                            cy="20"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-xs sm:text-sm font-semibold">{Math.round(progress)}%</span>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        <span className="font-medium">{donors}</span> people have donated
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <button className="p-1 sm:p-2 rounded-full hover:bg-gray-100 text-rose-500 transition-colors">
                                                <Heart size={16} className="sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Donation Form */}
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">Select amount to donate</h3>
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                                            {donationOptions.map(amount => (
                                                <button
                                                    key={amount}
                                                    onClick={() => setDonationAmount(amount)}
                                                    className={`py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                                                        donationAmount === amount
                                                            ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                                                    }`}
                                                >
                                                    ₹{formatCurrency(amount)}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div className="mb-3 sm:mb-4">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">₹</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={donationAmount}
                                                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                                                    className="block w-full pl-8 pr-3 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm sm:text-base"
                                                    placeholder="Enter custom amount"
                                                />
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={handleDonateClick}
                                            className="w-full py-2 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg mb-3 sm:mb-4 flex items-center justify-center text-sm sm:text-base"
                                        >
                                            <span className="mr-2" dangerouslySetInnerHTML={{ __html: googlePayLogo }} />
                                            Donate with Google Pay
                                        </button>
                                        
                                       
                                    </div>
                                </div>
                            </div>
                            
                            {/* Safety Notice */}
                            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">Trust & Safety:</span> This fundraiser has been verified by our team. All donations are securely processed and protected.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;