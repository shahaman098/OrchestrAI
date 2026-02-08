import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../App'; // Assuming we export cn or verify utils path. 
// Just in case, let's inline cn or put it in a separate util file if needed.
// For now, I'll assume passing className string works or duplicate simple merge logic.

export default function MagicCard({ children, className, gradientColor = "from-hack-green" }) {
    return (
        <div className={`relative group rounded-xl p-[1px] overflow-hidden ${className}`}>
            {/* Rotating Border */}
            <motion.div
                className={`absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#00ffc8_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "linear"
                }}
            />
            {/* Inner Content */}
            <div className="relative h-full bg-black/50 backdrop-blur-md rounded-xl border border-white/10 p-6 z-10">
                {children}
            </div>
        </div>
    );
}
