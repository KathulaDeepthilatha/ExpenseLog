import React from "react";
import TransactionForm from "./TransactionForm";

const CreditCard = ({ onTransactionAdded }) => {
  return (
    <div className="flex flex-col p-2">
      <h1 className="text-2xl font-semibold mb-2">Credit Card Purchases</h1>
      <TransactionForm buttonText="Add Purchase" type="expense" paymentMethod="Credit Card" onTransactionAdded={onTransactionAdded} />
      <h2 className="text-center mt-2">Deducts from Available Balance</h2>
    </div>
  );
};

export default CreditCard;