import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Terminal, ShoppingCart, Zap, DollarSign, Activity, CheckCircle, Package, Truck, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import BackgroundGrid from './components/BackgroundGrid';
import MagicCard from './components/MagicCard';
import AgentNetwork from './components/AgentNetwork';
import AgentNeuralLink from './components/AgentNeuralLink';
import GamifiedInput from './components/GamifiedInput';
import MissionDebrief from './components/MissionDebrief';
import { getPersonalityComment, getAgentQuip, getLoadingQuip, getCheckoutQuip } from './utils/personality';

// Utility for classes
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Typewriter Component
function TypewriterLog({ logs }) {
    const bottomRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="font-mono text-sm text-hack-green space-y-1 overflow-y-auto flex-1 h-full custom-scrollbar pb-2">
            {logs.map((log, i) => (
                <TypewriterItem key={i} text={log} delay={i * 0.1} /> // Reduced staggered delay
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

// Utility to get agent color
function getAgentColor(text) {
    if (text.includes("[PLANNER_AGENT]")) return "text-cyber-cyan";
    if (text.includes("[INVENTORY_BOT]")) return "text-cyber-gold";
    if (text.includes("[FINANCE_BOT]")) return "text-green-400";
    if (text.includes("[LOGIC_CORE]")) return "text-cyber-orange";
    if (text.includes("[STRATEGY_OFFICER]")) return "text-cyber-cyan";
    if (text.includes("[ERROR]")) return "text-red-500";
    return "text-gray-300";
}

function TypewriterItem({ text, delay }) {
    const [displayedText, setDisplayedText] = useState('');
    const colorClass = getAgentColor(text);

    useEffect(() => {
        let index = 0;
        const startTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayedText(text.substring(0, index));
                index++;
                if (index > text.length) clearInterval(interval);
            }, 5);
            return () => clearInterval(interval);
        }, delay * 50);

        return () => clearTimeout(startTimeout);
    }, [text, delay]);

    return (
        <div className={`break-words leading-relaxed ${colorClass} text-xs font-mono`}>
            {displayedText}
            {displayedText.length < text.length && <span className="inline-block w-1.5 h-3 bg-current ml-1 animate-pulse" />}
        </div>
    );
}

