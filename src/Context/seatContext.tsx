import React, { createContext, useContext, useState } from "react";

// Define seat context type
interface SeatContextType {
  occupiedSeats: string[];
  setOccupiedSeats: (seats: string[]) => void;
}

// Create Context with default empty values
const SeatContext = createContext<SeatContextType | undefined>(undefined);

// Context Provider Component
export const SeatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  return (
    <SeatContext.Provider value={{ occupiedSeats, setOccupiedSeats }}>
      {children}
    </SeatContext.Provider>
  );
};

// Custom hook for easy access
export const useSeats = () => {
  const context = useContext(SeatContext);
  if (!context) {
    throw new Error("useSeats must be used within a SeatProvider");
  }
  return context;
};
