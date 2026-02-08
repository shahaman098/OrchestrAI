// test-agents.js
const axios = require('axios');

async function runTest() {
    console.log("🔵 INITIALIZING SYSTEM DIAGNOSTIC...");

    // 1. Define the "Emergency" Scenario (Speed Priority)
    const payload = {
        people: 50,
        budget: 5000,
        deadline: 1, // 1 Day Deadline = Panic Mode
        strategy: 'speed'
    };

    try {
        const response = await axios.post('http://localhost:5000/api/plan', payload);
        const data = response.data;

        // CHECK 1: The Agent Chatter
        console.log("\n--------- AGENT COMM-LINK CHECK ---------");

        // Check if reasoning is present
        if (data.reasoning) {
            console.log("✅ PASS: Reasoning field detected");
            const logs = data.reasoning.split('\n').filter(line => line.trim());
            console.log(`   Found ${logs.length} log entries`);

            // Display first few agent messages
            logs.slice(0, 5).forEach(log => {
                const agentMatch = log.match(/\[(.*?)\]/);
                if (agentMatch) {
                    const agent = agentMatch[1];
                    const msg = log.substring(log.indexOf(']:') + 2).trim();
                    console.log(`   [${agent}]: ${msg.substring(0, 60)}...`);
                }
            });
        } else {
            console.error("❌ FAIL: No reasoning field found");
            console.log("   Received keys:", Object.keys(data));
        }

        // CHECK 2: The Logic (Did the system pick items for speed?)
        console.log("\n--------- CONFLICT RESOLUTION CHECK ---------");
        if (data.plan && data.plan.length > 0) {
            console.log(`✅ PASS: Plan generated with ${data.plan.length} items`);

            // Check if we selected fast delivery items
            const fastItems = data.plan.filter(item => item.deliveryDays <= 1);
            console.log(`   Fast delivery items (≤1 day): ${fastItems.length}/${data.plan.length}`);

            data.plan.forEach(item => {
                console.log(`   ${item.name}: $${item.price} (${item.deliveryDays} days, ${item.store})`);
            });

            if (fastItems.length > 0) {
                console.log("✅ PASS: Speed priority working correctly");
            }
        } else {
            console.error("❌ FAIL: No plan generated");
        }

        // CHECK 3: Total Cost
        console.log("\n--------- BUDGET CHECK ---------");
        if (data.total_cost !== undefined) {
            console.log(`✅ Total Cost: $${data.total_cost} (Budget: $${payload.budget})`);
            if (data.total_cost <= payload.budget) {
                console.log("✅ PASS: Within budget");
            } else {
                console.error("❌ FAIL: Over budget!");
            }
        }

        console.log("\n🎯 DIAGNOSTIC COMPLETE");

    } catch (error) {
        console.error("❌ CRITICAL FAILURE:", error.message);
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", error.response.data);
        }
    }
}

runTest();
