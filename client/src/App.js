import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import FinancialSummary from "./components/FinancialSummary";
import "/index.css";
import QuickEntry from "./components/QuickEntry";
import MonthlySetup from "./components/MonthlySetUp";
import CreditCard from "./components/CreditCard";
import History from "./components/History";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "./api";

const App = () => {
  // Get active tab from localStorage, default to 'add' if not found
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'add';
  });
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [summary, setSummary] = useState({
    availableBalance: 0,
    totalSpent: 0,
    creditsAdded: 0,
    outstandingCc: 0,
  });
  const [transactions, setTransactions] = useState([]);

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const monthYearString = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  
  const isCurrentMonth = 
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear();

  const fetchData = async (date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const summaryResponse = await fetch(`${API_URL}/api/summary?year=${year}&month=${month}`);
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);

      const transactionsResponse = await fetch(`${API_URL}/api/transactions?year=${year}&month=${month}`);
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentMonth);
  }, [currentMonth]);

  const handleTransactionAdded = () => {
    fetchData(currentMonth);
  };
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newDate = new Date(prevMonth);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    if (isCurrentMonth) return;
    setCurrentMonth(prevMonth => {
      const newDate = new Date(prevMonth);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };
  
  return (
    <div className="app-container">
      <div className="min-h-screen p-4">
        <h1 className="text-center text-4xl font-bold text-400 mt-1">
          Expense Tracker
        </h1>
        
        <div className="flex items-center justify-center my-4">
          <button onClick={handlePreviousMonth} className="p-2 rounded-md hover:bg-gray-200">
            <ChevronLeft />
          </button>
          <div className="text-xl font-semibold mx-4 w-32 text-center">
            {monthYearString}
          </div>
          <button 
            onClick={handleNextMonth} 
            className={`p-2 rounded-md ${isCurrentMonth ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            disabled={isCurrentMonth}
          >
            <ChevronRight />
          </button>
        </div>
        
        <div className="text-center">
          <button 
            onClick={goToCurrentMonth}
            disabled={isCurrentMonth}
            className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors
              ${isCurrentMonth ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            Go to Current Month
          </button>
        </div>
        
        <FinancialSummary summary={summary} />

        <div className="flex justify-between mt-6 p-2 bg-gray-100 rounded-md mx-auto max-w-2xl text-slate-500 font-semibold">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 px-4 py-2 mx-1 rounded-md
                ${activeTab === "add" ? "bg-white text-black" : ""}`}
          >
            Add
          </button>
          <button
            onClick={() => setActiveTab("credit")}
            className={`flex-1 px-4 py-2 mx-2 rounded-md 
                ${activeTab === "credit" ? "bg-white text-black" : ""}`}
          >
            Credit Card
          </button>
          {/* <button
            onClick={() => setActiveTab("monthlySetup")}
            className={`flex-1 px-4 py-2 mx-2 rounded-md 
                ${activeTab === "monthlySetup" ? "bg-white text-black" : ""}`}
          >
            Monthly
          </button> */}
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-2 mx-2 rounded-md  
                ${activeTab === "history" ? "bg-white text-black" : ""}`}
          >
            History
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 m-auto mt-2 max-w-2xl">
          {activeTab === "add" && <QuickEntry onTransactionAdded={handleTransactionAdded} />}
          {activeTab === "credit" && <CreditCard onTransactionAdded={handleTransactionAdded} />}
          {activeTab === "monthlySetup" && <MonthlySetup onTransactionAdded={handleTransactionAdded} />}
          {activeTab === "history" && <History transactions={transactions} onTransactionAdded={handleTransactionAdded} />}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);