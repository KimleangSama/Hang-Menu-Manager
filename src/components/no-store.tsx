const NoStore = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">No Store Found</h1>
            <h3 className="text-lg">
                You do not have any store created yet. Please create a store to view store information.
            </h3>
            <h4 className="text-lg">
                Contact our support team to create store.
                <br />
                Phone: 012 345 6789
                <br />
                Telegram: @support
            </h4>
        </div>
    )
}

export default NoStore;