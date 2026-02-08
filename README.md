# OrchestrAI

AI shopping agent that discovers, ranks, and checks out products across multiple retailers in one conversation.

## Hack-Nation Hackathon - Challenge 11: Agentic Commerce

### Problem & Challenge

Online shopping is fragmented — buying from multiple retailers requires manually comparing prices, checking delivery times, and completing separate checkouts at each store, wasting hours on repetitive tasks.

### Target Audience

Event organizers, office managers, small business owners, and anyone who needs to purchase multiple items across different retailers under time and budget constraints.

### Solution & Core Features

OrchestrAI is an AI agent that handles shopping end-to-end:

1. **Intent Understanding** — Parses natural language requests and breaks them down into specific product needs
2. **Multi-Retailer Discovery** — Searches multiple stores simultaneously to find matching products
3. **Intelligent Ranking** — Scores and filters items by price and delivery time
4. **Unified Cart Building** — Combines the best items from different retailers into an optimized cart
5. **Simulated Checkout** — Executes orders across all stores in parallel with audit trail

### Unique Selling Proposition (USP)

Unlike price comparison tools that still require manual checkout, OrchestrAI provides true delegation — one conversation handles discovery, optimization, AND checkout across all retailers automatically.

### Results & Impact

OrchestrAI reduces multi-store shopping from hours to seconds. Users save time by eliminating manual comparison and separate checkouts, save money through automatic price optimization, and never miss deadlines with delivery-aware ranking.

---

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** React, Vite, Tailwind CSS
- **AI:** OpenAI API
- **Other:** Framer Motion, Lucide React

## Project Structure

```
OrchestrAI/
├── server.js                 # Express server entry point
├── services/
│   ├── planner.js            # Calculates item needs from requirements
│   ├── rankingEngine.js      # Ranks items by price/delivery
│   ├── checkoutSimulator.js  # Simulates multi-store checkout
│   ├── llmService.js         # OpenAI integration
│   └── voiceService.js       # Voice interface support
├── data/
│   └── hackathonInventory.js # Multi-retailer product inventory
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application
│   │   └── components/       # React components
│   └── ...
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shahaman098/OrchestrAI.git
cd OrchestrAI
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_api_key_here
```

### Running the Application

1. Start the backend server:
```bash
npm start
```
Server runs at http://localhost:5000

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
Frontend runs at http://localhost:5173

## API Endpoints

### GET /api/inventory
Returns the full product inventory from all retailers.

### POST /api/checkout
Executes checkout across multiple stores.

**Request Body:**
```json
{
  "cart": [
    { "name": "USB-C Cable Pack", "store": "BulkTech", "price": 24.99 },
    { "name": "Pizza Party Pack", "store": "Luigi's", "price": 89.99 }
  ]
}
```

**Response:**
```json
{
  "status": "complete",
  "orders": [...],
  "audit_log": [
    "Connecting to BulkTech... Success. Authorized $24.99. Order #BULK-123.",
    "Connecting to Luigi's... Success. Authorized $89.99. Order #LUIG-456."
  ]
}
```

## Demo Scenario

The demo showcases a hackathon supply ordering scenario:

> "I need supplies for 50 attendees arriving by Friday under $500"

OrchestrAI automatically:
- Calculates needs (5 cable packs, 25 pizzas, 50 swag items)
- Finds the best options across multiple vendors
- Ranks by price and delivery time
- Completes checkout in one conversational flow

## Team

Built for Hack-Nation Hackathon 2026

## License

MIT
