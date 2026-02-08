const inventory = [
  // Cables (Tech)
  { id: 'tech-1', name: 'Generic Cat6 50-Pack', store: 'BulkTech Supplies', price: 50, deliveryDays: 5, category: 'Cables' },
  { id: 'tech-2', name: 'Pro-Gamer Braided 50-Pack', store: 'Elite Gear', price: 120, deliveryDays: 1, category: 'Cables' },
  { id: 'tech-3', name: 'Mixed Length Grab Bag', store: 'Tech Salvage', price: 40, deliveryDays: 3, category: 'Cables' },
  // Food
  { id: 'food-1', name: 'Gourmet Pizza Catering', store: "Luigi's Fine Pies", price: 15, deliveryDays: 0.04, category: 'Food' },
  { id: 'food-2', name: 'Frozen Bulk Pizza', store: 'Wholesale Grocer', price: 5, deliveryDays: 1, category: 'Food' },
  { id: 'food-3', name: 'Energy Bar Crate', store: 'FuelUp Nutrition', price: 3, deliveryDays: 2, category: 'Food' },
  // Swag
  { id: 'swag-1', name: 'Custom Hoodies', store: 'PrintMaster', price: 40, deliveryDays: 7, category: 'Swag' },
  { id: 'swag-2', name: 'Rush Printed Tees', store: 'SpeedyPrints', price: 15, deliveryDays: 2, category: 'Swag' },
  { id: 'swag-3', name: 'Generic Logo Stickers', store: 'StickerMule', price: 0.5, deliveryDays: 3, category: 'Swag' }
];

// Calculate needs based on people count
function calculateNeeds(peopleCount) {
  return {
    cablePacks: Math.ceil(peopleCount / 10),
    pizzaCount: Math.ceil(peopleCount / 2),
    swagCount: peopleCount
  };
}

// Rank items by strategy
function rankItems(items, deadline, strategy = 'cheapest') {
  const onTimeItems = items.filter(item => item.deliveryDays <= deadline);
  
  if (strategy === 'speed') {
    return onTimeItems.sort((a, b) => {
      if (a.deliveryDays === b.deliveryDays) return a.price - b.price;
      return a.deliveryDays - b.deliveryDays;
    });
  }
  
  // Default: cheapest first
  return onTimeItems.sort((a, b) => {
    if (a.price === b.price) return a.deliveryDays - b.deliveryDays;
    return a.price - b.price;
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { people, budget, deadline, strategy } = req.body;

  if (!people || !budget || !deadline) {
    return res.status(400).json({ error: 'Missing required fields: people, budget, deadline' });
  }

  const needs = calculateNeeds(people);
  const reasoningLines = [];
  const plan = [];
  let totalCost = 0;

  reasoningLines.push(`[PLANNER]: Calculating needs for ${people} attendees...`);
  reasoningLines.push(`[PLANNER]: Cable Packs: ${needs.cablePacks}, Pizza: ${needs.pizzaCount}, Swag: ${needs.swagCount}`);
  reasoningLines.push(`[RANKING]: Strategy: ${strategy || 'cheapest'}, Deadline: ${deadline} days, Budget: $${budget}`);

  // Cables
  const cables = inventory.filter(i => i.category === 'Cables');
  const rankedCables = rankItems(cables, deadline, strategy);
  if (rankedCables.length > 0) {
    const selected = rankedCables[0];
    const cost = selected.price * needs.cablePacks;
    totalCost += cost;
    plan.push({ ...selected, quantity: needs.cablePacks, totalPrice: cost });
    reasoningLines.push(`[CABLES]: Selected "${selected.name}" from ${selected.store} - $${selected.price} x ${needs.cablePacks} = $${cost}`);
  } else {
    reasoningLines.push(`[CABLES]: WARNING - No cables available within deadline!`);
  }

  // Food
  const food = inventory.filter(i => i.category === 'Food');
  const rankedFood = rankItems(food, deadline, strategy);
  if (rankedFood.length > 0) {
    const selected = rankedFood[0];
    const cost = selected.price * needs.pizzaCount;
    totalCost += cost;
    plan.push({ ...selected, quantity: needs.pizzaCount, totalPrice: cost });
    reasoningLines.push(`[FOOD]: Selected "${selected.name}" from ${selected.store} - $${selected.price} x ${needs.pizzaCount} = $${cost}`);
  } else {
    reasoningLines.push(`[FOOD]: WARNING - No food available within deadline!`);
  }

  // Swag
  const swag = inventory.filter(i => i.category === 'Swag');
  const rankedSwag = rankItems(swag, deadline, strategy);
  if (rankedSwag.length > 0) {
    const selected = rankedSwag[0];
    const cost = selected.price * needs.swagCount;
    totalCost += cost;
    plan.push({ ...selected, quantity: needs.swagCount, totalPrice: cost });
    reasoningLines.push(`[SWAG]: Selected "${selected.name}" from ${selected.store} - $${selected.price} x ${needs.swagCount} = $${cost}`);
  } else {
    reasoningLines.push(`[SWAG]: WARNING - No swag available within deadline!`);
  }

  reasoningLines.push(`[TOTAL]: Mission cost: $${totalCost.toFixed(2)} (Budget: $${budget})`);
  
  if (totalCost > budget) {
    reasoningLines.push(`[WARNING]: Over budget by $${(totalCost - budget).toFixed(2)}!`);
  } else {
    reasoningLines.push(`[SUCCESS]: Under budget by $${(budget - totalCost).toFixed(2)}!`);
  }

  return res.status(200).json({
    reasoning: reasoningLines.join('\n'),
    plan,
    total_cost: totalCost
  });
}
