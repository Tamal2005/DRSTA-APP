import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "DRSTA - Smart Route & Vehicle Recommendation System | AI-Powered Transit" },
    { name: "description", content: "AI-powered route planning, vehicle recommendation, AI routing, shortest path calculations, smart vehicle suggestions based on passengers and luggage, transit optimization, smart transportation, mapbox routes" },
  ];
}

export default function Home() {
  return (
    <>
      <div id='home' className="w-full pt-20 max-w-4xl mx-auto flex flex-col items-center justify-between p-4 gap-5 pb-5">
        {/* Title */}
        <div className="text-center space-y-4 pt-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
            🚖 Smart Route & Vehicle Recommendation
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            A project that combines
            <span className="font-semibold"> maps, algorithms, and machine learning </span>
            to provide intelligent vehicle suggestions and optimized routes —
            similar to ride-hailing apps like Uber or Ola.
          </p>
        </div>

        {/* Features */}
        <div className="w-full bg-white/60 backdrop-blur-md rounded-xl p-5 sm:p-8 shadow-md space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">✨ Key Features</h2>
          <ul className="list-disc list-inside text-gray-700 text-base sm:text-lg space-y-1">
            <li>Interactive Map with real-time pickup & drop visualization</li>
            <li>Shortest path calculation using Dijkstra’s / A* (via Mapbox API)</li>
            <li>Vehicle recommendation based on passengers, luggage & distance</li>
            <li>Feedback system for testers & users</li>
          </ul>
        </div>

        {/* Dataset */}
        <div className="w-full bg-white/60 backdrop-blur-md rounded-xl p-5 sm:p-8 shadow-md space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold">🧠 ML Dataset Format</h2>
          <p className="text-gray-600 text-base sm:text-lg">
            The model is trained on structured trip data:
          </p>
          <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto text-left">
            {`source_lat, source_lon, dest_lat, dest_lon, passengers, luggage_kg, distance_km, travel_time_min, label_vehicle`}
          </pre>
        </div>

        {/* Tech Stack */}
        <div className="w-full bg-white/60 backdrop-blur-md rounded-xl p-5 sm:p-8 shadow-md space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold">⚙️ Tech Stack</h2>
          <p className="text-gray-600 text-base sm:text-lg">
            React (Remix + TailwindCSS) · Mapbox API · FastAPI · Python (ML)
          </p>
        </div>

        {/* Goal */}
        <div className="text-center max-w-2xl">
          <p className="mt-4 text-gray-700 text-base sm:text-lg">
            🚀 Goal: Build a scalable project that demonstrates
            <span className="font-semibold"> AI + Full-Stack integration </span>
            in real-world transport applications.
          </p>
        </div>
      </div>
    </>

  );
}
