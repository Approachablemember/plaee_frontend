'use client';

import { motion } from 'framer-motion';

interface ProbabilityBarProps {
  probability: number;
  color?: string;
}

export function ProbabilityBar({ probability, color = 'bg-blue-500' }: ProbabilityBarProps) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${probability * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
