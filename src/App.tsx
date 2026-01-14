import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { io } from "socket.io-client";

const socket = io("https://fleeting-marks.onrender.com");

const queryClient = new QueryClient();

const App = () => {

  useEffect(() => {

    socket.on("marker:created", (marker) => {
      console.log("Нова мітка:", marker);
      if (window.addMarkerToMap) {
        window.addMarkerToMap(marker);
      }
    });

    socket.on("marker:removed", (id) => {
      console.log("Видалена мітка:", id);
      if (window.removeMarkerFromMap) {
        window.removeMarkerFromMap(id);
      }
    });

    return () => {
      socket.off("marker:created");
      socket.off("marker:removed");
    };

  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
