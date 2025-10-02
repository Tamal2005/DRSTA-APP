import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronUp } from 'lucide-react';
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Popup from "./PopupPage"

mapboxgl.accessToken =
    "pk.eyJ1IjoidGFtYWxkZWJuYXRoLTA3IiwiYSI6ImNtZzE2OXZvbDBuMWoycnF3bG5md2UyN24ifQ.puDh1Y5GFAbx0xEYkXd5nA";

export default function MapPage() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");
    const [weight, setWeight] = useState<number>(0);
    const [passengers, setPassengers] = useState(1);
    const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const dropMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [routeInfo, setRouteInfo] = useState<{ distance: string, duration: string, pickup?: string, drop?: string, result?: string | null } | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Only set isMounted on client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !mapContainerRef.current || map) return;
        const mapInstance = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [88.3639, 22.5726],
            zoom: 10,
        });
        mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right");
        setMap(mapInstance);

        return () => {
            mapInstance.remove();
        };
        // eslint-disable-next-line
    }, [isMounted]);

    const getRoute = async (pickupCoords: number[], dropCoords: number[]) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropCoords[0]},${dropCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || data.routes.length === 0) return;

        const routeData = data.routes[0];
        const route = routeData.geometry;

        // Extract distance and duration
        const distance = routeData.distance; // in meters
        const duration = routeData.duration; // in seconds

        // Format distance
        const distanceKm = (distance / 1000).toFixed(2);
        const distanceValue = (distance / 1000);

        // Format duration
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;

        // Update state for other uses (but don't rely on them for API call)

        let predictionResult = null;

        try {
            const response = await axios.post(
                "https://drsta-ml-api.onrender.com/api/call_for_prediction",
                {
                    passenger: passengers,
                    weight: weight,
                    distance: distanceValue, // Use the calculated value directly
                    time: minutes // Use the calculated value directly
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 10000
                }
            );

            predictionResult = response.data.prediction;
            setResult(response.data.prediction);
            console.log("Prediction:", response.data.prediction);
            setError(null);
        } catch (err) {
            console.error("Prediction API error:", err);
            setError("Something went wrong with the prediction!");
            setResult(null);
        }

        // Update state with route information (use the prediction result we just got)
        setRouteInfo({
            distance: `${distanceKm} km`,
            duration: formattedTime,
            pickup: pickup,
            drop: drop,
            result: predictionResult // Use the result we just got, not the state
        });

        // Show popup with route info
        setIsPopupOpen(true);

        if (map) {
            if (map.getLayer("route")) map.removeLayer("route");
            if (map.getSource("route")) map.removeSource("route");

            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: route,
                },
            });

            map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#ff0000",
                    "line-width": 5,
                },
            });

            const bounds = new mapboxgl.LngLatBounds();
            route.coordinates.forEach((coord: [number, number]) => bounds.extend(coord));
            map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
        }
    };

    const getCoordinates = async (place: string) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            place
        )}.json?access_token=${mapboxgl.accessToken}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.features || data.features.length === 0) {
            throw new Error("Location not found");
        }
        return data.features[0].center;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsFormOpen(false);

        if (pickup && drop && map) {
            try {
                setIsCalculating(true);
                setRouteInfo(null);
                setError(null);
                setResult(null)

                const pickupCoords = await getCoordinates(pickup);
                const dropCoords = await getCoordinates(drop);

                if (pickupMarkerRef.current) pickupMarkerRef.current.remove();
                if (dropMarkerRef.current) dropMarkerRef.current.remove();

                const marker1 = new mapboxgl.Marker({ color: "green" })
                    .setLngLat(pickupCoords)
                    .setPopup(new mapboxgl.Popup().setText("Pickup"))
                    .addTo(map);
                pickupMarkerRef.current = marker1;

                const marker2 = new mapboxgl.Marker({ color: "red" })
                    .setLngLat(dropCoords)
                    .setPopup(new mapboxgl.Popup().setText("Drop"))
                    .addTo(map);
                dropMarkerRef.current = marker2;

                await getRoute(pickupCoords, dropCoords);
            } catch (err) {
                alert("Unable to find one or both locations. Please check spelling.");
            } finally {
                setIsCalculating(false);
            }
        }
    };
    return (
        <div id="mappage" className="h-screen min-h-0 w-full font-inter bg-gray-100 flex flex-col">
            <div className="flex-1 min-h-0 h-full w-full">
                {isMounted && (
                    <div ref={mapContainerRef} className="h-full w-full min-h-0" />
                )}
            </div>

            {/* Collapsible Form */}
            <form
                onSubmit={handleSubmit}
                className={`
                fixed shadow-2xl rounded-2xl flex flex-col justify-center z-10 
                w-[90vw] max-w-md p-4 sm:p-6 md:p-8 
                lg:max-w-lg lg:min-h-[450px] 
                xl:max-w-xl xl:min-h-[450px] 
                backdrop-blur-lg bg-opacity-80
                transition-all duration-300
                ${isFormOpen
                        ? 'bottom-8 left-1/2 -translate-x-1/2 lg:top-1/2 lg:left-8 lg:translate-x-0 lg:-translate-y-1/2 lg:bottom-auto'
                        : '-bottom-full left-1/2 -translate-x-1/2 lg:top-1/2 lg:-left-full lg:translate-x-0 lg:-translate-y-1/2'
                    }
            `}
            >
                <div className="space-y-4 sm:space-y-6 mb-6">
                    <div>
                        <label htmlFor="pickup_location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Enter Pickup Location
                        </label>
                        <input
                            type="text"
                            id="pickup_location"
                            placeholder="Enter Pickup Location"
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            suppressHydrationWarning={true}
                        />
                    </div>

                    <div>
                        <label htmlFor="drop_location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Enter Drop Location
                        </label>
                        <input
                            type="text"
                            id="drop_location"
                            placeholder="Enter Drop Location"
                            value={drop}
                            onChange={(e) => setDrop(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            suppressHydrationWarning={true}
                        />
                    </div>

                    <div>
                        <label htmlFor="passengers" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Number of Passengers
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            step="1"
                            id="passengers"
                            value={passengers}
                            onChange={(e) => setPassengers(parseInt(e.target.value))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter the number of passengers"
                            required
                            suppressHydrationWarning={true}
                        />
                    </div>

                    <div>
                        <label htmlFor="luggage_weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Approx Weight of Luggage (in kgs)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            id="luggage_weight"
                            value={weight}
                            onChange={(e) => setWeight(parseInt(e.target.value))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Approx Weight of Luggage"
                            required
                            suppressHydrationWarning={true}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isCalculating}
                    className="w-auto self-center min-w-[120px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto sm:self-center sm:min-w-[120px]"
                    suppressHydrationWarning={true}
                >
                    Get Route
                </button>
            </form>

            {/* Toggle Button - Desktop (left Side) */}
            {!isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="hidden lg:flex fixed top-1/2 left-8 -translate-y-1/2 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300 z-20 items-center justify-center backdrop-blur-md"
                    style={{ background: 'rgba(37, 99, 235, 0.9)' }}
                    suppressHydrationWarning={true}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Toggle Button - Mobile (Bottom Right) */}
            {!isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="lg:hidden flex fixed bottom-8 left-1/2 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300 z-20 items-center justify-center backdrop-blur-md"
                    style={{ background: 'rgba(37, 99, 235, 0.9)' }}
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
            )}

            {/* Route Info Button */}
            {routeInfo && (
                <button
                    onClick={() => setIsPopupOpen(true)}
                >
                    View Route Details
                </button>
            )}

            {/* Loading Overlay */}
            {isCalculating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl max-w-sm mx-4">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Your Request</h3>
                            <p className="text-sm text-gray-600">Calculating route and analyzing vehicle recommendations...</p>
                            <p className="text-xs text-gray-500 mt-2">This may take a moment</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Component */}
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                routeInfo={routeInfo}
                loading={isCalculating}
            />
        </div>
    )
}
