const executeOrder = async (cart) => {
    const audit_log = [];
    const orders = [];
    const stores = {};

    // Group items by store
    cart.forEach(item => {
        if (!stores[item.store]) {
            stores[item.store] = [];
        }
        stores[item.store].push(item);
    });

    const uniqueStores = Object.keys(stores);

    for (const store of uniqueStores) {
        // Delay to simulate API call (random 500ms delay as requested)
        const delay = Math.floor(Math.random() * 500) + 200;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Generate Fake Order ID: "AMZN-992", "SNACK-112"
        // I'll take the first 4 chars of the store name or similar logic
        const storeCode = store.substring(0, 4).toUpperCase(); // e.g., "Bulk" -> "BULK", "Luigi's" -> "LUIG"
        const orderId = `${storeCode}-${Math.floor(Math.random() * 900) + 100}`;

        // Calculate total authorized amount
        const authorizedAmount = stores[store].reduce((sum, item) => sum + item.price, 0);

        // Audit Log Entry
        audit_log.push(`Connecting to ${store}... Success. Authorized $${authorizedAmount}. Order #${orderId}.`);

        // Order Object
        orders.push({
            store: store,
            orderId: orderId,
            items: stores[store],
            total: authorizedAmount
        });
    }

    return {
        status: "complete",
        orders: orders,
        audit_log: audit_log
    };
};

module.exports = { executeOrder };
