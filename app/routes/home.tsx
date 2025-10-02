import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "DRSTA" },
    { name: "description", content: "Demand responsive system transit analysis with AI for optimized route planning" },
  ];
}

export default function Home() {
  return (
    <div className="w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">🚖 Smart Route & Vehicle Recommendation</h1>
      <p className="text-gray-600 text-lg">
        A project that combines <span className="font-semibold">maps, algorithms, and machine learning </span>
         to provide intelligent vehicle suggestions and optimized routes,
        similar to ride-hailing apps like Uber or Ola.
      </p>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">✨ Key Features</h2>
        <ul className="list-disc list-inside text-gray-700 text-left">
          <li>Interactive Map with real-time pickup & drop visualization</li>
          <li>Shortest path calculation using Dijkstra’s / A* (via Mapbox API)</li>
          <li>Vehicle recommendation based on passengers, luggage & distance</li>
          <li>Feedback system for testers & users</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">🧠 ML Dataset Format</h2>
        <p className="text-gray-600">
          The model is trained on structured trip data:
        </p>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto text-left">
          {`source_lat, source_lon, dest_lat, dest_lon, passengers, luggage_kg, distance_km, travel_time_min, label_vehicle`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">⚙️ Tech Stack</h2>
        <p className="text-gray-600">
          React (Remix + TailwindCSS) · Mapbox API · FastAPI · Python (ML)
        </p>
      </div>

      <p className="mt-4 text-gray-700">
        🚀 Goal: Build a scalable project that demonstrates
        <span className="font-semibold"> AI + Full-Stack integration </span>
        in real-world transport applications.
      </p>
    </div>
  );
}
