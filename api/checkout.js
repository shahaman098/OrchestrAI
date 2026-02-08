export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cart } = req.body;

  if (!cart || !Array.isArray(cart)) {
    return res.status(400).json({ error: "Invalid cart format. Expected an array of items." });
  }

  try {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 300) + 100));

      // Generate Fake Order ID
      const storeCode = store.substring(0, 4).toUpperCase();
      const orderId = `${storeCode}-${Math.floor(Math.random() * 900) + 100}`;

      // Calculate total authorized amount
      const authorizedAmount = stores[store].reduce((sum, item) => sum + item.price, 0);

      // Audit Log Entry
      audit_log.push(`Connecting to ${store}... Success. Authorized $${authorizedAmount.toFixed(2)}. Order #${orderId}.`);

      // Order Object
      orders.push({
        store: store,
        orderId: orderId,
        items: stores[store],
        total: authorizedAmount
      });
    }

    return res.status(200).json({
      status: "complete",
      orders: orders,
      audit_log: audit_log
    });
  } catch (error) {
    console.error("Checkout failed:", error);
    return res.status(500).json({ status: "error", message: "Checkout failed internally." });
  }
}
