const MonthlySetUp = () => {

    const [recurringItems, setRecurringItems] = useState([]);

    return(
        <div>
            <h1 className="text-2xl font-semibold mb-2">Monthly SetUp</h1>
            <div className="flex flex-col align-middle">
                <button type="submit" className="text-2xl align-middle mt-2 p-2 rounded-md border"><span className="text-3xl">+ </span>Add New Recurring Item</button>
            </div>
        </div>
    )
}

export default MonthlySetUp;