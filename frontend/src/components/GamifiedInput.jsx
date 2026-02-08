import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Clock, Zap, TrendingUp, Shield } from 'lucide-react';

export default function GamifiedInput({ label, icon, value, onChange, min = 0, max = 100, step = 1, presets = [], unit = '' }) {
    const [displayValue, setDisplayValue] = useState(value);
    const [isChanging, setIsChanging] = useState(false);

    // Odometer effect when value changes
    useEffect(() => {
        if (displayValue !== value) {
            setIsChanging(true);
            const duration = 300;
            const steps = 20;
            const increment = (value - displayValue) / steps;
            let current = displayValue;
            let stepCount = 0;

            const interval = setInterval(() => {
                stepCount++;
                current += increment;
                setDisplayValue(Math.round(current));

                if (stepCount >= steps) {
                    setDisplayValue(value);
                    clearInterval(interval);
                    setIsChanging(false);
                }
            }, duration / steps);

            return () => clearInterval(interval);
        }
    }, [value]);

    const handleSliderChange = (e) => {
        onChange({ target: { value: Number(e.target.value) } });
    };

    const handlePresetClick = (presetValue) => {
        onChange({ target: { value: presetValue } });
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
        >
            {/* Label */}
            <div className="flex items-center justify-between mb-3">
                <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold font-mono flex items-center gap-2">
                    {icon}
                    {label}
                </label>

                {/* Animated Value Display */}
                <motion.div
                    animate={isChanging ? { scale: [1, 1.2, 1] } : {}}
                    className="text-2xl font-mono font-bold text-white"
                    style={{
                        color: percentage > 75 ? '#ff6b35' : percentage > 50 ? '#ffa500' : '#00d9ff',
                        textShadow: `0 0 20px ${percentage > 75 ? '#ff6b35' : percentage > 50 ? '#ffa500' : '#00d9ff'}`,
                    }}
                >
                    {unit === '$' && '$'}{displayValue}{unit !== '$' && unit}
                </motion.div>
            </div>

            {/* Slider Container */}
            <div className="relative h-12 mb-4">
                {/* Background Track */}
                <div className="absolute inset-0 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                    {/* Progress Fill */}
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-xl"
                        style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, #00d9ff 0%, #ffa500 50%, #ff6b35 100%)`,
                            opacity: 0.3,
                        }}
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 border-r border-white/5"
                            />
                        ))}
                    </div>
                </div>

                {/* Slider Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                />

                {/* Slider Thumb (Custom) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                >
                    <motion.div
                        animate={{
                            scale: isChanging ? [1, 1.3, 1] : 1,
                        }}
                        className="w-4 h-8 rounded-full bg-gradient-to-b from-cyber-cyan to-cyber-orange border-2 border-white shadow-lg"
                        style={{
                            boxShadow: `0 0 20px ${percentage > 75 ? '#ff6b35' : percentage > 50 ? '#ffa500' : '#00d9ff'}`,
                        }}
                    />
                </div>
            </div>

            {/* Quick Presets */}
            {presets.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {presets.map((preset, index) => (
                        <button
                            key={index}
                            onClick={() => handlePresetClick(preset.value)}
                            className={`
                                px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider
                                transition-all duration-200 backdrop-blur-sm
                                ${value === preset.value
                                    ? 'bg-cyber-cyan/30 text-white border border-cyber-cyan shadow-[0_0_15px_rgba(0,217,255,0.5)]'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-cyber-orange/50 hover:text-white'
                                }
                            `}
                        >
                            {preset.icon && <span className="mr-1">{preset.icon}</span>}
                            {preset.label}
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
