// Fun personality responses based on user choices and system state
export const getPersonalityComment = (people, budget, days, strategy) => {
    const comments = {
        // Budget-related sass
        richMode: [
            "Woah there, Mr. Moneybags! 💰",
            "Someone's feeling generous today!",
            "Budget? More like 'No budget!' 🚀",
            "Are you throwing a party or launching a startup? 💎"
        ],
        brokeMode: [
            "Ramen budget detected 🍜",
            "Living on the edge, I see...",
            "Budget so tight it squeaks! 😅",
            "Penny-pinching mode: ACTIVATED 💸"
        ],

        // People-related
        massiveEvent: [
            "That's basically a small army! 🎖️",
            "Hope you ordered extra pizza! 🍕🍕🍕",
            "200 nerds in one room? RIP WiFi 📡",
            "Time to rent a stadium! 🏟️"
        ],
        smallEvent: [
            "Cozy gathering mode activated! ☕",
            "Small but mighty! 💪",
            "Elite squad vibes 🎯",
            "Quality over quantity! ✨"
        ],

        // Days/Time-related
        panicMode: [
            "🚨 PANIC MODE ENGAGED! 🚨",
            "1 day? Are you serious?! 😱",
            "Someone forgot to plan ahead...",
            "Hold my coffee, we're going FAST ⚡"
        ],
        chillMode: [
            "Taking it slow and steady 🐢",
            "We've got all the time in the world! 🌙",
            "Relax mode: Planning like a pro 😎",
            "No rush, no stress! ☕"
        ],

        // Strategy combo reactions
        speedAndBroke: [
            "Fast AND cheap? Pick a struggle! 😂",
            "You want miracles on a budget? Bold. 🎲",
            "Speed costs money... but let's try! 💨"
        ],
        richAndSlow: [
            "Money to burn and all the time? Living the dream! 🌟",
            "Premium planning mode activated 💎",
            "Slow down there, perfectionist! 🎨"
        ],

        // General encouragement
        balanced: [
            "Perfectly balanced, as all things should be ⚖️",
            "Smart choices! This should work beautifully 🎯",
            "Goldilocks mode: Just right! 🐻",
            "The sweet spot detected! 🎪"
        ]
    };

    // Determine which comment to show
    if (days === 1) return comments.panicMode[Math.floor(Math.random() * comments.panicMode.length)];
    if (days >= 7) return comments.chillMode[Math.floor(Math.random() * comments.chillMode.length)];
    if (budget >= 5000) return comments.richMode[Math.floor(Math.random() * comments.richMode.length)];
    if (budget <= 1000) return comments.brokeMode[Math.floor(Math.random() * comments.brokeMode.length)];
    if (people >= 100) return comments.massiveEvent[Math.floor(Math.random() * comments.massiveEvent.length)];
    if (people <= 25) return comments.smallEvent[Math.floor(Math.random() * comments.smallEvent.length)];
    if (strategy === 'speed' && budget <= 2000) return comments.speedAndBroke[Math.floor(Math.random() * comments.speedAndBroke.length)];
    if (budget >= 5000 && days >= 7) return comments.richAndSlow[Math.floor(Math.random() * comments.richAndSlow.length)];

    return comments.balanced[Math.floor(Math.random() * comments.balanced.length)];
};

export const getAgentQuip = (agentName) => {
    const quips = {
        PLANNER: [
            "Crunching numbers like a boss...",
            "Planning world domination... I mean, your event!",
            "Math wizard at work 🧙‍♂️",
            "Calculating the impossible..."
        ],
        INVENTORY: [
            "Scanning the supply matrix...",
            "Hunting for deals like a pro!",
            "Inventory wizard summoned! 🔮",
            "Checking all the shelves..."
        ],
        LOGIC: [
            "Logic circuits firing! ⚡",
            "Running the algorithms...",
            "Computing optimal paths...",
            "Beep boop... making smart choices! 🤖"
        ],
        FINANCE: [
            "Money talks, I listen 💰",
            "Balancing those books!",
            "Budget guardian activated 🛡️",
            "Cha-ching! Counting dollars..."
        ],
        STRATEGY: [
            "Master plan in progress...",
            "Strategic genius mode ON! 🎯",
            "Orchestrating the perfect plan...",
            "Big brain time! 🧠"
        ]
    };

    const agent = agentName.replace('_AGENT', '').replace('_BOT', '').replace('_CORE', '').replace('_OFFICER', '');
    return quips[agent]?.[Math.floor(Math.random() * (quips[agent]?.length || 1))] || "Working hard...";
};

export const getLoadingQuip = () => {
    const quips = [
        "Teaching robots to shop... 🤖",
        "Negotiating with the supply chain gods...",
        "Asking AI nicely for help...",
        "Consulting the ancient scrolls of logistics...",
        "Brewing the perfect plan... ☕",
        "Waking up the robot squad...",
        "Initializing maximum efficiency mode...",
        "Summoning the deal hunters... 🎯"
    ];
    return quips[Math.floor(Math.random() * quips.length)];
};

export const getCheckoutQuip = (totalCost, budget) => {
    const saved = budget - totalCost;
    const percentSaved = ((saved / budget) * 100).toFixed(0);

    if (percentSaved >= 50) return `🎉 Holy savings! You're a genius! Saved ${percentSaved}%!`;
    if (percentSaved >= 30) return `💰 Nice! Saved ${percentSaved}% like a pro!`;
    if (percentSaved >= 10) return `✨ Not bad! ${percentSaved}% savings unlocked!`;
    if (saved > 0) return `👍 Every dollar counts! Saved ${percentSaved}%!`;
    return `🎯 Spent it all perfectly! Budget master!`;
};
