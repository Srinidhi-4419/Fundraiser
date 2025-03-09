import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Menu, X, Heart, Search, Info, LogIn, PlusCircle, User, LogOut, LayoutDashboard } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [authenticated, setAuthenticated] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const profileDropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleCreateFund = () => {
        if (authenticated) {
            navigate('/create');
        } else {
            toast.info("Please sign in to start a fundraiser", {
                position: "top-center",
                icon: "🔒",
            });
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        }
    };

    // Check authentication status when component mounts
    useEffect(() => {
        setAuthenticated(!!localStorage.getItem('authToken'));
        
        // Add scroll listener for navbar effects
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileDropdownRef]);

    // Handle sign-in navigation
    const handleSignin = () => {
        navigate('/signin');
        setMobileMenuOpen(false);
    };

    // Handle sign-out functionality
    const handleSignout = () => {
        localStorage.removeItem('authToken');
        setAuthenticated(false);
        setProfileDropdownOpen(false);
        toast.success('Sign out successful!', {
            position: "top-right",
            autoClose: 2000,
        });
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    // Handle dashboard navigation
    const handleDashboard = () => {
        navigate('/userdashboard');
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    // Handle donate navigation
    const handleDonate = () => {
        navigate('/funds');
        setMobileMenuOpen(false);
    };

    // Handle about navigation
    const handleAbout = () => {
        navigate('/about');
        setMobileMenuOpen(false);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Toggle profile dropdown
    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    return (
        <>
        <motion.nav 
            className={`sticky top-0 z-50 ${
                scrolled 
                ? "bg-white bg-opacity-95 backdrop-blur-sm shadow-lg" 
                : "bg-white shadow-md"
            } transition-all duration-300`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <motion.div 
                        className="flex-shrink-0 cursor-pointer" 
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h1 className="text-2xl font-bold">
                            <span className="text-green-600">Aid</span>
                            <span className="text-green-500">Link</span>
                            <motion.span 
                                className="inline-block text-green-400 ml-1"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, 15, 0, -15, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
                            >
                                ❤️
                            </motion.span>
                        </h1>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <motion.button 
                            onClick={() => navigate('/search')}
                            className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150 px-3 py-2 rounded-lg"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search size={18} />
                            <span>Search</span>
                        </motion.button>
                        <motion.button 
                            onClick={handleDonate}
                            className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150 px-3 py-2 rounded-lg"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Heart className="text-pink-500" size={18} />
                            <span>Donate</span>
                        </motion.button>
                        <motion.button 
                            onClick={handleAbout}
                            className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150 px-3 py-2 rounded-lg"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Info size={18} />
                            <span>About</span>
                        </motion.button>
                        
                        {!authenticated && (
                            <motion.button 
                                onClick={handleSignin}
                                className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150 px-3 py-2 rounded-lg"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogIn size={18} />
                                <span>Sign In</span>
                            </motion.button>
                        )}

                        <motion.button 
                            onClick={handleCreateFund}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-full px-5 py-2 flex items-center gap-1 transition duration-300 shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                            animate={{ 
                                boxShadow: ["0 4px 6px rgba(0, 0, 0, 0.1)", "0 6px 15px rgba(22, 163, 74, 0.4)", "0 4px 6px rgba(0, 0, 0, 0.1)"],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <PlusCircle size={18} />
                            <span>Start a Fundraiser</span>
                        </motion.button>
                        
                        {/* Profile at the rightmost position */}
                        {authenticated && (
                            <div className="relative ml-2" ref={profileDropdownRef}>
                                <motion.button 
                                    onClick={toggleProfileDropdown}
                                    className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150 p-2 rounded-full hover:bg-gray-100"
                                    aria-expanded={profileDropdownOpen}
                                    aria-haspopup="true"
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <User size={20} />
                                </motion.button>
                                
                                {/* Profile dropdown menu */}
                                <AnimatePresence>
                                    {profileDropdownOpen && (
                                        <motion.div 
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200 overflow-hidden"
                                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <motion.button
                                                onClick={handleDashboard}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors duration-150"
                                                whileHover={{ x: 5 }}
                                            >
                                                <LayoutDashboard size={16} />
                                                <span>Dashboard</span>
                                            </motion.button>
                                            <motion.button
                                                onClick={handleSignout}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors duration-150"
                                                whileHover={{ x: 5 }}
                                            >
                                                <LogOut size={16} />
                                                <span>Sign Out</span>
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <motion.button
                            onClick={toggleMobileMenu}
                            className="text-gray-600 hover:text-green-600 focus:outline-none p-2"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        className="md:hidden bg-white shadow-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <motion.button 
                                onClick={() => navigate('/search')}
                                className="w-full text-left block px-4 py-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors duration-150"
                                whileHover={{ x: 5 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Search size={18} />
                                <span>Search</span>
                            </motion.button>
                            <motion.button 
                                onClick={handleDonate}
                                className="w-full text-left block px-4 py-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors duration-150"
                                whileHover={{ x: 5 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Heart className="text-pink-500" size={18} />
                                <span>Donate</span>
                            </motion.button>
                            <motion.button 
                                onClick={handleAbout}
                                className="w-full text-left block px-4 py-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors duration-150"
                                whileHover={{ x: 5 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Info size={18} />
                                <span>About</span>
                            </motion.button>
                            {authenticated ? (
                                <>
                                    <motion.button 
                                        onClick={handleDashboard}
                                        className="w-full text-left block px-4 py-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors duration-150"
                                        whileHover={{ x: 5 }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </motion.button>
                                    <motion.button 
                                        onClick={handleSignout}
                                        className="w-full text-left block px-4 py-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors duration-150"
                                        whileHover={{ x: 5 }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <LogOut size={18} />
                                        <span>Sign Out</span>
                                    </motion.button>
                                </>
                            ) : (
                                <motion.button 
                                    onClick={handleSignin}
                                    className="w-full text-left block px-4 py-3 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2 transition-colors duration-150"
                                    whileHover={{ x: 5 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <LogIn size={18} />
                                    <span>Sign In</span>
                                </motion.button>
                            )}
                            <motion.button 
                                onClick={handleCreateFund}
                                className="w-full text-left block px-4 py-3 rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 flex items-center gap-2 shadow-md"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <PlusCircle size={18} />
                                <span>Start a Fundraiser</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
        <ToastContainer/>
        </>
    );
}