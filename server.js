const express = require('express');
const inventoryData = require('./data/hackathonInventory');
const checkoutSimulator = require('./services/checkoutSimulator');

const app = express();
const port = 5000;

app.use(express.json());

// Load the inventory for serving
const inventory = inventoryData.searchInventory();

// GET /api/inventory
// Returns the full inventory list for debugging or frontend use
app.get('/api/inventory', (req, res) => {
    res.json(inventory);
});

// POST /api/checkout
// Fan-Out Simulation for Checkout
// Role: Transaction Architect
// Step 3: Create POST /api/checkout
// Returns { status: "complete", orders: [], audit_log: [] }
app.post('/api/checkout', async (req, res) => {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart)) {
        return res.status(400).json({ error: "Invalid cart format. Expected an array of items." });
    }

    try {
        const result = await checkoutSimulator.executeOrder(cart);
        res.json(result);
    } catch (error) {
        console.error("Checkout failed:", error);
        res.status(500).json({ status: "error", message: "Checkout failed internally." });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
