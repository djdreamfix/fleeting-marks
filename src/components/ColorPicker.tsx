import { motion } from 'framer-motion';
import type { ColorType } from '@/types/marker';

interface ColorPickerProps {
  onSelect: (color: ColorType) => void;
  onCancel: () => void;
}

const colorOptions: { type: ColorType; label: string }[] = [
  { type: 'blue', label: 'Синій' },
  { type: 'green', label: 'Зелений' },
  { type: 'split', label: 'Мікс' },
];

export const ColorPicker = ({ onSelect, onCancel }: ColorPickerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center mb-6 text-card-foreground">
          Оберіть колір мітки
        </h2>
        
        <div className="flex gap-4 justify-center mb-6">
          {colorOptions.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-16 h-16 rounded-full shadow-lg border-4 border-card transition-transform group-hover:scale-110 group-active:scale-95 ${
                  type === 'blue' ? 'bg-marker-blue' :
                  type === 'green' ? 'bg-marker-green' :
                  'marker-gradient-split'
                }`}
              />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Скасувати
        </button>
      </motion.div>
    </motion.div>
  );
};