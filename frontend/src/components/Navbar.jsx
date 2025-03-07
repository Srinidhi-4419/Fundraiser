import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Menu, X, Heart, Search, Info, LogIn, PlusCircle, User, LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
    const [authenticated, setAuthenticated] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleCreateFund = () => {
        if (authenticated) {
            navigate('/create');
        } else {
            alert("Please sign in to start a fundraiser");
        }
    };

    // Check authentication status when component mounts
    useEffect(() => {
        setAuthenticated(!!localStorage.getItem('authToken'));
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
        navigate('/');
        setMobileMenuOpen(false);
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
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                        <h1 className="text-2xl font-bold text-green-600">AidLink</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <button 
                            onClick={() => navigate('/search')}
                            className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150"
                        >
                            <Search size={18} />
                            <span>Search</span>
                        </button>
                        <button 
                            onClick={handleDonate}
                            className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150"
                        >
                            <Heart size={18} />
                            <span>Donate</span>
                        </button>
                        <button 
                            onClick={handleAbout}
                            className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150"
                        >
                            <Info size={18} />
                            <span>About</span>
                        </button>
                        
                        {!authenticated && (
                            <button 
                                onClick={handleSignin}
                                className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150"
                            >
                                <LogIn size={18} />
                                <span>Sign In</span>
                            </button>
                        )}

                        <button 
                            onClick={handleCreateFund}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-5 py-2 flex items-center gap-1 transition duration-150 shadow-sm"
                        >
                            <PlusCircle size={18} />
                            <span>Start a Fundraiser</span>
                        </button>
                        
                        {/* Profile at the rightmost position */}
                        {authenticated && (
                            <div className="relative ml-2" ref={profileDropdownRef}>
                                <button 
                                    onClick={toggleProfileDropdown}
                                    className="text-gray-600 hover:text-green-600 flex items-center gap-1 transition duration-150 p-2 rounded-full hover:bg-gray-100"
                                    aria-expanded={profileDropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <User size={20} />
                                </button>
                                
                                {/* Profile dropdown menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <button
                                            onClick={handleDashboard}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>Dashboard</span>
                                        </button>
                                        <button
                                            onClick={handleSignout}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-600 hover:text-green-600 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <button 
                            onClick={() => navigate('/search')}
                            className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                        >
                            <Search size={18} />
                            <span>Search</span>
                        </button>
                        <button 
                            onClick={handleDonate}
                            className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                        >
                            <Heart size={18} />
                            <span>Donate</span>
                        </button>
                        <button 
                            onClick={handleAbout}
                            className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                        >
                            <Info size={18} />
                            <span>About</span>
                        </button>
                        {authenticated ? (
                            <>
                                <button 
                                    onClick={handleDashboard}
                                    className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </button>
                                <button 
                                    onClick={handleSignout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                                >
                                    <LogOut size={18} />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={handleSignin}
                                className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                            >
                                <LogIn size={18} />
                                <span>Sign In</span>
                            </button>
                        )}
                        <button 
                            onClick={handleCreateFund}
                            className="w-full text-left block px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                        >
                            <PlusCircle size={18} />
                            <span>Start a Fundraiser</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}