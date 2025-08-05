const TransactionForm = ({ buttonText }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col mt-3">
        <span className="font-semibold">Description</span>
        <input
          type="text"
          placeholder="Spent on..."
          className="p-2 mt-1 border border-input rounded-md"
        />
      </label>
      <label className="flex flex-col">
        <span className="font-semibold">Amount(₹)</span>
        <input
          type="number"
          placeholder="60"
          className="p-2 mt-1 border border-input rounded-md"
        />
      </label>
      <button
        type="submit"
        className="bg-black font-semibold text-white text-2xl align-middle mt-4 p-2 rounded-md"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default TransactionForm;
