import React from "react";

const FinancialSummary = ({ summary }) => {
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  return (
    <div className="bg-white font-semibold border border-gray-300 rounded-xl shadow-md p-6 m-auto mt-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Financial Summary</h1>
      
      <div className="flex justify-between items-center mb-2">
        <p>Available Balance:</p>
        <p className="font-semibold text-lg text-green-500">₹{formatAmount(summary.availableBalance)}</p>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <p>Total Spent:</p>
        <p className="font-semibold text-lg text-red-500">₹{formatAmount(summary.totalSpent)}</p>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <p>Credits Added:</p>
        <p className="font-semibold text-lg text-blue-500">₹{formatAmount(summary.creditsAdded)}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <p>Outstanding CC:</p>
        <p className="font-semibold text-lg text-orange-500">₹{formatAmount(summary.outstandingCc)}</p>
      </div>
    </div>
  );
};

export default FinancialSummary;