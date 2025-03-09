import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHeartbeat, FaGraduationCap, FaTree, FaHands, FaHouseUser, FaHandHoldingHeart, FaPaw } from 'react-icons/fa';
import { IoMdPlanet } from 'react-icons/io';

const ExploreCauses = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCauses, setFilteredCauses] = useState([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Categories with icons
  const categories = [
    { id: 'all', name: 'All Causes', icon: <FaHandHoldingHeart size={24} /> },
    { id: 'medical', name: 'Medical', icon: <FaHeartbeat size={24} /> },
    { id: 'education', name: 'Education', icon: <FaGraduationCap size={24} /> },
    { id: 'environment', name: 'Environment', icon: <FaTree size={24} /> },
    { id: 'disaster', name: 'Disaster Relief', icon: <IoMdPlanet size={24} /> },
    { id: 'community', name: 'Community', icon: <FaHands size={24} /> },
    { id: 'housing', name: 'Housing', icon: <FaHouseUser size={24} /> },
    { id: 'animals', name: 'Animal Welfare', icon: <FaPaw size={24} /> }
  ];

  // Example causes data
  const causesData = [
    {
      id: 1,
      title: "Emergency Medical Fund for Children",
      category: "medical",
      description: "Support children facing life-threatening medical conditions by helping their families cover critical healthcare costs.",
      image: "/api/placeholder/400/250",
      progress: 65,
      goal: 500000,
      raised: 325000
    },
    {
      id: 2,
      title: "Scholarships for Underprivileged Students",
      category: "education",
      description: "Help bright students from low-income families pursue their dream of higher education with scholarships for tuition and books.",
      image: "/api/placeholder/400/250",
      progress: 78,
      goal: 300000,
      raised: 234000
    },
    {
      id: 3,
      title: "Reforestation Initiative",
      category: "environment",
      description: "Contribute to planting trees in deforested areas to combat climate change and restore local ecosystems.",
      image: "/api/placeholder/400/250",
      progress: 42,
      goal: 150000,
      raised: 63000
    },
    {
      id: 4,
      title: "Flood Relief for Rural Communities",
      category: "disaster",
      description: "Support families who lost their homes and livelihoods in the recent devastating floods with emergency supplies and rebuilding assistance.",
      image: "/api/placeholder/400/250",
      progress: 89,
      goal: 800000,
      raised: 712000
    },
    {
      id: 5,
      title: "Community Center Construction",
      category: "community",
      description: "Help build a multi-purpose community center that will provide educational, recreational, and social services to an underserved neighborhood.",
      image: "/api/placeholder/400/250",
      progress: 35,
      goal: 1000000,
      raised: 350000
    },
    {
      id: 6,
      title: "Housing for Homeless Families",
      category: "housing",
      description: "Support the construction of affordable housing units for families currently living in temporary shelters or on the streets.",
      image: "/api/placeholder/400/250",
      progress: 58,
      goal: 1200000,
      raised: 696000
    },
    {
      id: 7,
      title: "Cancer Treatment Support",
      category: "medical",
      description: "Help patients fighting cancer access the treatments they need by contributing to their medical expenses and recovery support.",
      image: "/api/placeholder/400/250",
      progress: 72,
      goal: 450000,
      raised: 324000
    },
    {
      id: 8,
      title: "Animal Shelter Expansion",
      category: "animals",
      description: "Support the expansion of a no-kill animal shelter to accommodate more rescued animals and improve their living conditions.",
      image: "/api/placeholder/400/250",
      progress: 48,
      goal: 250000,
      raised: 120000
    }
  ];

  // Filter causes based on active category and search term
  useEffect(() => {
    const filtered = causesData.filter(cause => {
      const matchesCategory = activeCategory === 'all' || cause.category === activeCategory;
      const matchesSearch = cause.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           cause.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredCauses(filtered);
  }, [activeCategory, searchTerm]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // For the hero section animation
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-96 overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-600 opacity-80"></div>
        <img 
          src="/api/placeholder/1920/600" 
          alt="People helping each other" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Explore Causes
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={heroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl max-w-3xl"
          >
            Discover meaningful causes and make a difference in people's lives. Every contribution matters.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full max-w-xl mt-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for causes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Category Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex flex-nowrap space-x-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Cause Cards */}
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredCauses.length > 0 ? (
            filteredCauses.map((cause) => (
              <motion.div
                key={cause.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <img 
                  src={cause.image} 
                  alt={cause.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase">
                      {categories.find(cat => cat.id === cause.category)?.name || cause.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{cause.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{cause.description}</p>
                  
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-blue-600">{cause.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cause.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-blue-600 h-2.5 rounded-full"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-600">Raised: <span className="font-bold text-gray-800">{formatCurrency(cause.raised)}</span></span>
                      <span className="text-gray-600">Goal: <span className="font-bold text-gray-800">{formatCurrency(cause.goal)}</span></span>
                    </div>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                  >
                    Donate Now
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No causes found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                <button 
                  onClick={() => {setActiveCategory('all'); setSearchTerm('');}}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear filters
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Facts and Impact Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Collective Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              whileInView={{ scale: [0.8, 1.2, 1], opacity: [0, 1] }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-lg"
            >
              <h3 className="text-4xl font-bold mb-2">₹12.8 Cr+</h3>
              <p className="text-lg">Total Funds Raised</p>
            </motion.div>
            
            <motion.div 
              whileInView={{ scale: [0.8, 1.2, 1], opacity: [0, 1] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-lg"
            >
              <h3 className="text-4xl font-bold mb-2">450+</h3>
              <p className="text-lg">Successful Campaigns</p>
            </motion.div>
            
            <motion.div 
              whileInView={{ scale: [0.8, 1.2, 1], opacity: [0, 1] }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-lg"
            >
              <h3 className="text-4xl font-bold mb-2">18,000+</h3>
              <p className="text-lg">Generous Donors</p>
            </motion.div>
            
            <motion.div 
              whileInView={{ scale: [0.8, 1.2, 1], opacity: [0, 1] }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-lg"
            >
              <h3 className="text-4xl font-bold mb-2">25,000+</h3>
              <p className="text-lg">Lives Impacted</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16 px-4 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Own Fundraiser?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of individuals who have successfully raised funds for causes they care about.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-colors duration-300"
          >
            Start a Fundraiser
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExploreCauses;