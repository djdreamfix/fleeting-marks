import { Navigation } from 'lucide-react';

interface LocationButtonProps {
  onClick: () => void;
}

export const LocationButton = ({ onClick }: LocationButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-4 z-40 p-3 bg-card text-card-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      aria-label="Моя локація"
    >
      <Navigation className="w-6 h-6" />
    </button>
  );
};