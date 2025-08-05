import TransactionForm from "./TransactionForm";

const CreditCard = () => {
  return (
    <div className="flex flex-col p-2">
      <h1 className="text-2xl font-semibold mb-2">Credit Card Purchases</h1>
      {<TransactionForm buttonText="Add Purchase" />}
      <h2 className="text-center mt-3">Deducts from Available Balance</h2>
    </div>
  );
};

export default CreditCard;
