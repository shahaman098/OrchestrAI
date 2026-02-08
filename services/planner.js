/**
 * Step 1: Create services/planner.js.
 * Math Logic: Create a function calculateNeeds(peopleCount) that returns: { cablePacks: ceil(people/10), pizzaCount: ceil(people/2), swagCount: people }. Hardcode this math.
 */

const calculateNeeds = (peopleCount) => {
    return {
        cablePacks: Math.ceil(peopleCount / 10),
        pizzaCount: Math.ceil(peopleCount / 2),
        swagCount: peopleCount
    };
};

module.exports = { calculateNeeds };
