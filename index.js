const express = require('express');
const { searchInventory } = require('./data/hackathonInventory'); // This returns the whole inventory if no query
const { calculateNeeds } = require('./services/planner');
const { rankItems } = require('./services/rankingEngine');
const { explainChoice } = require('./services/llmService');
const { executeOrder } = require('./services/checkoutSimulator');
const { generateVoiceReport } = require('./services/voiceService');

const app = express();
const PORT = 5000;

app.use(express.json());

// Endpoint to get inventory
app.get('/api/inventory', (req, res) => {
    const { q } = req.query;
    const items = searchInventory(q);
    res.json(items);
});

// Endpoint for Voice Report
app.post('/api/speak', async (req, res) => {
    const { savings, deliveryDate, orderCount } = req.body;

    // Basic validation
    if (savings === undefined || !orderCount) {
        return res.status(400).json({ error: 'Missing required fields: savings, orderCount' });
    }

    const result = await generateVoiceReport({ savings, deliveryDate, orderCount });

    if (result.audio) {
        res.set('Content-Type', 'audio/mpeg');
        res.send(result.audio);
    } else {
        res.json(result); // Returns { audio: null, text: "Voice unavailable" }
    }
});

/**
 * Step 3: Create POST /api/plan
 * Receives: { people, budget, deadline }
 * Returns: { plan, reasoning_log, total_cost }
 */
app.post('/api/plan', async (req, res) => {
    const { people, budget, deadline } = req.body;

    if (!people || !budget || !deadline) {
        return res.status(400).json({ error: 'Missing required fields: people, budget, deadline' });
    }

    // 1. Calculate Needs
    const needs = calculateNeeds(people); // { cablePacks, pizzaCount, swagCount }

    // 2. Get Inventory
    const inventory = searchInventory(); // Get all

    // 3. Select Items Logic
    let totalCost = 0;
    const plan = []; // Changed to Array
    const reasoningLogs = [];

    // Agent: PLANNER
    reasoningLogs.push(`[PLANNER_AGENT]: Validated ${people} personnel. Calculated needs: ${needs.pizzaCount} pizzas, ${needs.cablePacks} cable packs.`);

    // Helper to process a category
    const processCategory = async (categoryName, quantityNeeded) => {
        // Agent: INVENTORY
        reasoningLogs.push(`[INVENTORY_BOT]: Scanning supply lines for '${categoryName}'...`);

        const categoryItems = inventory.filter(i => i.category.toLowerCase() === categoryName.toLowerCase());

        const strategy = req.body.strategy || 'cheapest';

        const validItems = rankItems(categoryItems, budget - totalCost, deadline, strategy);
        const rejectedItems = categoryItems.filter(i => i.deliveryDays > deadline);

        if (validItems.length > 0) {
            const selected = validItems[0];
            const cost = selected.price * quantityNeeded;

            // Agent: LOGIC_CORE
            reasoningLogs.push(`[LOGIC_CORE]: Found ${validItems.length} viable options. Selecting optimal unit: ${selected.name}.`);

            // Add to total cost
            totalCost += cost;

            // Agent: FINANCE_BOT
            reasoningLogs.push(`[FINANCE_BOT]: Allocating $${cost}. Remaining Budget: $${budget - totalCost}.`);

            // Add to plan
            plan.push({
                category: categoryName,
                name: selected.name,
                store: selected.store, // Added Store
                quantity: quantityNeeded,
                price: selected.price, // Unit price
                total: cost,
                deliveryDays: selected.deliveryDays
            });

            const explanation = await explainChoice(selected, rejectedItems, {
                budget: budget - totalCost,
                deadline
            });

            // Agent: STRATEGY_OFFICER (LLM)
            reasoningLogs.push(`[STRATEGY_OFFICER]: ${explanation}`);

        } else {
            // Handle error
            reasoningLogs.push(`[ERROR]: Could not find ${categoryName} arriving within ${deadline} days.`);
        }
    };

    // Calculate specific categories mapped to inventory categories
    await processCategory('Cables', needs.cablePacks);
    await processCategory('Food', needs.pizzaCount);
    await processCategory('Swag', needs.swagCount);

    reasoningLogs.push(`[SYSTEM]: Optimization Complete. Plan Ready.`);

    res.json({
        plan,
        reasoning: reasoningLogs.join('\n'), // Frontend expects a single string with newlines
        total_cost: totalCost
    });
});

/**
 * Step 3: Create POST /api/checkout
 * Receives: { cart }
 * Returns: { status: "complete", orders: [], audit_log: [] }
 */
app.post('/api/checkout', async (req, res) => {
    const { cart } = req.body;

    if (!cart) {
        return res.status(400).json({ error: "Cart is required" });
    }

    // If cart is array
    const result = await executeOrder(cart);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
