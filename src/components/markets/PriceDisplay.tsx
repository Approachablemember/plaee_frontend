'use client';

import { motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { priceChangeAtomFamily } from '@/lib/store';
import { formatPrice, getPriceChangeColor } from '@/lib/utils';

interface PriceDisplayProps {
  outcomeId: string;
  price: number;
  showChange?: boolean;
}

export function PriceDisplay({ outcomeId, price, showChange = true }: PriceDisplayProps) {
  const priceChange = useAtomValue(priceChangeAtomFamily(outcomeId));
  const changeColor = getPriceChangeColor(priceChange);

  return (
    <div className="flex items-center gap-2">
      <motion.span
        key={price}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-white"
      >
        {formatPrice(price)}
      </motion.span>
      {showChange && priceChange !== 0 && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm font-medium ${changeColor}`}
        >
          {priceChange > 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
        </motion.span>
      )}
    </div>
  );
}
