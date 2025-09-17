import React from "react";
import { Calendar } from "./components/Calendar";

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen">
      <h1 className="text-2xl font-bold text-center p-4">Month View Task Planner</h1>
      <Calendar />
    </div>
  );
};

export default App;