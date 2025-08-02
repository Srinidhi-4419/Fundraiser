import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, Users, Clock } from "lucide-react";

export function Thumbnail({ id, image, title, remaining, goal, deadline, supporters = 0 }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [donorsCount, setDonorsCount] = useState(supporters);
  const [isLoading, setIsLoading] = useState(true);
  
  const raised = goal - remaining;
  const progress = (raised / goal) * 100;
  
  // Format currency with commas
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Fetch donors count when component mounts
  useEffect(() => {
    const fetchDonorsCount = async () => {
      try {
        const donorsCountResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fund/fundraisers/${id}/donors/count`);
        if (donorsCountResponse.ok) {
          const countData = await donorsCountResponse.json();
          if (countData.success) {
            setDonorsCount(countData.donorsCount);
          }
        }
      } catch (error) {
        console.error("Error fetching donors count:", error);
        // Fallback to the supporters prop if API call fails
        setDonorsCount(supporters);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonorsCount();
  }, [id, supporters]);

  return (
    <div 
      className={`w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ${isHovered ? 'transform scale-102 shadow-xl' : ''}`}
      onClick={() => navigate(`/fundraiser/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fundraiser Image with Overlay */}
      <div className="relative">
        <div className="overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className={`w-full h-64 object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : ''}`} 
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />
        
        {/* Floating Impact Button */}
        <button 
          className={`absolute top-4 right-4 bg-white/90 hover:bg-white text-rose-500 p-2 rounded-full shadow-md transition-all duration-300 ${isHovered ? 'transform rotate-12' : ''}`}
        >
          <Heart size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title with ellipsis for long text */}
        <h2 className="text-xl font-bold text-gray-800 line-clamp-2 h-14">{title}</h2>
        
        {/* Stats Row */}
        <div className="flex items-center space-x-4 mt-2 mb-3 text-gray-500 text-sm">
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>
              {isLoading ? (
                <span className="inline-block w-8 h-4 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                `${donorsCount} donors`
              )}
            </span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{deadline || "Limited time"}</span>
          </div>
        </div>

        {/* Progress Bar with Animation */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Amount Details */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-600">₹{formatCurrency(raised)}</span>
            <span className="text-xs text-gray-500">raised of ₹{formatCurrency(goal)}</span>
          </div>
          
          {/* Call to Action */}
          <button 
            className={`px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all duration-300 ${isHovered ? 'bg-emerald-600 shadow-lg' : ''}`}
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
}