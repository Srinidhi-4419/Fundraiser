import React, { useState, useEffect } from 'react';
import { DollarSign, Heart, PiggyBank, Gift, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Simplified Card component
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
    {children}
  </div>
);

// Tab components
const Tabs = ({ children }) => (
  <div className="w-full">{children}</div>
);

const TabsList = ({ children }) => (
  <div className="flex border-b mb-4">{children}</div>
);

const TabsTrigger = ({ children, active, onClick }) => (
  <button 
    className={`px-4 py-2 ${active ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
    onClick={onClick}>
    {children}
  </button>
);

const TabsContent = ({ children, active }) => (
  <div className={active ? 'block' : 'hidden'}>{children}</div>
);

// Progress component
const Progress = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
);

// Update Modal Component
const UpdateModal = ({ isOpen, onClose, fundraiserId, onUpdateAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/fund/${fundraiserId}/updates`, 
        { title, content },
        { 
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      
      setTitle('');
      setContent('');
      if (onUpdateAdded) onUpdateAdded(response.data.update);
      onClose();
    } catch (error) {
      console.error('Error posting update:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Post Fundraiser Update</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add state for update modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('authToken');
  
        if (!token) {
          setError("Unauthorized: No token provided");
          setLoading(false);
          return;
        }
  
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };
  
        // Fetching dashboard summary (which now includes fundraisers)
        const summaryResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/dashboard-summary`, { headers });
        if (!summaryResponse.ok) throw new Error("Failed to fetch dashboard summary");
        const summaryData = await summaryResponse.json();
  
        // Fetching donations
        const donationsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/donations`, { headers });
        if (!donationsResponse.ok) throw new Error("Failed to fetch donations");
        const donationsData = await donationsResponse.json();
  
        // Setting state - now using fundraisers from dashboard data
        setDashboardData(summaryData);
        setDonations(donationsData);
        setFundraisers(summaryData.fundraisers); // Use fundraisers from dashboard data
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleOpenUpdateModal = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setUpdateModalOpen(true);
  };

  const handleUpdateAdded = (newUpdate) => {
    // Optionally refresh fundraisers or add the update to the state
    console.log("Update added:", newUpdate);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Fundraising Dashboard</h1>
      
      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            Overview
          </TabsTrigger>
          <TabsTrigger active={activeTab === "myFundraisers"} onClick={() => setActiveTab("myFundraisers")}>
            My Fundraisers
          </TabsTrigger>
          <TabsTrigger active={activeTab === "myDonations"} onClick={() => setActiveTab("myDonations")}>
            My Donations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent active={activeTab === "overview"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="flex items-center p-4">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <PiggyBank size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Fundraisers</p>
                <p className="text-2xl font-bold">{dashboardData.totalFundraisers}</p>
              </div>
            </Card>
            
            <Card className="flex items-center p-4">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Raised</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboardData.totalRaised)}</p>
              </div>
            </Card>

            <Card className="flex items-center p-4">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Gift size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Donations Made</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboardData.totalDonated)}</p>
              </div>
            </Card>

            <Card className="flex items-center p-4">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <Heart size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Campaigns</p>
                <p className="text-2xl font-bold">{dashboardData.activeFundraisers}</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">Recent Donations</h2>
                <p className="text-sm text-gray-500">Your recent contributions</p>
              </div>
              
              <div className="space-y-4">
                {donations.slice(0, 2).map(donation => (
                  <div key={donation._id} className="flex items-start border-b pb-3">
                    <img 
                      src={donation.fundraiser.imageUrl} 
                      alt={donation.fundraiser.title}
                      className="w-12 h-12 rounded object-cover mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{donation.fundraiser.title}</p>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-600">{formatDate(donation.createdAt)}</p>
                        <p className="font-semibold text-green-600">{formatCurrency(donation.amount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {donations.length > 2 && (
                  <button 
                    className="text-blue-500 text-sm font-medium"
                    onClick={() => setActiveTab("myDonations")}
                  >
                    View all donations
                  </button>
                )}
              </div>
            </Card>

            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">Your Fundraisers</h2>
                <p className="text-sm text-gray-500">Campaigns you've created</p>
              </div>
              
              <div className="space-y-4">
                {fundraisers.slice(0, 2).map(fundraiser => (
                  <div key={fundraiser._id} className="border-b pb-3">
                    <div className="flex items-start mb-2">
                      <img 
                        src={fundraiser.imageUrl} 
                        alt={fundraiser.title}
                        className="w-12 h-12 rounded object-cover mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{fundraiser.title}</p>
                        <p className="text-sm text-gray-600">{fundraiser.category}</p>
                      </div>
                    </div>
                    <div className="mb-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>
                          {formatCurrency(fundraiser.targetAmount - fundraiser.remainingAmount)} of {formatCurrency(fundraiser.targetAmount)}
                        </span>
                      </div>
                      <Progress value={(1 - fundraiser.remainingAmount / fundraiser.targetAmount) * 100} />
                    </div>
                  </div>
                ))}
                {fundraisers.length > 2 && (
                  <button 
                    className="text-blue-500 text-sm font-medium"
                    onClick={() => setActiveTab("myFundraisers")}
                  >
                    View all fundraisers
                  </button>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* My Fundraisers Tab */}
        <TabsContent active={activeTab === "myFundraisers"}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">My Fundraisers</h2>
            <p className="text-gray-500">Manage all your fundraising campaigns</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundraisers.map(fundraiser => (
              <Card key={fundraiser._id} className="overflow-hidden">
                <img 
                  src={fundraiser.imageUrl} 
                  alt={fundraiser.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{fundraiser.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {fundraiser.description.length > 120 
                      ? fundraiser.description.substring(0, 120) + '...' 
                      : fundraiser.description}
                  </p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>
                        {((1 - fundraiser.remainingAmount / fundraiser.targetAmount) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={(1 - fundraiser.remainingAmount / fundraiser.targetAmount) * 100} />
                    <div className="flex justify-between text-sm mt-1">
                      <span>Raised: {formatCurrency(fundraiser.targetAmount - fundraiser.remainingAmount)}</span>
                      <span>Goal: {formatCurrency(fundraiser.targetAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Created: {formatDate(fundraiser.createdAt)}</span>
                    <span>Donations: {fundraiser.donations.length}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => navigate(`/fundraiser/update/${fundraiser._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                      Update Details
                    </button>
                    {fundraiser.remainingAmount > 0 ? (
                      <button 
                        onClick={() => handleOpenUpdateModal(fundraiser)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                      >
                        Post Update
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Donations Tab */}
        <TabsContent active={activeTab === "myDonations"}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">My Donations</h2>
            <p className="text-gray-500">Track all your contributions</p>
          </div>
          
          <Card>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fundraiser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={donation.fundraiser.imageUrl} 
                            alt={donation.fundraiser.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donation.fundraiser.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(donation.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {donation.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Update Modal */}
      {selectedFundraiser && (
        <UpdateModal 
          isOpen={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          fundraiserId={selectedFundraiser._id}
          onUpdateAdded={handleUpdateAdded}
        />
      )}
    </div>
  );
};

export default UserDashboard;