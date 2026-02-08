import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const agents = [
    { id: 'PLANNER_AGENT', name: 'ALPHA', color: '#00d9ff', shortName: 'PLN' },
    { id: 'INVENTORY_BOT', name: 'BETA', color: '#ffa500', shortName: 'INV' },
    { id: 'LOGIC_CORE', name: 'GAMMA', color: '#ff6b35', shortName: 'LOG' },
    { id: 'FINANCE_BOT', name: 'DELTA', color: '#22c55e', shortName: 'FIN' },
];

export default function AgentNeuralLink({ activeAgent, latestMessage }) {
    const [dataBeams, setDataBeams] = useState([]);
    const [transcript, setTranscript] = useState('');
    const [displayedTranscript, setDisplayedTranscript] = useState('');

    // Get active agent details
    const activeAgentData = agents.find(a => activeAgent?.includes(a.id));

    // Update transcript when new message arrives
    useEffect(() => {
        if (latestMessage && activeAgentData) {
            setTranscript(`>> INCOMING TRANSMISSION [${activeAgentData.name}]: ${latestMessage.toUpperCase()}`);
        }
    }, [latestMessage, activeAgentData]);

    // Typewriter effect for transcript
    useEffect(() => {
        if (!transcript) return;

        let index = 0;
        setDisplayedTranscript('');

        const interval = setInterval(() => {
            if (index < transcript.length) {
                setDisplayedTranscript(transcript.substring(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20);

        return () => clearInterval(interval);
    }, [transcript]);

    // Trigger data beam animation when agent activates
    useEffect(() => {
        if (activeAgentData) {
            const sourceIndex = agents.findIndex(a => a.id === activeAgentData.id);

            // Create beams to all other agents
            const newBeams = agents
                .map((_, targetIndex) => targetIndex)
                .filter(i => i !== sourceIndex)
                .map(targetIndex => ({
                    id: `${sourceIndex}-${targetIndex}-${Date.now()}`,
                    source: sourceIndex,
                    target: targetIndex,
                }));

            setDataBeams(newBeams);

            // Clear beams after animation
            const timeout = setTimeout(() => setDataBeams([]), 1500);
            return () => clearTimeout(timeout);
        }
    }, [activeAgentData]);

    return (
        <div className="w-full bg-black/80 backdrop-blur-md border-b border-white/10 shadow-2xl">
            {/* Agent Network */}
            <div className="relative h-24 flex items-center justify-around px-8">
                {/* SVG Layer for Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {/* Static connection grid (subtle) */}
                    {agents.map((agent, i) => {
                        const x1 = ((i + 1) / (agents.length + 1)) * 100;
                        return agents.slice(i + 1).map((_, j) => {
                            const x2 = ((i + j + 2) / (agents.length + 1)) * 100;
                            return (
                                <line
                                    key={`line-${i}-${j}`}
                                    x1={`${x1}%`}
                                    y1="50%"
                                    x2={`${x2}%`}
                                    y2="50%"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="1"
                                />
                            );
                        });
                    })}

                    {/* Animated Data Beams */}
                    <AnimatePresence>
                        {dataBeams.map(beam => {
                            const x1 = ((beam.source + 1) / (agents.length + 1)) * 100;
                            const x2 = ((beam.target + 1) / (agents.length + 1)) * 100;

                            return (
                                <motion.g key={beam.id}>
                                    {/* Beam line */}
                                    <motion.line
                                        x1={`${x1}%`}
                                        y1="50%"
                                        x2={`${x2}%`}
                                        y2="50%"
                                        stroke={agents[beam.source].color}
                                        strokeWidth="2"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                    />

                                    {/* Data packet */}
                                    <motion.circle
                                        r="4"
                                        fill={agents[beam.source].color}
                                        filter="url(#glow)"
                                        initial={{ cx: `${x1}%`, cy: "50%" }}
                                        animate={{ cx: `${x2}%`, cy: "50%" }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                    />
                                </motion.g>
                            );
                        })}
                    </AnimatePresence>

                    {/* SVG Filter for glow effect */}
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>

                {/* Agent Nodes */}
                {agents.map((agent, index) => {
                    const isActive = activeAgentData?.id === agent.id;

                    return (
                        <motion.div
                            key={agent.id}
                            className="relative z-10 flex flex-col items-center gap-2"
                            animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Agent Circle */}
                            <motion.div
                                className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold relative"
                                style={{
                                    backgroundColor: isActive ? agent.color : 'rgba(0,0,0,0.5)',
                                    borderColor: isActive ? agent.color : 'rgba(255,255,255,0.2)',
                                    color: isActive ? '#000' : agent.color,
                                    boxShadow: isActive ? `0 0 30px ${agent.color}, 0 0 60px ${agent.color}40` : 'none',
                                }}
                            >
                                {agent.shortName}

                                {/* Pulse ring when active */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-2"
                                        style={{ borderColor: agent.color }}
                                        initial={{ scale: 1, opacity: 0.8 }}
                                        animate={{ scale: 1.8, opacity: 0 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                )}
                            </motion.div>

                            {/* Agent Label */}
                            <div
                                className="text-[8px] font-mono uppercase tracking-widest font-bold"
                                style={{ color: isActive ? agent.color : 'rgba(255,255,255,0.4)' }}
                            >
                                {agent.name}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Live Transcript Bar */}
            <div
                className="h-10 px-8 flex items-center font-mono text-xs uppercase tracking-wide border-t border-white/10 bg-black/60"
                style={{ color: activeAgentData?.color || '#00d9ff' }}
            >
                {displayedTranscript || '>> SYSTEM STANDBY...'}
                {displayedTranscript.length < transcript.length && (
                    <span className="inline-block w-2 h-3 bg-current ml-1 animate-pulse" />
                )}
            </div>
        </div>
    );
}
