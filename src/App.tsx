import React from "react";
import Timeline from "./components/Timeline";
import { timelineItems } from "./timelineItems.js";

function App() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Timeline Component
        </h1>
        <Timeline items={timelineItems} />
      </div>
    </div>
  );
}

export default App;
