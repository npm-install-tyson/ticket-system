import { Seat } from "../util/types";
import { SeatSection } from "./SeatSection";

interface SeatRowProps {
  rowSeats: Seat[];
  selectedSeats: string[];
  onSeatClick: (seat: Seat) => void;
}

export const SeatRow: React.FC<SeatRowProps> = ({
  rowSeats,
  selectedSeats,
  onSeatClick,
}) => {
  const leftSection = rowSeats.slice(0, 6);
  const middleSection = rowSeats.slice(6, 14);
  const rightSection = rowSeats.slice(14, 20);

  return (
    <div className="flex justify-center items-center gap-6 mb-2">
      <SeatSection
        seats={leftSection}
        selectedSeats={selectedSeats}
        onSeatClick={onSeatClick}
      />
      <SeatSection
        seats={middleSection}
        selectedSeats={selectedSeats}
        onSeatClick={onSeatClick}
      />
      <SeatSection
        seats={rightSection}
        selectedSeats={selectedSeats}
        onSeatClick={onSeatClick}
      />
    </div>
  );
};
