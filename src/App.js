import React from "react";
import { createRoot } from "react-dom/client";
import FinancialSummary from "./components/FinancialSummary";
import "/index.css";
import QuickEntry from "./components/QuickEntry";
import MonthlySetUp from "./components/MonthlySetUp";
import CreditCard from "./components/CreditCard";
import History from "./components/History";

const App = () => {
  const [activeTab, setActiveTab] = React.useState("add");

  return (
    <div className="app-container">
      <div className="min-h-screen p-4">
        <h1 className="text-center text-4xl font-bold text-400 mt-1">
          Expense Tracker
        </h1>
        <FinancialSummary />

        <div className="flex justify-between mt-6 p-2 bg-gray-100 rounded-md mx-auto max-w-2xl text-slate-500 font-semibold">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 px-4 py-2 mx-1 rounded-md
                ${activeTab === "add" ? "bg-white text-black" : ""}`}
          >
            Add
          </button>
          <button
            onClick={() => setActiveTab("monthlySetUp")}
            className={`flex-1 px-4 py-2 mx-2 rounded-md 
                ${activeTab === "monthlySetUp" ? "bg-white text-black" : ""}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("credit")}
            className={`flex-1 px-4 py-2 mx-2 rounded-md  
                ${activeTab === "credit" ? "bg-white text-black" : ""}`}
          >
            Credit
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-2 mx-2 rounded-md  
                ${activeTab === "history" ? "bg-white text-black" : ""}`}
          >
            History
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 m-auto mt-2 max-w-2xl">
          {activeTab === "add" && <QuickEntry />}
          {activeTab === "monthlySetUp" && <MonthlySetUp />}
          {activeTab === "credit" && <CreditCard />}
          {activeTab === "history" && <History />}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
