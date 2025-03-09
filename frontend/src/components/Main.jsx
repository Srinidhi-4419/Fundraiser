import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, Users, Clock, Award, ChevronDown, Gift, HandHeart, Rocket, FileText } from "lucide-react";

export function Main() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    
    useEffect(() => {
        setVisible(true);
        
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const handleStartFund = () => {
        navigate('/create');
    };
    
    return (
        <>
            {/* Hero Section with Improved Design */}
            <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-green-50 to-green-100 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                    <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-green-300 blur-3xl"></div>
                    <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-green-200 blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-green-200 blur-3xl"></div>
                </div>
                
                {/* Content with reduced animations */}
                <div className={`max-w-4xl mx-auto text-center z-10 ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
                    <div className="mb-6">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm border border-green-200">
                            <Award className="mr-2 h-4 w-4" />
                            #1 Trusted Crowdfunding Platform
                        </span>
                    </div>
                    
                    <h1 className="font-bold text-4xl sm:text-5xl md:text-7xl text-gray-900 leading-tight">
                        <span className="block mb-2">Successful</span>
                        <span className="block mb-2">fundraisers</span>
                        <span className="block text-green-600">start here.</span>
                    </h1>
                    
                    <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto">
                        Join thousands who have successfully raised funds for causes that matter. 
                        Our platform makes it easy to create, share, and manage your fundraising campaign.
                    </p>
                    
                    <div className="mt-10 flex justify-center">
                        <button 
                            onClick={handleStartFund}
                            className="relative px-8 py-4 rounded-full text-white text-xl font-medium bg-gradient-to-r from-green-500 to-green-600 shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center group overflow-hidden"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
                            <span className="relative flex items-center">
                                Start a Fundraiser
                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                    
                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center">
                        <div className="animate-bounce p-2 bg-white bg-opacity-80 rounded-full shadow-md">
                            <ChevronDown className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Statistics Section with Enhanced Design */}
            <div className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Impact</h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Together, we've created positive change around the world</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Total Fundraisers Created */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-gray-100 transform hover:-translate-y-1 duration-300">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mb-6 mx-auto">
                                <FileText className="h-8 w-8" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 text-center">250K+</h3>
                            <p className="text-gray-600 text-center mt-2">Total Fundraisers Created</p>
                        </div>
                        
                        {/* Funds Raised */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-gray-100 transform hover:-translate-y-1 duration-300">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mb-6 mx-auto">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 text-center">$500M+</h3>
                            <p className="text-gray-600 text-center mt-2">Total Funds Raised</p>
                        </div>
                        
                        {/* People Helped */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 border border-gray-100 transform hover:-translate-y-1 duration-300">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mb-6 mx-auto">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 text-center">10M+</h3>
                            <p className="text-gray-600 text-center mt-2">People Helped</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* How It Works Section (Updated) */}
            <div className="py-20 bg-gradient-to-b from-white to-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Three simple steps to start your fundraising journey</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold border-4 border-white shadow-md">1</div>
                            <div className="bg-white p-8 pt-12 rounded-2xl shadow-md h-full">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
                                    <Rocket className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Campaign</h3>
                                <p className="text-gray-600">Set up your fundraiser in minutes. Add your story, photos, and fundraising goal.</p>
                            </div>
                        </div>
                        
                        {/* Step 2 - Replaced with Track Progress */}
                        <div className="relative">
                            <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold border-4 border-white shadow-md">2</div>
                            <div className="bg-white p-8 pt-12 rounded-2xl shadow-md h-full">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
                                    <Clock className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Track Your Progress</h3>
                                <p className="text-gray-600">Monitor donations in real-time with our intuitive dashboard and gain valuable insights.</p>
                            </div>
                        </div>
                        
                        {/* Step 3 */}
                        <div className="relative">
                            <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold border-4 border-white shadow-md">3</div>
                            <div className="bg-white p-8 pt-12 rounded-2xl shadow-md h-full">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
                                    <Gift className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Collect Donations</h3>
                                <p className="text-gray-600">Receive funds directly to your account. Track progress and thank your supporters.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center mt-12">
                        <button 
                            onClick={handleStartFund}
                            className="px-8 py-4 rounded-full text-white font-medium bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Start Your Campaign Today
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Enhanced Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
                        {/* Company Info */}
                        <div className="col-span-1 lg:col-span-1">
                            <div className="flex items-center mb-6">
                                <h2 className="text-3xl font-bold">
                                    <span className="text-green-400">Aid</span>
                                    <span className="text-green-300">Link</span>
                                </h2>
                            </div>
                            <p className="text-gray-400 mb-6">Making the world better through the power of community fundraising since 2010.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-green-600 hover:text-white transition-all duration-300">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-green-600 hover:text-white transition-all duration-300">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-green-600 hover:text-white transition-all duration-300">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-700">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>Home</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>About Us</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>How It Works</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>Success Stories</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>Blog</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Resources */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-700">Resources</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>Help Center</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>Fundraising Tips</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>Nonprofit Resources</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>Terms of Service</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        <span>Privacy Policy</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Contact */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-700">Stay Connected</h3>
                            <p className="text-gray-400 mb-6">Subscribe to our newsletter for updates on campaigns and success stories.</p>
                            <div>
                                <form className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="px-4 py-3 w-full rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-300 placeholder-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 whitespace-nowrap"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                            
                            <div className="mt-8">
                                <h4 className="text-white text-sm font-semibold mb-3">Contact Us</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>1234 Fundraising Way<br />San Francisco, CA 94107</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>support@aidlink.com</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>(123) 456-7890</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 pt-6 border-t border-gray-700">
                        <p className="text-center text-gray-400 text-sm">
                            © {new Date().getFullYear()} AidLink. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}