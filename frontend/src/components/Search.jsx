import React, { useState, useEffect } from 'react';
import { Thumbnail } from "../pages/Thumbnail";
import { useNavigate } from 'react-router-dom';

export function Search() {
    const navigate = useNavigate();
    const [fundraisers, setFundraisers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFundraisers, setFilteredFundraisers] = useState([]);

    useEffect(() => {
        const fetchFundraisers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/fund/fundraisers');
                if (response.ok) {
                    const data = await response.json();
                    setFundraisers(data);
                    setFilteredFundraisers(data);
                } else {
                    console.error('Failed to fetch fundraisers');
                }
            } catch (error) {
                console.error('Error fetching fundraisers:', error);
            }
        };

        fetchFundraisers();
    }, []);

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        try {
            const response = await fetch(`http://localhost:3000/api/fundraisers/search?title=${term}`);
            if (response.ok) {
                const data = await response.json();
                setFilteredFundraisers(data);
            } else {
                // If search endpoint fails, filter locally
                const localFiltered = fundraisers.filter(fundraiser => 
                    fundraiser.title.toLowerCase().includes(term.toLowerCase())
                );
                setFilteredFundraisers(localFiltered);
            }
        } catch (error) {
            // Fallback to local filtering if fetch fails
            const localFiltered = fundraisers.filter(fundraiser => 
                fundraiser.title.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredFundraisers(localFiltered);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="py-16 text-center">
                <div className="max-w-xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">
                        Find Your <span className="text-green-600">Fundraiser</span>
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="relative w-full">
                        <input 
                            type="text" 
                            placeholder="Search fundraisers by title..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="absolute top-3.5 right-3 h-5 w-5 text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Fundraisers Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                {filteredFundraisers.length > 0 ? (
                    <div className="grid grid-cols-4 gap-6">
                        {filteredFundraisers.map((fundraiser) => (
                            <div 
                                key={fundraiser._id}
                                className="transition-transform duration-300 hover:-translate-y-2"
                            >
                                <Thumbnail 
                                    image={fundraiser.imageUrl} 
                                    title={fundraiser.title} 
                                    remaining={fundraiser.remainingAmount} 
                                    goal={fundraiser.targetAmount} 
                                    id={fundraiser._id}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-xl">
                            {searchTerm 
                                ? "No fundraisers found matching your search." 
                                : "No fundraisers available at the moment."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;