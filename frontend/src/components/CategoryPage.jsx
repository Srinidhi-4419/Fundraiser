import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Thumbnail } from "../pages/Thumbnail";

export function CategoryPage() {
    const { category } = useParams();
    const [fundraisers, setFundraisers] = useState([]);

    useEffect(() => {
        const fetchCategoryFundraisers = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/fund/fundraisers/category/${category}`);
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
        <div className="pl-44 mt-10">
            <h1 className="text-[50px] font-semibold">{category} Fundraisers</h1>
            <div className="flex space-x-6 mt-6">
                {fundraisers.length > 0 ? (
                    fundraisers.map((fundraiser) => (
                        <Thumbnail
                            key={fundraiser._id}
                            id={fundraiser._id} // Pass the id as a prop
                            image={fundraiser.imageUrl}
                            title={fundraiser.title}
                            remaining={fundraiser.remainingAmount}
                            goal={fundraiser.targetAmount}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No fundraisers found for this category.</p>
                )}
            </div>
        </div>
    );
}