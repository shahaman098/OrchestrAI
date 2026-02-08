/**
 * Step 2: Create services/rankingEngine.js.
 * Scoring: Create rankItems(items, budget, deadline) that:
 * 1. Filters out late items (deliveryDays > deadline)
 * 2. Sorts by Price (ascending) by default.
 */

const rankItems = (items, budget, deadline, strategy = 'cheapest') => {
    if (!items || !items.length) {
        return [];
    }

    // 1. Filter out items that arrive after the deadline
    const onTimeItems = items.filter(item => {
        return item.deliveryDays <= deadline;
    });

    // 2. Sort based on strategy
    let sortedItems;
    if (strategy === 'speed') {
        // Sort by Delivery Days (ascending), then Price
        sortedItems = onTimeItems.sort((a, b) => {
            if (a.deliveryDays === b.deliveryDays) {
                return a.price - b.price;
            }
            return a.deliveryDays - b.deliveryDays;
        });
    } else {
        // Default: Sort by Price (ascending) - cheapest first, then Delivery Days
        sortedItems = onTimeItems.sort((a, b) => {
            if (a.price === b.price) {
                return a.deliveryDays - b.deliveryDays;
            }
            return a.price - b.price;
        });
    }

    return sortedItems;
};

module.exports = { rankItems };
