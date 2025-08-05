import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const MonthlySetup = ({ onTransactionAdded }) => {
  const [recurringItems, setRecurringItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    amount: "",
    paymentMethod: "UPI",
  });
  const [editItemId, setEditItemId] = useState(null);
  // New state for the date of applied recurring items
  const [applyDate, setApplyDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchRecurringItems();
  }, []);

  const fetchRecurringItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recurring-items');
      const data = await response.json();
      setRecurringItems(data);
    } catch (error) {
      console.error("Failed to fetch recurring items:", error);
    }
  };

  const handleAdd = async () => {
    if (!newItem.description || !newItem.amount) return;

    try {
      const response = await fetch('http://localhost:3001/api/recurring-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const addedItem = await response.json();

      setRecurringItems([...recurringItems, addedItem]);
      setNewItem({ description: "", amount: "", paymentMethod: "UPI" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add recurring item:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewItem({ description: "", amount: "", paymentMethod: "UPI" });
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const togglePaymentMethod = async (id) => {
    const options = ["UPI", "Cash", "CC"];
    const currentItem = recurringItems.find(item => item._id === id);
    if (!currentItem) return;
    const newMethod = options[(options.indexOf(currentItem.paymentMethod) + 1) % options.length];
    
    try {
      await fetch(`http://localhost:3001/api/recurring-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: newMethod }),
      });

      setRecurringItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, paymentMethod: newMethod } : item
        )
      );
    } catch (error) {
      console.error("Failed to update payment method:", error);
    }
  };

  const handleEdit = (id) => {
    setEditItemId(id);
  };

  const handleAmountChange = (id, newAmount) => {
    setRecurringItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, amount: newAmount } : item))
    );
  };

  const handleBlur = async (id, newAmount) => {
    if (editItemId === id) {
      try {
        await fetch(`http://localhost:3001/api/recurring-items/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: newAmount }),
        });
        setEditItemId(null);
      } catch (error) {
        console.error("Failed to update amount:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:3001/api/recurring-items/${id}`, {
          method: 'DELETE',
        });
        setRecurringItems((prev) => prev.filter((item) => item._id !== id));
        setSelectedItems((prev) => prev.filter((item) => item !== id));
      } catch (error) {
        console.error("Failed to delete recurring item:", error);
      }
    }
  };

  const handleApplySelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      await fetch('http://localhost:3001/api/recurring-items/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedIds: selectedItems, date: applyDate }),
      });
      alert('Selected items have been added to this month!');
      setSelectedItems([]);
      onTransactionAdded(); // Notify parent to refresh data
    } catch (error) {
      console.error("Failed to apply recurring items:", error);
    }
  };

  return (
    <div className="flex flex-col p-2">
      <h1 className="text-2xl mb-6 font-semibold">Monthly Setup</h1>

      {/* Recurring Items List */}
      {recurringItems.map((item) => (
        <div
          key={item._id}
          className="flex items-center mb-2 border p-2 rounded-md"
        >
          <input
            type="checkbox"
            checked={selectedItems.includes(item._id)}
            onChange={() => handleCheckboxChange(item._id)}
            className="form-checkbox accent-black text-black mr-3"
          />
          <div className="flex-1">
            <div className="font-semibold">{item.description}</div>
            <button
              onClick={() => togglePaymentMethod(item._id)}
              className="text-sm text-gray-600 font-medium border rounded-md w-10 bg-gray-300"
            >
              {item.paymentMethod}
            </button>
          </div>

          {editItemId === item._id ? (
            <input
              type="number"
              className="w-16 border rounded px-1 text-right text-sm mr-2"
              value={item.amount}
              onChange={(e) => handleAmountChange(item._id, e.target.value)}
              onBlur={(e) => handleBlur(item._id, e.target.value)}
            />
          ) : (
            <div className="text-sm font-semibold mr-2 block">
              ₹{item.amount}
            </div>
          )}

          <button
            onClick={() => handleEdit(item._id)}
            className="text-gray-600 hover:text-black mr-2"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      
      {/* Date input for applying recurring items */}
      <label className="flex flex-col mt-4">
        <span className="font-semibold">Apply Date</span>
        <input
          type="date"
          value={applyDate}
          onChange={(e) => setApplyDate(e.target.value)}
          className="w-full mb-2 border px-2 py-1 rounded"
        />
      </label>

      {/* Add to This Month Button */}
      <button
        onClick={handleApplySelected}
        disabled={selectedItems.length === 0}
        className={`mt-4 w-full py-2 rounded-md font-semibold ${
          selectedItems.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        Add Selected to This Month
      </button>

      {/* Add New Recurring Item Section */}
      {showForm ? (
        <div className="mt-4 border-t pt-4">
          <label className="flex flex-col">
            <span className="font-semibold">Description</span>
            <input
              type="text"
              placeholder="Train ticket"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full mb-2 border px-2 py-1 rounded"
            />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold">Amount</span>
            <input
              type="number"
              placeholder="900"
              value={newItem.amount}
              onChange={(e) =>
                setNewItem({ ...newItem, amount: e.target.value })
              }
              className="w-full mb-2 border px-2 py-1 rounded"
            />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold">Payment Method</span>
            <select
              value={newItem.paymentMethod}
              onChange={(e) =>
                setNewItem({ ...newItem, paymentMethod: e.target.value })
              }
              className="w-full mb-2 border px-2 py-1 rounded"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </label>

          <div className="flex justify-start mt-4 gap-8">
            <button
              onClick={handleAdd}
              className="bg-black w-2/12 text-white px-4 py-1 rounded"
            >
              Add
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 w-2/12 text-white px-4 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full py-2 bg-white text-black rounded-md border hover:bg-black hover:text-white"
        >
          <span className="text-2xl">+</span> Add New Recurring Item
        </button>
      )}
    </div>
  );
};

export default MonthlySetup;