import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Share2, Clock, Users, ArrowLeft, AlertCircle, X, Send, MessageSquare, Trophy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios';

const Detail = ({ email }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fundraiser, setFundraiser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donationAmount, setDonationAmount] = useState(500);
    const [activeTab, setActiveTab] = useState('story');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [donors, setcount] = useState(0);
    const donationOptions = [100, 500, 1000, 5000];
    const [donateAnonymously, setDonateAnonymously] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentUserId = localStorage.getItem("userId");
    const [updates, setUpdates] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status
    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        setIsAuthenticated(!!authToken);
    }, []);

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
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fund/fundraisers/${id}`);
                if (!response.ok) {
                    setFundraiser(null);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setFundraiser(data);

                // Then fetch the donors for this fundraiser
                
                try {
                    const donorsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fundraiser/${id}/donors`);
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
                    const donorsCountResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fund/fundraisers/${id}/donors/count`);
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
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/fund/${id}/updates`);

                    // Debug the response
                    if (response.data.updates) {
                        setUpdates(response.data.updates);
                    } else {
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

    // Modified handleDonateClick to check for authentication
    const handleDonateClick = () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to donate", {
                duration: 5000,
                position: 'top-right',
            });
            // Redirect to login page
            navigate('/signin', { state: { from: `/fund/${id}` } });
            return;
        }

        if (donationAmount <= 0) {
            toast.error("Please enter a valid donation amount");
            return;
        }
        setShowPaymentModal(true);
    };

    // Updated handlePaymentComplete function
    // Replace your existing handlePaymentComplete function with this improved version

const handlePaymentComplete = async () => {
    setProcessingPayment(true);
    
    try {
        const token = localStorage.getItem("authToken");

        // Check if user is still authenticated
        if (!token) {
            toast.error("Your session has expired. Please sign in again.");
            setProcessingPayment(false);
            setShowPaymentModal(false);
            navigate('/signin', { state: { from: `/fund/${id}` } });
            return;
        }

        // Step 1: Update the fundraiser amount
        const paymentResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fund/fundraisers/${id}/update-amount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: donationAmount })
        });

        if (!paymentResponse.ok) {
            const errorData = await paymentResponse.json();
            console.error("Payment update failed:", errorData);
            toast.error("There was a problem processing your payment. Please try again.");
            setProcessingPayment(false);
            return;
        }

        const updatedFundraiserData = await paymentResponse.json();

        // Immediately update the local state to prevent NaN values
        setFundraiser(prevState => ({
            ...prevState,
            remainingAmount: updatedFundraiserData.remainingAmount || (prevState.remainingAmount - donationAmount),
            targetAmount: updatedFundraiserData.targetAmount || prevState.targetAmount,
            // Ensure we have valid numbers
            ...(updatedFundraiserData.remainingAmount !== undefined && {
                remainingAmount: Number(updatedFundraiserData.remainingAmount)
            }),
            ...(updatedFundraiserData.targetAmount !== undefined && {
                targetAmount: Number(updatedFundraiserData.targetAmount)
            })
        }));

        // Step 2: Add donor to the list
        const username = localStorage.getItem('email');
       

        if (username) {
            const donorResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/fundraiser/add-donor`, {
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

            if (donorResponse.ok) {

                // Update donors count and list
                setcount(prevCount => prevCount + 1);
                setFundraiser(prevState => ({
                    ...prevState,
                    donors: [...(prevState.donors || []), donateAnonymously ? "Anonymous" : username],
                    donorsCount: (prevState.donorsCount || 0) + 1
                }));
            } else {
                console.error("Failed to add donor");
            }
        }

        // Step 3: Record the donation
        const donationResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/donate`, {
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

        // Close modal first
        setShowPaymentModal(false);
        setProcessingPayment(false);

        // Show immediate success message
        toast.success(`🎉 Payment Successful!`, {
            duration: 4000,
            position: 'top-center',
            style: {
                background: '#10B981',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
        });

        // Show detailed success message after a short delay
        setTimeout(() => {
            toast.success(`Thank you for your generous donation of ₹${formatCurrency(donationAmount)}! Your support means everything.`, {
                duration: 5000,
                position: 'top-center',
                icon: '❤️',
                style: {
                    background: '#059669',
                    color: 'white',
                    fontSize: '14px',
                    padding: '12px',
                    borderRadius: '8px',
                    maxWidth: '400px'
                }
            });
        }, 1000);

        // Navigate after showing success messages
        setTimeout(() => {
            navigate('/funds');
        }, 4000);

    } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("There was a problem connecting to the server. Please try again later.", {
            duration: 5000,
            position: 'top-center',
            style: {
                background: '#EF4444',
                color: 'white',
                fontWeight: 'bold'
            }
        });
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fund/fundraisers/${id}/comments/${commentId}`, {
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

        if (!isAuthenticated) {
            toast.error("Please sign in to post a comment", {
                duration: 3000,
                position: 'top-center',
            });
            navigate('/login', { state: { from: `/fund/${id}` } });
            return;
        }

        if (!commentText.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setIsSubmitting(true);

        // Get authToken instead of token
        const token = localStorage.getItem('authToken');

        // Debug log
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/fund/fundraisers/${id}/comments`,
                { text: commentText },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

          

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
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handlePaymentComplete}
                                    disabled={processingPayment}
                                >
                                    {processingPayment ? (
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            <span>Processing Payment...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src="https://www.pngrepo.com/download/353822/google-pay-icon.png"
                                                alt="Google Pay"
                                                className="w-5 h-5 mr-2"
                                            />
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
                                                    className={`py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${donationAmount === amount
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
                                            <img
                                                src="https://www.pngrepo.com/download/353822/google-pay-icon.png"
                                                alt="Google Pay"
                                                className="w-6 h-6 mr-2"
                                            />

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
            <Toaster/>
        </div>
    );
}

export default Detail;