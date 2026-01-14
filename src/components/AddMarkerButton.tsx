import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddMarkerButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const AddMarkerButton = ({ onClick, disabled }: AddMarkerButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2
        flex items-center gap-3 px-8 py-4
        bg-primary text-primary-foreground
        rounded-full shadow-2xl
        font-bold text-lg
        transition-all duration-200
        z-40
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-primary/30 hover:shadow-xl'}
      `}
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
      Додати мітку
    </motion.button>
  );
};