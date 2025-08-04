import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const MonthlySetUp = () => {
  const [recurringItems, setRecurringItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    amount: "",
    paymentMethod: "UPI",
  });
  const [editItemId, setEditItemId] = useState(null);

  const handleAdd = () => {
    if (!newItem.description || !newItem.amount) return;

    const itemToAdd = {
      ...newItem,
      id: Date.now(),
    };
    setRecurringItems([...recurringItems, itemToAdd]);
    setNewItem({ description: "", amount: "", paymentMethod: "UPI" });
    setShowForm(false);
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

  const togglePaymentMethod = (id) => {
    const options = ["UPI", "Cash", "Credit Card"];
    setRecurringItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              paymentMethod:
                options[
                  (options.indexOf(item.paymentMethod) + 1) % options.length
                ],
            }
          : item
      )
    );
  };

  const handleEdit = (id) => {
    setEditItemId(id);
  };

  const handleAmountChange = (id, newAmount) => {
    setRecurringItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: newAmount } : item
      )
    );
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      setRecurringItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="flex flex-col p-2">
      <h1 className="text-2xl mb-6 font-semibold">Monthly Setup</h1>

      {/* Recurring Items List */}
      {recurringItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center mb-2 border p-2 rounded-md"
        >
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleCheckboxChange(item.id)}
            className="form-checkbox text-black mr-3"
          />
          <div className="flex-1">
            <div className="font-semibold">{item.description}</div>
            <button
              onClick={() => togglePaymentMethod(item.id)}
              className="text-sm text-gray-600 underline hover:text-black"
            >
              {item.paymentMethod}
            </button>
          </div>

          {editItemId === item.id ? (
            <input
              type="number"
              className="w-16 border rounded px-1 text-right text-sm mr-2"
              value={item.amount}
              onChange={(e) => handleAmountChange(item.id, e.target.value)}
              onBlur={() => setEditItemId(null)}
            />
          ) : (
            <div className="text-sm font-semibold mr-2 block">
              ₹{item.amount}
            </div>
          )}

          <button
            onClick={() => handleEdit(item.id)}
            className="text-gray-600 hover:text-black mr-2"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {/* Add to This Month Button */}
      <button
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
              placeholder="Description"
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
              placeholder="Amount"
              value={newItem.amount}
              onChange={(e) =>
                setNewItem({ ...newItem, amount: e.target.value })
              }
              className="w-full mb-2 border px-2 py-1 rounded"
            />
          </label>
          <label className="flex flex-col">
            Payment Method
            <select
              value={newItem.paymentMethod}
              onChange={(e) =>
                setNewItem({ ...newItem, paymentMethod: e.target.value })
              }
              className="w-full my-2 border px-2 py-1 rounded"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </label>
          <div className="flex justify-between">
            <button
              onClick={handleAdd}
              className="bg-black text-white px-4 py-1 rounded"
            >
              Add
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full py-2 bg-white border text-black rounded"
        >
         <span className="text-2xl">+</span> Add New Recurring Item
        </button>
      )}
    </div>
  );
};

export default MonthlySetUp;
