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
    store: "Luigi's Fine Pies",
    price: 15,
    deliveryDays: 0.04,
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

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(inventory);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
