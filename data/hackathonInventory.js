const inventory = [
  // Cables (Tech)
  {
    id: 'tech-1',
    name: 'Generic Cat6 50-Pack',
    store: 'BulkTech Supplies',
    price: 50,
    deliveryDays: 5,
    category: 'Cables',
    tags: ['networking', 'bulk', 'budget']
  },
  {
    id: 'tech-2',
    name: 'Pro-Gamer Braided 50-Pack',
    store: 'Elite Gear',
    price: 120,
    deliveryDays: 1,
    category: 'Cables',
    tags: ['networking', 'premium', 'fast-delivery']
  },
  {
    id: 'tech-3',
    name: 'Mixed Length Grab Bag',
    store: 'Tech Salvage',
    price: 40,
    deliveryDays: 3,
    category: 'Cables',
    tags: ['networking', 'random', 'discount']
  },

  // Food (Snacks)
  {
    id: 'food-1',
    name: 'Gourmet Pizza Catering',
    store: 'Luigi\'s Fine Pies',
    price: 15, // Per person, represented as unit price
    deliveryDays: 0.04, // 1 hour is ~0.04 days
    category: 'Food',
    tags: ['catering', 'hot', 'premium']
  },
  {
    id: 'food-2',
    name: 'Frozen Bulk Pizza',
    store: 'Wholesale Grocer',
    price: 5,
    deliveryDays: 1,
    category: 'Food',
    tags: ['frozen', 'bulk', 'budget']
  },
  {
    id: 'food-3',
    name: 'Energy Bar Crate',
    store: 'FuelUp Nutrition',
    price: 3,
    deliveryDays: 2,
    category: 'Food',
    tags: ['snacks', 'healthy', 'bulk']
  },

  // Swag (Merch)
  {
    id: 'swag-1',
    name: 'Custom Hoodies',
    store: 'PrintMaster',
    price: 40,
    deliveryDays: 7,
    category: 'Swag',
    tags: ['clothing', 'custom', 'premium']
  },
  {
    id: 'swag-2',
    name: 'Rush Printed Tees',
    store: 'SpeedyPrints',
    price: 15,
    deliveryDays: 2,
    category: 'Swag',
    tags: ['clothing', 'custom', 'fast']
  },
  // Adding a 3rd option for Swag as requested "Create 3 Options per Category"
  // The user listed items: Option A, Option B for swag. But earlier said "Create 3 Options per Category".
  // Wait, looking at the user request:
  // Swag (Merch):
  // Option A: "Custom Hoodies" ($40/unit, 7 day delivery).
  // Option B: "Rush Printed Tees" ($15/unit, 2 day delivery).
  // It seems they missed Option C in the text, but the requirement "Create 3 Options per Category" is explicit.
  // I will add a third option for Swag.
  {
    id: 'swag-3',
    name: 'Generic Logo Stickers',
    store: 'StickerMule',
    price: 0.5,
    deliveryDays: 3,
    category: 'Swag',
    tags: ['accessories', 'cheap', 'promo']
  }
];

function searchInventory(query) {
  if (!query) return inventory;
  const lowerQuery = query.toLowerCase();
  return inventory.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    item.category.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

module.exports = { searchInventory };
