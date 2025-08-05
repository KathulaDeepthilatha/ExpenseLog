import React, { useState } from "react";
import { Pencil, Trash2, Save } from "lucide-react";

const History = ({ transactions, onTransactionAdded }) => {
    const [editTransactionId, setEditTransactionId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [filter, setFilter] = useState("all"); // New state for filtering

    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return "0.00";
        return parseFloat(amount).toFixed(2);
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
    
    const getFormattedDateForInput = (dateString) => {
      return new Date(dateString).toISOString().slice(0, 10);
    };

    const handleEditClick = (transaction) => {
        setEditTransactionId(transaction._id);
        setEditedData({
            description: transaction.description,
            amount: transaction.amount,
            paymentMethod: transaction.paymentMethod,
            date: getFormattedDateForInput(transaction.date)
        });
    };

    const handleSaveClick = async (id) => {
        try {
            await fetch(`http://localhost:3001/api/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });
            setEditTransactionId(null);
            onTransactionAdded();
        } catch (error) {
            console.error("Failed to save transaction:", error);
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await fetch(`http://localhost:3001/api/transactions/${id}`, {
                    method: 'DELETE',
                });
                onTransactionAdded();
            } catch (error) {
                console.error("Failed to delete transaction:", error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Filter the transactions based on the selected filter
    const filteredTransactions = transactions.filter(transaction => {
      if (filter === "all") {
        return true;
      }
      if (filter === "creditCard") {
        return transaction.paymentMethod === "Credit Card";
      }
      if (filter === "upiCash") {
        return transaction.paymentMethod === "UPI" || transaction.paymentMethod === "Cash";
      }
      return true;
    });

    return (
        <div className="p-2">
            <h1 className="text-2xl font-semibold mb-2">History</h1>

            {/* Filter Buttons */}
            <div className="flex justify-between mb-4 bg-gray-100 rounded-md p-1">
                <button
                    onClick={() => setFilter("all")}
                    className={`flex-1 text-center py-1 rounded-md transition-colors ${
                        filter === "all" ? "bg-white text-black" : "text-gray-500"
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("upiCash")}
                    className={`flex-1 text-center py-1 rounded-md transition-colors ${
                        filter === "upiCash" ? "bg-white text-black" : "text-gray-500"
                    }`}
                >
                    UPI / Cash
                </button>
                <button
                    onClick={() => setFilter("creditCard")}
                    className={`flex-1 text-center py-1 rounded-md transition-colors ${
                        filter === "creditCard" ? "bg-white text-black" : "text-gray-500"
                    }`}
                >
                    Credit Card
                </button>
            </div>

            {filteredTransactions.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {filteredTransactions.map((transaction) => (
                        <li key={transaction._id} className="flex items-center justify-between p-2 border rounded-md">
                            {editTransactionId === transaction._id ? (
                                // Edit mode
                                <>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <input
                                            type="text"
                                            name="description"
                                            value={editedData.description}
                                            onChange={handleInputChange}
                                            className="font-semibold border rounded w-9/12 p-1"
                                        />
                                        <select
                                            name="paymentMethod"
                                            value={editedData.paymentMethod}
                                            onChange={handleInputChange}
                                            className="text-sm text-gray-600 border rounded w-9/12 p-1 mt-1"
                                        >
                                            <option value="UPI">UPI</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Credit Card">Credit Card</option>
                                        </select>
                                        <input
                                            type="date"
                                            name="date"
                                            value={editedData.date}
                                            onChange={handleInputChange}
                                            className="text-sm text-gray-600 border rounded w-9/12 p-1 mt-1"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            name="amount"
                                            value={editedData.amount}
                                            onChange={handleInputChange}
                                            className="w-20 text-right border rounded px-1 mr-2"
                                        />
                                        <button
                                            onClick={() => handleSaveClick(transaction._id)}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <Save size={16} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Display mode
                                <>
                                    <div className="flex-1">
                                        <div className="font-semibold flex items-baseline">
                                            {transaction.description}
                                            <span className="text-xs font-normal text-gray-500 ml-2">
                                                ({formatDate(transaction.date)})
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {transaction.paymentMethod}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`font-bold mr-4 ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                                            {transaction.type === 'expense' ? '-' : '+'} ₹{formatAmount(transaction.amount)}
                                        </div>
                                        <button
                                            onClick={() => handleEditClick(transaction)}
                                            className="text-gray-600 hover:text-black mr-2"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(transaction._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 mt-4">No transactions found for this month and filter.</p>
            )}
        </div>
    );
};

export default History;