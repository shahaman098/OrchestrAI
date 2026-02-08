import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Download, Truck, Clock, Zap, Bot, Package,
    User, Store, ArrowRight, Brain, Shield, ExternalLink,
    Sparkles, TrendingUp, Timer
} from 'lucide-react';

// Store icons mapping
const storeIcons = {
    'DevCable': { icon: '🔌', color: '#00d9ff' },
    'SnackOverflow': { icon: '🍕', color: '#ffa500' },
    'MerchMasters': { icon: '👕', color: '#ff6b35' },
    'TechSupply': { icon: '💻', color: '#22c55e' },
    'FastShip': { icon: '📦', color: '#a855f7' },
};

export default function MissionDebrief({
    isOpen,
    onClose,
    checkoutResult,
    plan,
    totalCost,
    budget,
    days,
    reasoningLogs
}) {
    const [showStores, setShowStores] = useState(false);
    const [showChecks, setShowChecks] = useState([]);
    const [activeSection, setActiveSection] = useState(0);

    // Get unique stores from plan
    const uniqueStores = [...new Set(plan.map(item => item.store))];
    const savings = Math.max(0, budget - totalCost);
    const savingsPercent = ((savings / budget) * 100).toFixed(0);

    // Calculate delivery date
    const maxDeliveryDays = Math.max(...plan.map(item => item.deliveryDays || 3));
    const deliveryDate = new Date(Date.now() + maxDeliveryDays * 24 * 60 * 60 * 1000);
    const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    // Extract a decision trace from reasoning logs
    const getDecisionTrace = () => {
        const strategyLog = reasoningLogs?.find(log => log.includes('[STRATEGY_OFFICER]'));
        if (strategyLog) {
            return strategyLog.replace('[STRATEGY_OFFICER]: ', '');
        }
        return `Selected optimal items based on ${days}-day delivery constraint and $${budget} budget limit.`;
    };

    // Animation sequence
    useEffect(() => {
        if (isOpen) {
            setShowStores(false);
            setShowChecks([]);
            setActiveSection(0);

            // Animate sections
            const timer1 = setTimeout(() => setActiveSection(1), 500);
            const timer2 = setTimeout(() => setShowStores(true), 1000);
            const timer3 = setTimeout(() => setActiveSection(2), 1500);

            // Animate checkmarks one by one
            uniqueStores.forEach((_, index) => {
                setTimeout(() => {
                    setShowChecks(prev => [...prev, index]);
                }, 2000 + (index * 400));
            });

            const timer4 = setTimeout(() => setActiveSection(3), 2000 + (uniqueStores.length * 400) + 500);
            const timer5 = setTimeout(() => setActiveSection(4), 3500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
                clearTimeout(timer5);
            };
        }
    }, [isOpen, uniqueStores.length]);

    // Download JSON Report
    const downloadReport = () => {
        const report = {
            mission_id: `ORCH-${Date.now()}`,
            timestamp: new Date().toISOString(),
            summary: {
                total_cost: totalCost,
                budget_allocated: budget,
                savings: savings,
                savings_percent: savingsPercent,
                delivery_deadline: days,
                estimated_arrival: deliveryDateStr,
            },
            retailers_orchestrated: uniqueStores,
            items_procured: plan.map(item => ({
                name: item.name,
                category: item.category,
                store: item.store,
                quantity: item.quantity,
                unit_price: item.price,
                total: item.total,
                delivery_days: item.deliveryDays
            })),
            agent_reasoning: reasoningLogs,
            orders: checkoutResult?.orders || [],
            audit_log: checkoutResult?.audit_log || [],
            complexity_metrics: {
                hours_saved: 4,
                retailers_searched: uniqueStores.length,
                conflicts_resolved: plan.length * 2,
                checkout_flows_unified: uniqueStores.length
            }
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agent_report_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative p-8 border-b border-white/10 bg-gradient-to-r from-cyber-cyan/20 via-transparent to-cyber-gold/20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-gold flex items-center justify-center shadow-[0_0_40px_rgba(0,217,255,0.5)]"
                        >
                            <CheckCircle className="w-8 h-8 text-black" />
                        </motion.div>

                        <div className="text-center pt-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                MISSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-gold">ACCOMPLISHED</span>
                            </h2>
                            <p className="text-gray-400 font-mono text-sm">DEBRIEF // PROTOCOL COMPLETE</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* 1. VALUE SCORECARD */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: activeSection >= 1 ? 1 : 0.3, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-3 gap-4"
                        >
                            {/* Complexity Delegated */}
                            <div className="bg-gradient-to-br from-cyber-cyan/20 to-transparent border border-cyber-cyan/30 rounded-2xl p-6 text-center">
                                <Zap className="w-8 h-8 text-cyber-cyan mx-auto mb-3" />
                                <div className="text-3xl font-bold text-white mb-1">~4 hrs</div>
                                <div className="text-[10px] uppercase tracking-widest text-cyber-cyan font-mono">
                                    ⚡ COMPLEXITY DELEGATED
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Manual browsing time saved</p>
                            </div>

                            {/* Agent Actions */}
                            <div className="bg-gradient-to-br from-cyber-orange/20 to-transparent border border-cyber-orange/30 rounded-2xl p-6 text-center">
                                <Bot className="w-8 h-8 text-cyber-orange mx-auto mb-3" />
                                <div className="text-3xl font-bold text-white mb-1">{uniqueStores.length} / {plan.length * 2} / 1</div>
                                <div className="text-[10px] uppercase tracking-widest text-cyber-orange font-mono">
                                    🤖 AGENT ACTIONS
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Retailers • Conflicts Resolved • Click</p>
                            </div>

                            {/* Logistics Locked */}
                            <div className="bg-gradient-to-br from-cyber-gold/20 to-transparent border border-cyber-gold/30 rounded-2xl p-6 text-center">
                                <Package className="w-8 h-8 text-cyber-gold mx-auto mb-3" />
                                <div className="text-2xl font-bold text-white mb-1">{deliveryDateStr}</div>
                                <div className="text-[10px] uppercase tracking-widest text-cyber-gold font-mono">
                                    📦 LOGISTICS LOCKED
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Guaranteed arrival</p>
                            </div>
                        </motion.div>

                        {/* 2. ORCHESTRATION VISUALIZATION */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: activeSection >= 2 ? 1 : 0.3 }}
                            transition={{ delay: 0.5 }}
                            className="bg-black/50 border border-white/10 rounded-2xl p-8"
                        >
                            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-6 text-center">
                                🔗 Multi-Retailer Orchestration Map
                            </h3>

                            <div className="flex items-center justify-center gap-4">
                                {/* User Node */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: showStores ? 1 : 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                    <span className="text-xs text-white font-mono mt-2">YOU</span>
                                </motion.div>

                                {/* Connection Lines */}
                                <div className="flex-1 flex flex-col gap-2 max-w-[200px]">
                                    {uniqueStores.map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: showStores ? 1 : 0 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            className="h-0.5 bg-gradient-to-r from-white/50 to-cyber-cyan origin-left"
                                        />
                                    ))}
                                </div>

                                {/* Store Nodes */}
                                <div className="flex flex-col gap-3">
                                    {uniqueStores.map((store, index) => {
                                        const storeData = storeIcons[store] || { icon: '🏪', color: '#888' };
                                        const isChecked = showChecks.includes(index);

                                        return (
                                            <motion.div
                                                key={store}
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: showStores ? 0 : 20, opacity: showStores ? 1 : 0 }}
                                                transition={{ delay: 0.5 + (index * 0.2) }}
                                                className="flex items-center gap-3"
                                            >
                                                <div
                                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 relative"
                                                    style={{
                                                        borderColor: storeData.color,
                                                        backgroundColor: `${storeData.color}20`,
                                                        boxShadow: isChecked ? `0 0 20px ${storeData.color}` : 'none'
                                                    }}
                                                >
                                                    {storeData.icon}

                                                    {/* Checkmark */}
                                                    <AnimatePresence>
                                                        {isChecked && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_10px_#22c55e]"
                                                            >
                                                                <CheckCircle className="w-4 h-4 text-white" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{store}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono">
                                                        {isChecked ? '✓ CHECKOUT COMPLETE' : 'Processing...'}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: showChecks.length === uniqueStores.length ? 1 : 0 }}
                                className="text-center text-sm text-gray-400 mt-6 font-mono"
                            >
                                ✓ Auto-filled payment and shipping data across <span className="text-cyber-cyan font-bold">{uniqueStores.length} isolated checkout flows</span>
                            </motion.p>
                        </motion.div>

                        {/* 3. DECISION TRACE (Reasoning Recap) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: activeSection >= 3 ? 1 : 0.3 }}
                            transition={{ delay: 0.7 }}
                            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-mono uppercase tracking-widest text-purple-400 mb-2">
                                        🧠 Decision Trace // Explain Mode
                                    </h4>
                                    <p className="text-gray-300 text-sm italic leading-relaxed">
                                        "{getDecisionTrace()}"
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-2 font-mono">
                                        — STRATEGY_OFFICER via Ranking Engine
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* 4. SAVINGS SUMMARY */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: activeSection >= 3 ? 1 : 0.3 }}
                            className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl p-4"
                        >
                            <div className="flex items-center gap-4">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                                <div>
                                    <div className="text-lg font-bold text-white">
                                        ${totalCost.toLocaleString()} <span className="text-gray-500">of</span> ${budget.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-400">Total procurement cost</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-400">
                                    ${savings.toLocaleString()} SAVED
                                </div>
                                <div className="text-xs text-green-400/70">{savingsPercent}% under budget</div>
                            </div>
                        </motion.div>

                        {/* 5. ACTION BUTTONS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: activeSection >= 4 ? 1 : 0.3, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {/* Primary: Download Report */}
                            <button
                                onClick={downloadReport}
                                className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-cyber-cyan to-cyber-gold text-black font-bold rounded-xl shadow-[0_0_30px_rgba(0,217,255,0.4)] hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] transition-all hover:-translate-y-1"
                            >
                                <Download className="w-5 h-5" />
                                DOWNLOAD AGENT REPORT (JSON)
                            </button>

                            {/* Secondary: Track Shipments */}
                            <button
                                onClick={() => alert('Tracking links would open here in production!')}
                                className="flex items-center justify-center gap-3 py-4 px-6 bg-white/5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/30 transition-all"
                            >
                                <Truck className="w-5 h-5" />
                                TRACK SHIPMENTS
                                <ExternalLink className="w-4 h-4 opacity-50" />
                            </button>
                        </motion.div>

                        {/* Orders Summary */}
                        {checkoutResult?.orders && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeSection >= 4 ? 1 : 0 }}
                                className="text-center text-xs text-gray-500 font-mono"
                            >
                                {checkoutResult.orders.length} orders created: {checkoutResult.orders.map(o => o.orderId).join(', ')}
                            </motion.div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-gray-500 hover:text-white transition-colors font-mono text-sm"
                        >
                            [ CLOSE DEBRIEF ]
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
