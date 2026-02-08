const OpenAI = require('openai');
require('dotenv').config();

let openai;
try {
    if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    } else {
        console.warn("OPENAI_API_KEY is missing. LLM explanations will be simulated.");
    }
} catch (e) {
    console.warn("Failed to initialize OpenAI client:", e.message);
}

// System Prompt
const SYSTEM_PROMPT = `You are a Logistics Officer. Explain why you picked Item A over Item B. Example: 'Chose the expensive cables because the cheap ones arrive after the hackathon starts.'`;

async function explainChoice(selectedItem, rejectedItems, context) {
    // Check if OpenAI client is initialized
    if (!openai) {
        return `Selected ${selectedItem.name} (Simulated Logic: LLM unavailable). Reason: It arrives in ${selectedItem.deliveryDays} days, within the ${context.deadline} day deadline. Rejected items were too late.`;
    }

    // If no rejection reason is apparent (e.g. only one choice), just state it.
    if (rejectedItems.length === 0) {
        return `Chose ${selectedItem.name} as it was the only viable option.`;
    }

    // Create a prompt focusing on the comparison
    // context: { budget_remaining, deadline }
    const userPrompt = `
    Context:
    - Deadline: ${context.deadline} days from now.
    - Budget Remaining: $${context.budget}.

    Selected Item:
    - Name: ${selectedItem.name}
    - Price: $${selectedItem.price}
    - Delivery Time: ${selectedItem.deliveryDays} days

    Rejected Items (and reasons):
    ${rejectedItems.map(item => `- ${item.name} ($${item.price}, ${item.deliveryDays} days)`).join('\n')}

    Explain the decision in one concise sentence logic.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 60,
            temperature: 0.7,
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("LLM Error:", error);
        return `Selected ${selectedItem.name}. (LLM explanation unavailable)`;
    }
}

module.exports = { explainChoice };
