import React, { useState } from "react";
const API_URL = process.env.API_URL;
console.log("API URL:", API_URL);


const TransactionForm = ({ buttonText, type, paymentMethod, onTransactionAdded }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
   const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description || !amount) {
      alert("Please fill in both description and amount.");
      return;
    }

    const newTransaction = {
      description,
      amount: parseFloat(amount),
      type,
      paymentMethod,
      date: date || new Date().toISOString().slice(0, 10),
    };

    try {
      await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      // Reset form
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().slice(0, 10));
      
      // Notify parent to refetch data
      onTransactionAdded();
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="flex flex-col mt-3">
        <span className="font-semibold">Description</span>
        <input
          type="text"
          placeholder="Spent on..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 mt-1 border border-input rounded-md"
        />
      </label>
      <label className="flex flex-col">
        <span className="font-semibold">Amount(₹)</span>
        <input
          type="number"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 mt-1 border border-input rounded-md"
        />
      </label>
      <label className="flex flex-col">
        <span className="font-semibold">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 mt-1 border border-input rounded-md"
        />
      </label>
      <button
        type="submit"
        className="bg-black font-semibold text-white text-2xl align-middle mt-4 p-2 rounded-md"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default TransactionForm;