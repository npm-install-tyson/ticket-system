import { Seat } from "../util/types";
import { SeatButton } from "./SeatButton";

interface SeatSectionProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatClick: (seat: Seat) => void;
}

export const SeatSection: React.FC<SeatSectionProps> = ({
  seats,
  selectedSeats,
  onSeatClick,
}) => (
  <div className="flex gap-2">
    {seats.map((seat) => (
      <SeatButton
        key={seat.id}
        seat={seat}
        isSelected={selectedSeats.includes(seat.id)}
        onClick={() => onSeatClick(seat)}
      />
    ))}
  </div>
);
