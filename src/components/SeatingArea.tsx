import { BAND_CONFIG, Seat } from "../util/types";
import { SeatRow } from "./SeatRows";

interface SeatingAreaProps {
  rows: Seat[][];
  selectedSeats: string[];
  onSeatClick: (seat: Seat) => void;
  bands: (BAND_CONFIG & { rows: number })[];
}

export const SeatingArea: React.FC<SeatingAreaProps> = ({
  rows,
  selectedSeats,
  onSeatClick,
  bands,
}) => {
  let currentRow = 0;

  return (
    <div className="overflow-y-auto overflow-x-auto">
      <div className="min-w-fit">
        {bands.map((band) => {
          const bandRows = rows.slice(currentRow, currentRow + band.rows);
          currentRow += band.rows;
          return (
            <div key={band.bandId}>
              <div className="text-center mb-2 text-lg font-semibold mt-5">
                Band {band.bandId}
              </div>
              {bandRows.map((rowSeats, index) => (
                <SeatRow
                  key={`${band.bandId}-${index}`}
                  rowSeats={rowSeats}
                  selectedSeats={selectedSeats}
                  onSeatClick={onSeatClick}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
