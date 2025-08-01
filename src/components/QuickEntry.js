import React, { useState } from "react";
import TransactionForm from "./TransactionForm";

const QuickEntry = () => {
  const [entryType, setEntryType] = useState("expense");

  const handleTypeChange = (event) => {
    setEntryType(event.target.value);
  };

  return (
    <div className="flex flex-col p-2">
      <h1 className="text-2xl mb-6  font-semibold">
        <span className="text-4xl">+</span> Quick Entry
      </h1>
      <label className="flex items-center gap-2 mb-1 font-semibold cursor-pointer">
        <input
          type="radio"
          value="expense"
          checked={entryType === "expense"}
          onChange={handleTypeChange}
          className="accent-black"
        />
        Expense
      </label>
      <label className="flex items-center gap-2 font-semibold cursor-pointer">
        <input
          type="radio"
          value="credit"
          checked={entryType === "credit"}
          onChange={handleTypeChange}
          className="accent-black"
        />
        Credit
      </label>
      {entryType === "expense" && <TransactionForm buttonText="Add Expense" />}
      {entryType === "credit" && <TransactionForm buttonText="Add Credit" />}
    </div>
  );
};

export default QuickEntry;
