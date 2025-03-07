import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../pages/Card";
import { Thumbnail } from "../pages/Thumbnail";

export function Funds() {
    const navigate = useNavigate();
    const [fundraisers, setFundraisers] = useState({});

    const categories = [
        "Community",
        "Arts & Culture",
        "Other"
    ];

    useEffect(() => {
        const fetchFundraisers = async () => {
            try {
                const fetchedData = {};
                for (const category of categories) {
                    const response = await fetch(`http://localhost:3000/api/fund/fundraisers/category/${category}`);
                    if (response.ok) {
                        const data = await response.json();
                        fetchedData[category] = data.slice(0, 3); // Get only 3 fundraisers
                    } else {
                        fetchedData[category] = [];
                    }
                }
                setFundraisers(fetchedData);
            } catch (error) {
                console.error("Error fetching fundraisers:", error);
            }
        };
        fetchFundraisers();
    }, []);

    return (
        <div className="flex flex-col bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col items-start">
                        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                            Browse fundraisers
                            <br />
                            <span className="text-green-600">by categories</span>
                        </h1>
                        <p className="text-lg text-gray-600 mt-6 max-w-2xl">
                            People around the world are raising money for what they are passionate about.
                            Join them today and make a difference.
                        </p>
                        <button 
                            className="mt-8 bg-green-600 hover:bg-green-700 text-white text-lg font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center"
                            onClick={() => navigate('/create')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Start a Fundraiser
                        </button>
                    </div>
                </div>
            </div>

            {/* Static Cards Section - Original Layout */}
            <div className="flex space-x-12 pl-44 pt-8">
                <Card src={"https://static.vecteezy.com/system/resources/previews/023/785/748/original/wolf-icon-logo-design-vector.jpg"} label={"Animal"}/>
                <Card src={"https://static.vecteezy.com/system/resources/previews/021/734/182/non_2x/book-and-graduation-cap-icon-isolated-on-white-background-vector.jpg"} label={"Education"}/>
                <Card src={"https://th.bing.com/th/id/OIP.T2AwX0iwHgXba1MIOr9x3QHaIu?rs=1&pid=ImgDetMain"} label={"Medical"}/>
                <Card src={"https://cdn-icons-png.flaticon.com/256/410/410727.png"} label={"Disaster Relief"}/>
                <Card src={"https://th.bing.com/th/id/OIP.vg9zDM-enCPnL2P5UiR4wAHaHa?w=626&h=626&rs=1&pid=ImgDetMain"} label={"Environment"}/>
                <Card src={"https://static.vecteezy.com/system/resources/previews/009/111/362/original/community-group-three-people-help-icon-in-flat-style-youth-symbol-persons-team-partnership-for-web-site-design-logo-app-leadership-connection-meeting-vector.jpg"} label={"Community"}/>
            </div>
            <div className="flex space-x-12 pl-44 pt-8">
                <Card src={"https://i.pinimg.com/736x/9f/d1/a1/9fd1a1d4e8a29727d610daab8b100eeb.jpg"} label={"Sports"}/>
                <Card src={"https://thumbs.dreamstime.com/z/technology-icon-trendy-flat-vector-white-background-illustration-can-be-use-web-mobile-234033305.jpg"} label={"Technology"}/>
                <Card src={"https://th.bing.com/th/id/OIP.fRP8qjP8sywOBbXIQJwoSAHaHk?rs=1&pid=ImgDetMain"} label={"Arts & Culture"}/>
                <Card src={"https://images.squarespace-cdn.com/content/v1/5a454bd86f4ca3db98061e83/1527001268607-CGO5SFC8D1WOWXTYDAAB/ke17ZwdGBToddI8pDm48kADzdkGl2YhmIxuLexyu3Zd7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UUcJ_O4DG2L7Dm589G95rtYP7DHTtgVffNOAgX4FWVEyMW9u6oXQZQicHHG1WEE6fg/Business+Icons+Vol.1+-+With+Artboards-17.png"} label={"Business"}/>
                <Card src={"https://static.vecteezy.com/system/resources/previews/008/822/958/original/winner-podium-icon-with-standing-people-symbol-vector.jpg"} label={"Competition"}/>
                <Card src={"https://icon-library.com/images/others-icon/others-icon-15.jpg"} label={"Others"}/>
            </div>

            {/* Dynamic Fundraisers by Category - Enhanced Layout */}
            {categories.map((category) => (
                <div key={category} className="mt-10 pl-44">
                    <div className="flex justify-between items-center mb-4 pr-44">
                        <h2 className="text-2xl font-semibold">{category} Fundraisers</h2>
                        <button className="text-green-600 hover:text-green-700 font-medium flex items-center">
                            View all
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex space-x-6">
                        {fundraisers[category]?.length > 0 ? (
                            fundraisers[category].map((fundraiser) => (
                                <div 
                                    key={fundraiser._id}
                                    className="transition-transform duration-300 hover:-translate-y-1"
                                >
                                    <Thumbnail 
                                        image={fundraiser.imageUrl} 
                                        title={fundraiser.title} 
                                        remaining={fundraiser.remainingAmount} 
                                        goal={fundraiser.targetAmount} 
                                        id={fundraiser._id}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center w-full">
                                <p className="text-gray-500">No fundraisers available in this category yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            
            {/* Call to Action Section */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 py-12 my-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to start your own fundraiser?</h2>
                    <p className="text-green-100 text-lg mb-6">
                        Join thousands of people making a difference. It takes just a few minutes to get started.
                    </p>
                    <button 
                        className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={() => navigate('/create')}
                    >
                        Start a Fundraiser
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Funds;