export default function App() {
    // Refs
    const generationRef = useRef(0);

    // Inputs (Renamed labels in UI, same state names)
    const [people, setPeople] = useState(50);
    const [budget, setBudget] = useState(2000);
    const [days, setDays] = useState(3);
    const [strategy, setStrategy] = useState('cheapest');

    // Data
    const [plan, setPlan] = useState([]);
    const [planLogs, setPlanLogs] = useState([]); // Array of log strings
    const [totalCost, setTotalCost] = useState(0);

    // Simulation State
    const [isSimulating, setIsSimulating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDebrief, setShowDebrief] = useState(false);
    const [auditLog, setAuditLog] = useState([]);
    const [checkoutResult, setCheckoutResult] = useState(null);

    // Screen Shake State
    const [shake, setShake] = useState(false);

    // Active Agent State (for visualization)
    const [activeAgent, setActiveAgent] = useState(null);
    const [latestMessage, setLatestMessage] = useState('');
    const [personalityComment, setPersonalityComment] = useState(getLoadingQuip());

    // Track which agent is "speaking" based on the latest log
    useEffect(() => {
        if (planLogs.length > 0) {
            const lastLog = planLogs[planLogs.length - 1];

            // Extract agent and message
            let detectedAgent = null;
            let message = lastLog;

            if (lastLog.includes("[PLANNER_AGENT]")) {
                detectedAgent = "PLANNER_AGENT";
                message = lastLog.split("]:")[1]?.trim() || lastLog;
            } else if (lastLog.includes("[INVENTORY_BOT]")) {
                detectedAgent = "INVENTORY_BOT";
                message = lastLog.split("]:")[1]?.trim() || lastLog;
            } else if (lastLog.includes("[LOGIC_CORE]")) {
                detectedAgent = "LOGIC_CORE";
                message = lastLog.split("]:")[1]?.trim() || lastLog;
            } else if (lastLog.includes("[FINANCE_BOT]")) {
                detectedAgent = "FINANCE_BOT";
                message = lastLog.split("]:")[1]?.trim() || lastLog;
            } else if (lastLog.includes("[STRATEGY_OFFICER]")) {
                detectedAgent = "STRATEGY_OFFICER";
                message = lastLog.split("]:")[1]?.trim() || lastLog;
            }

            setActiveAgent(detectedAgent);
            setLatestMessage(message);

            // Clear active agent after a delay
            const timer = setTimeout(() => {
                setActiveAgent(null);
                setLatestMessage('');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [planLogs]);

    // Update personality comment when inputs change
    useEffect(() => {
        setPersonalityComment(getPersonalityComment(people, budget, days, strategy));
    }, [people, budget, days, strategy]);

    // Status Ticker
    const [systemStatus, setSystemStatus] = useState("SYSTEM ONLINE");
    useEffect(() => {
        const statuses = ["SYSTEM ONLINE", "ENCRYPTED CONNECTION", "AWAITING ORDERS", "SCANNING NETWORK"];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % statuses.length;
            setSystemStatus(statuses[i]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const generatePlan = async (strategyType) => {
        setStrategy(strategyType);

        // Increment generation ID to invalidate previous streams
        const currentGen = ++generationRef.current;

        // Clear previous plan and logs
        setPlanLogs([]);
        setPlan([]);

        try {
            // 1. Initial Status
            if (generationRef.current === currentGen) {
                setPlanLogs([`Initializing Neural Link...`, `Strategy Selected: ${strategyType.toUpperCase()}`]);
            }

            // 2. Payload
            const payload = {
                people,
                budget,
                deadline: days,
                strategy: strategyType
            };

            // 3. API
            const response = await axios.post('/api/plan', payload);

            // If user clicked again, stop processing this request
            if (generationRef.current !== currentGen) return;

            const data = response.data;

            // 4. Stream Logs for Cinematic Effect
            if (data.reasoning) {
                const logs = data.reasoning.split('\n');

                // Helper to add logs with delay
                const streamLogs = async (logs) => {
                    for (const log of logs) {
                        // Check if still relevant
                        if (generationRef.current !== currentGen) return;

                        setPlanLogs(prev => [...prev, log]);
                        // Wait for 600ms (faster, more intense)
                        await new Promise(r => setTimeout(r, 600));
                    }

                    // Finally show the plan if we're still the active generation
                    if (generationRef.current === currentGen && data.plan) {
                        setPlan(data.plan);
                        setTotalCost(data.total_cost);
                        setPlanLogs(prev => [...prev, `[SYSTEM]: MISSION PLAN ACQUIRED.`]);
                    }
                };

                streamLogs(logs);
            }

        } catch (error) {
            console.error("Plan Failed:", error);
            if (generationRef.current === currentGen) {
                setPlanLogs(prev => [...prev, `ERROR: CONNECTION LOST. CHECK BACKEND.`]);
            }
        }
    };

    const handleCheckout = async () => {
        // Trigger Screen Shake
        setShake(true);
        setTimeout(() => setShake(false), 200);

        setIsSimulating(true);
        setShowModal(true);
        setAuditLog([]);

        try {
            const response = await axios.post('/api/checkout', { cart: plan });
            const result = response.data;
            setCheckoutResult(result);
            setAuditLog(result.audit_log);

            const savings = Math.max(0, budget - totalCost);
            const voiceRes = await axios.post('/api/speak', {
                savings,
                deliveryDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
                orderCount: result.orders.length
            }, { responseType: 'blob' });

            const audioUrl = URL.createObjectURL(new Blob([voiceRes.data]));
            const audio = new Audio(audioUrl);
            audio.play();

            // After a short delay, transition to the MissionDebrief
            setTimeout(() => {
                setShowModal(false);
                setShowDebrief(true);
            }, 3000); // 3 seconds to let the user see the progress bars complete

        } catch (error) {
            console.error("Checkout failed:", error);
            setAuditLog(prev => [...prev, "Error: Transaction Failed."]);
        } finally {
            setIsSimulating(false);
        }
    };

    // Group items
    const groupedItems = plan.reduce((acc, item) => {
        if (!acc[item.store]) acc[item.store] = [];
        acc[item.store].push(item);
        return acc;
    }, {});

    return (
        <motion.div
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.2 }}
            className="relative min-h-screen text-white font-sans overflow-hidden"
        >
            <BackgroundGrid />
            <div className="fixed inset-0 z-[-1]">
                <video
                    src="/cyberpunk.mp4"
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover opacity-100" // Full visibility
                />
            </div>
            <div className="fixed inset-0 z-[-1] cyberpunk-bg opacity-40 mix-blend-overlay pointer-events-none"></div>
            <div className="scanlines"></div>

            {/* Neural Link Header */}
            <AgentNeuralLink activeAgent={activeAgent} latestMessage={latestMessage} />

            <div className="p-6 relative z-10 min-h-screen flex flex-col max-w-[1600px] mx-auto pb-20">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 flex justify-between items-end bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl p-6 rounded-2xl hover:bg-black/40 transition-all duration-300"
                >
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg font-sans">
                            HACKATHON <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-orange to-cyber-gold">COMMAND CENTER</span>
                        </h1>
                        <div className="text-xs text-cyber-cyan/50 tracking-[0.4em] mt-1 font-mono uppercase">
                            AI Logistics Orchestrator v4.2
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-cyber-orange font-mono animate-pulse mb-1 flex items-center justify-end gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyber-orange"></span>
                            {systemStatus}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                            <Activity className="w-3 h-3 text-cyber-cyan" />
                            LATENCY: 12ms // SECURE
                        </div>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

                    {/* Left Panel: Inputs & Log */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">

                        {/* 2. Mission Control Panel with Personality */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden hover:bg-black/40 hover:border-cyber-cyan/50 transition-all duration-300"
                        >
                            {/* Personality Comment Banner */}
                            <motion.div
                                key={personalityComment}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-cyber-cyan/20 to-cyber-orange/20 border-b border-white/10 px-6 py-3 text-center"
                            >
                                <div className="text-sm font-mono text-white font-bold animate-pulse">
                                    {personalityComment}
                                </div>
                            </motion.div>

                            {/* Inputs Container */}
                            <div className="p-6 space-y-6">
                                <GamifiedInput
                                    label="OPERATIVES DEPLOYED"
                                    icon={<UserIcon />}
                                    value={people}
                                    onChange={e => setPeople(Number(e.target.value))}
                                    min={10}
                                    max={200}
                                    step={5}
                                    presets={[
                                        { label: 'Small', value: 25, icon: '🎯' },
                                        { label: 'Medium', value: 50, icon: '⚡' },
                                        { label: 'Large', value: 100, icon: '🚀' },
                                    ]}
                                />
                                <GamifiedInput
                                    label="MISSION FUNDING"
                                    icon={<DollarSign className="w-4 h-4" />}
                                    value={budget}
                                    onChange={e => setBudget(Number(e.target.value))}
                                    min={500}
                                    max={10000}
                                    step={100}
                                    unit="$"
                                    presets={[
                                        { label: 'Startup', value: 1000, icon: '💡' },
                                        { label: 'Standard', value: 2000, icon: '💰' },
                                        { label: 'Premium', value: 5000, icon: '💎' },
                                    ]}
                                />
                                <GamifiedInput
                                    label="T-MINUS (DAYS)"
                                    icon={<ClockIcon />}
                                    value={days}
                                    onChange={e => setDays(Number(e.target.value))}
                                    min={1}
                                    max={14}
                                    step={1}
                                    presets={[
                                        { label: 'Rush', value: 1, icon: '🔥' },
                                        { label: 'Normal', value: 3, icon: '⏱️' },
                                        { label: 'Relaxed', value: 7, icon: '🌙' },
                                    ]}
                                />
                            </div>
                        </motion.div>

                        {/* 3. Strategy Log (Magic Card) */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex-1 min-h-[300px]"
                        >
                            <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl h-full flex flex-col overflow-hidden relative group hover:border-cyber-orange/50 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 to-transparent pointer-events-none"></div>
                                <div className="flex items-center gap-2 p-4 text-cyber-cyan text-[10px] font-mono uppercase tracking-widest border-b border-white/10 bg-black/40">
                                    <Terminal className="w-3 h-3" />
                                    STRATEGY_KERNEL.01
                                </div>

                                {/* Agent Network Viz */}
                                <div className="p-4 border-b border-white/5 bg-black/10">
                                    <AgentNetwork activeAgent={activeAgent} />
                                </div>

                                <div className="flex-1 p-4 overflow-hidden relative">
                                    <TypewriterLog logs={planLogs} />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Cart & Controls */}
                    <div className="lg:col-span-8 flex flex-col gap-6 h-full">

                        {/* Controls */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-between bg-black/30 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl hover:bg-black/40 transition-all duration-300"
                        >
                            <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-mono ml-2">Protocol Selection</span>
                            <div className="flex gap-4">
                                <ToggleButton
                                    active={strategy === 'cheapest'}
                                    onClick={() => generatePlan('cheapest')}
                                    icon={<DollarSign className="w-3 h-3" />}
                                    label="PRIORITIZE CHEAPEST"
                                    color="blue"
                                />
                                <ToggleButton
                                    active={strategy === 'speed'}
                                    onClick={() => generatePlan('speed')}
                                    icon={<Zap className="w-3 h-3" />}
                                    label="PRIORITIZE SPEED"
                                    color="purple"
                                />
                            </div>
                        </motion.div>

                        {/* Unified Cart (Magic Card) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex-1"
                        >
                            <div className="relative group rounded-xl p-[1px] overflow-hidden h-full">
                                <span className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#00ffc8_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[spin_4s_linear_infinite]"></span>
                                <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col hover:border-cyber-gold/50 transition-all duration-300">

                                    <div className="flex justify-between items-center p-6 border-b border-white/5">
                                        <h2 className="text-xl font-bold flex items-center gap-3 text-white tracking-wide font-sans">
                                            <ShoppingCart className="w-5 h-5 text-cyber-cyan" />
                                            ACQUISITION MANIFEST
                                        </h2>
                                        <div className="text-3xl font-mono text-cyber-gold font-bold tracking-tighter">
                                            ${totalCost.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-4 p-6 custom-scrollbar relative">
                                        <AnimatePresence>
                                            {Object.keys(groupedItems).length === 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
                                                >
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.1, 1],
                                                            rotate: [0, 5, -5, 0]
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                        className="text-7xl mb-6"
                                                    >
                                                        🛒
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold text-white mb-3 font-sans">
                                                        Cart is Empty... For Now! 👀
                                                    </h3>
                                                    <p className="text-gray-400 font-mono text-sm max-w-md leading-relaxed">
                                                        Click <span className="text-cyber-cyan font-bold">INITIATE PROCUREMENT</span> below and watch the AI agents hunt down the best deals for your hackathon! 🎯✨
                                                    </p>
                                                    <motion.div
                                                        animate={{ y: [0, -10, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                        className="mt-6 text-4xl"
                                                    >
                                                        ⬇️
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                            {Object.entries(groupedItems).map(([store, items]) => (
                                                <motion.div
                                                    layoutId={`store-${store}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    key={store}
                                                    className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-cyber-orange/50 hover:bg-black/40 transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                                                        <Truck className="w-3 h-3" />
                                                        SOURCE NODE: {store}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center bg-black/30 p-3 rounded text-sm hover:bg-black/50 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00d9ff]"></div>
                                                                    <span className="font-medium text-gray-200">{item.name}</span>
                                                                    <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded font-mono">x{item.quantity}</span>
                                                                </div>
                                                                <div className="font-mono text-white/90">${item.price * item.quantity}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <div className="p-6 border-t border-white/10 bg-black/30 backdrop-blur-md">
                                        <button
                                            onClick={handleCheckout}
                                            disabled={plan.length === 0}
                                            className={cn(
                                                "w-full py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 border-2 relative overflow-hidden group",
                                                plan.length > 0
                                                    ? "backdrop-blur-md bg-gradient-to-r from-cyber-cyan/20 via-cyber-orange/20 to-cyber-gold/20 border-cyber-orange text-white shadow-[0_0_30px_rgba(255,107,53,0.4)] hover:shadow-[0_0_50px_rgba(255,107,53,0.7)] hover:-translate-y-1"
                                                    : "bg-gray-800/20 border-white/10 text-gray-600 cursor-not-allowed"
                                            )}
                                        >
                                            {plan.length > 0 && (
                                                <span className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/30 to-cyber-gold/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out"></span>
                                            )}
                                            <CheckCircle className="w-5 h-5 relative z-10" />
                                            <span className="relative z-10">
                                                {plan.length > 0 ? (
                                                    <>
                                                        🚀 INITIATE PROCUREMENT
                                                        {totalCost < budget * 0.6 && <span className="ml-2 text-cyber-gold">💰</span>}
                                                        {totalCost >= budget * 0.9 && < span className="ml-2 text-cyber-orange">🔥</span>}
                                                    </>
                                                ) : (
                                                    "⏳ AWAITING MISSION DATA..."
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-black border border-white/10 w-full max-w-2xl rounded-2xl shadow-[0_0_100px_rgba(0,255,200,0.1)] overflow-hidden relative"
                        >
                            {/* Modal Decor */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-hack-green to-transparent opacity-50"></div>
                            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                            <div className="p-8 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                <h3 className="text-xl font-bold flex items-center gap-3 text-white tracking-widest uppercase font-sans">
                                    {isSimulating ? <Activity className="w-5 h-5 animate-pulse text-hack-green" /> : <CheckCircle className="w-5 h-5 text-hack-green" />}
                                    {isSimulating ? "SEQUENCE RUNNING..." : "DEPLOYMENT COMPLETE"}
                                </h3>
                                {!isSimulating && (
                                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">[CLOSE]</button>
                                )}
                            </div>

                            <div className="p-8 space-y-8">
                                {(isSimulating || checkoutResult) && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
                                                <span>Global Supply Mainframe</span>
                                                <span>{isSimulating ? "Handshake..." : "Secure"}</span>
                                            </div>
                                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 1.5, repeat: isSimulating ? Infinity : 0 }}
                                                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
                                                <span>Logistics Routing</span>
                                                <span>{isSimulating ? "Optimizing..." : "Active"}</span>
                                            </div>
                                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 2.2, delay: 0.5, repeat: isSimulating ? Infinity : 0 }}
                                                    className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-black/50 p-6 rounded-xl font-mono text-xs h-64 overflow-y-auto border border-white/5 shadow-inner relative custom-scrollbar">
                                    <div className="space-y-3 relative z-10">
                                        {auditLog.map((log, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={cn(
                                                    "flex gap-3 border-l-2 pl-3",
                                                    log.includes("Success") ? "border-hack-green text-white" : "border-gray-700 text-gray-500"
                                                )}
                                            >
                                                <span className="opacity-30 text-[10px] w-16">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                                <span>{log}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mission Debrief Modal */}
            <MissionDebrief
                isOpen={showDebrief}
                onClose={() => setShowDebrief(false)}
                checkoutResult={checkoutResult}
                plan={plan}
                totalCost={totalCost}
                budget={budget}
                days={days}
                reasoningLogs={planLogs}
            />
        </motion.div >
    );
}

// Styled Sub-components
function InputGroup({ label, icon, value, onChange, type, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex flex-col gap-2 relative group"
        >
            <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold ml-1 font-mono transition-colors group-hover:text-white w-fit">{label}</label>
            <div className="relative rounded-xl transition-all duration-300 border border-white/10 bg-black/30 backdrop-blur-md group-hover:border-cyber-orange/50 group-hover:bg-black/40 group-hover:shadow-[0_0_20px_rgba(255,107,53,0.2)]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-cyan transition-colors">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-cyber-cyan/50 rounded-xl placeholder-gray-700 font-mono text-sm tracking-wider transition-all"
                />
            </div>
        </motion.div>
    );
}

function ToggleButton({ active, onClick, icon, label, color }) {
    const activeClass = color === 'blue'
        ? 'backdrop-blur-md bg-cyber-cyan/30 text-white shadow-[0_0_30px_rgba(0,217,255,0.5)] border-cyber-cyan'
        : 'backdrop-blur-md bg-cyber-orange/30 text-white shadow-[0_0_30px_rgba(255,107,53,0.5)] border-cyber-orange';

    const inactiveClass = 'backdrop-blur-md bg-white/5 border-white/20 text-gray-400 hover:border-cyber-gold/50 hover:text-white hover:bg-white/10';

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.15em] hover:scale-105 active:scale-95",
                active ? activeClass : inactiveClass
            )}
        >
            {icon}
            {label}
        </button>
    );
}

function UserIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
}
function ClockIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
}
