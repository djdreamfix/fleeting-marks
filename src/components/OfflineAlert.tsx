import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineAlertProps {
  isOnline: boolean;
}

export const OfflineAlert = ({ isOnline }: OfflineAlertProps) => {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg shadow-lg"
        >
          <WifiOff className="w-5 h-5" />
          <span className="font-medium">Офлайн режим</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};