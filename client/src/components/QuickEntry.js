import React, { useState } from "react";
import TransactionForm from "./TransactionForm";

const QuickEntry = ({ onTransactionAdded }) => {
  const [entryType, setEntryType] = useState("expense");

  const handleTypeChange = (event) => {
    setEntryType(event.target.value);
  };
// Expense log
  return (
    <div className="flex flex-col p-2">
      <label className="flex items-center gap-2 mb-1 font-semibold cursor-pointer">
        <input
          type="radio"
          value="expense"
          checked={entryType === "expense"}
          onChange={handleTypeChange}
          className="accent-black"
        />
        Money Sent
      </label>
      <label className="flex items-center gap-2 font-semibold cursor-pointer">
        <input
          type="radio"
          value="credit"
          checked={entryType === "credit"}
          onChange={handleTypeChange}
          className="accent-black"
        />
        Money Received
      </label>
      {entryType === "expense" && <TransactionForm buttonText="Add Expense" type="expense" paymentMethod="UPI" onTransactionAdded={onTransactionAdded} />}
      {entryType === "credit" && <TransactionForm buttonText="Add Credit" type="credit" paymentMethod="UPI" onTransactionAdded={onTransactionAdded} />}
    </div>
  );
};

export default QuickEntry;