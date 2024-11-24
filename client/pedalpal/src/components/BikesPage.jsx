import React, { useEffect, useState } from "react";
import axios from 'axios'; 
import BikeCollection from "./BikeCollection";

function BikesPage() {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const serverURL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${serverURL}/bikes`);  // No need to include full URL
                console.log('Bikes data:', response.data);
                setBikes(response.data);
            } catch (err) {
                console.error('Error fetching bikes:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBikes();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading bikes...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">Error loading bikes: {error}</div>;
    }

    if (!bikes || bikes.length === 0) {
        return <div className="text-center p-4">No bikes available</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <BikeCollection bikes={bikes} />
        </div>
    );
}

export default BikesPage;