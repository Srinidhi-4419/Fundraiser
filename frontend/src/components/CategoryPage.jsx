import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Thumbnail } from "../pages/Thumbnail";

export function CategoryPage() {
    const { category } = useParams();
    const [fundraisers, setFundraisers] = useState([]);

    useEffect(() => {
        const fetchCategoryFundraisers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fund/fundraisers/category/${category}`);
                if (response.ok) {
                    const data = await response.json();
                    setFundraisers(data);
                } else {
                    setFundraisers([]);
                }
            } catch (error) {
                console.error("Error fetching fundraisers:", error);
            }
        };

        fetchCategoryFundraisers();
    }, [category]);

    return (
        <div className="lg:pl-44 px-4 sm:px-6 mt-10">
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-semibold">{category} Fundraisers</h1>
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-6">
                {fundraisers.length > 0 ? (
                    fundraisers.map((fundraiser) => (
                        <div key={fundraiser._id} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-auto">
                            <Thumbnail
                                id={fundraiser._id}
                                image={fundraiser.imageUrl}
                                title={fundraiser.title}
                                remaining={fundraiser.remainingAmount}
                                goal={fundraiser.targetAmount}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No fundraisers found for this category.</p>
                )}
            </div>
        </div>
    );
}