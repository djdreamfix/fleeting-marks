import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-primary mb-4"
      >
        <MapPin className="w-16 h-16" />
      </motion.div>
      <p className="text-muted-foreground animate-pulse">Завантаження карти...</p>
    </div>
  );
};