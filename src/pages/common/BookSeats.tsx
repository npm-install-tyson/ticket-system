import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { EVENTDETAILS, SHOWTIME } from "../../util/types";
import { formatShowtime } from "../../util/formatShowtime";
import { getData, postData } from "../../services/api/fetchAPI";

// Type definitions
interface Seat {
  id: string;
  band: "A" | "B" | "C";
  row: number;
  number: number;
  occupied: boolean;
}

interface SeatsByBand {
  [key: string]: number;
}

interface OccupiedSeatsStorage {
  selectedSeats: string[];
  eventId: string;
  showId: string;
  timestamp: number;
}

interface BandConfig {
  bandId: "A" | "B" | "C";
  price: number;
  seatsPerBand: number;
}

const BAND_CONFIG: BandConfig[] = [
  { bandId: "A", price: 25, seatsPerBand: 40 },
  { bandId: "B", price: 15, seatsPerBand: 80 },
  { bandId: "C", price: 10, seatsPerBand: 80 },
];

// Component
const BookSeats: React.FC = () => {
  const { eventId, showId } = useParams<{ eventId: string; showId: string }>();
  const [event, setEvent] = useState<EVENTDETAILS>();
  const [showTime, setShowTime] = useState<SHOWTIME[]>([]);
  const occupiedSeats = useLoaderData() as string[];
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats] = useState<Seat[]>(() => generateSeats(occupiedSeats));

  const eventPath = `event/get-event?id=${eventId}`;
  const showTimePath = `event/${eventId}/get-show-times`;
  useEffect(() => {
    clearLocalStorage();
    getData(eventPath).then((data) => setEvent(data));
    getData(showTimePath)
      .then((data) => data && setShowTime(data))
      .then(() =>
        setShowTime(
          (prev: SHOWTIME[]) =>
            prev && prev.filter((st: SHOWTIME) => st.id === showId)
        )
      );
  }, []);

  const formattedShowTime = formatShowtime(
    showTime.length > 0 ? showTime[0].showTime : ""
  );

  // Seat click handler
  const handleSeatClick = (seat: Seat) => {
    if (seat.occupied) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );
  };

  // Calculate total price
  const totalPrice = calculateTotalPrice(seats, selectedSeats);

  // Continue button handler
  const handleContinue = async () => {
    try {
      await verifySeats(eventId, showId, selectedSeats);
      saveToLocalStorage(eventId, showId, selectedSeats);
      navigate("confirm-tickets");
    } catch (err) {
      // Add error handling
    }
  };

  const seatsPerRow = 20; // Assuming 20 seats per row as before
  const rowsByBand = BAND_CONFIG.map((band) => ({
    ...band,
    rows: Math.ceil(band.seatsPerBand / seatsPerRow),
  }));

  const allRows = seats.reduce((acc: Seat[][], seat) => {
    acc[seat.row - 1] = acc[seat.row - 1] || [];
    acc[seat.row - 1].push(seat);
    return acc;
  }, []);

  return (
    <div className="min-h-screen text-black max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Choose your seats for
      </h1>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {event?.name} <span className="capitalize">({event?.genre})</span>
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-center">
          {formattedShowTime.date} at {formattedShowTime.time}
        </h1>
      </div>

      <div className="max-w-5xl mx-auto">
        <StageSection />
        <SeatingArea
          rows={allRows}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          bands={rowsByBand}
        />
        <SeatLegend />
        {selectedSeats.length > 0 && (
          <SelectedSeatsInfo
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
};

// Helper Components
const StageSection: React.FC = () => (
  <div className="bg-gray-300 h-16 mb-8 flex items-center justify-center rounded">
    <span className="text-xl">Stage</span>
  </div>
);

const SeatLegend: React.FC = () => (
  <div className="mt-6 flex justify-center gap-6">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-gray-500 rounded" />
      <span>Available</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-cyan-900 bg-cyan-900 rounded" />
      <span>Selected</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-gray-400 bg-gray-400 rounded" />
      <span>Occupied</span>
    </div>
  </div>
);

interface SelectedSeatsInfoProps {
  selectedSeats: string[];
  totalPrice: number;
  onContinue: () => void;
}

const SelectedSeatsInfo: React.FC<SelectedSeatsInfoProps> = ({
  selectedSeats,
  totalPrice,
  onContinue,
}) => (
  <div className="mt-4 text-center">
    <p>Selected Seats: {selectedSeats.length}</p>
    <p>Total Price: ${totalPrice}</p>
    <button
      className="px-2 py-1 rounded-md bg-cyan-900 hover:bg-cyan-800 text-white mt-4"
      onClick={onContinue}
    >
      Continue
    </button>
  </div>
);

interface SeatingAreaProps {
  rows: Seat[][];
  selectedSeats: string[];
  onSeatClick: (seat: Seat) => void;
}

interface SeatingAreaProps {
  rows: Seat[][];
  selectedSeats: string[];
  onSeatClick: (seat: Seat) => void;
  bands: (BandConfig & { rows: number })[];
}

const SeatingArea: React.FC<SeatingAreaProps> = ({
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

interface SeatRowProps {
  rowSeats: Seat[];
  selectedSeats: string[];
  onSeatClick: (seat: Seat) => void;
}

const SeatRow: React.FC<SeatRowProps> = ({
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

interface SeatSectionProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatClick: (seat: Seat) => void;
}

const SeatSection: React.FC<SeatSectionProps> = ({
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

interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  onClick: () => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({
  seat,
  isSelected,
  onClick,
}) => {
  const getSeatClassName = () => {
    const baseClass =
      "w-10 h-10 rounded cursor-pointer transition-colors flex items-center justify-center text-sm";

    if (seat.occupied) {
      return `${baseClass} border-2 border-gray-400 text-white cursor-not-allowed bg-gray-400`;
    }

    const availableClass = `${baseClass} border-2 border-gray-500 text-black hover:border-cyan-800 hover:bg-cyan-800 hover:text-white`;

    return isSelected
      ? `${availableClass} border-cyan-900 bg-cyan-900 text-white`
      : availableClass;
  };

  return (
    <div
      className={getSeatClassName()}
      onClick={onClick}
      title={`Band ${seat.band} - Row ${seat.row} - Seat ${seat.number}`}
    >
      {seat.number}
    </div>
  );
};

// Helper Functions
function generateSeats(occupiedSeats: string[]): Seat[] {
  const allSeats: Seat[] = [];
  let currentRow = 1;

  BAND_CONFIG.forEach((band) => {
    const seatsPerRow = 20;
    const rows = Math.ceil(band.seatsPerBand / seatsPerRow);
    let seatCounter = 1; // Counter starts at 1 for each band and continues

    for (let row = 0; row < rows; row++) {
      const seatsInThisRow = Math.min(
        seatsPerRow,
        band.seatsPerBand - row * seatsPerRow
      );

      for (let num = 0; num < seatsInThisRow; num++) {
        const seatId = `${band.bandId}${seatCounter}`;
        allSeats.push({
          id: seatId,
          band: band.bandId,
          row: currentRow,
          number: seatCounter, // Use continuous numbering
          occupied: occupiedSeats.includes(seatId),
        });
        seatCounter++; // Increment for next seat
      }
      currentRow++; // Move to next row after completing seats in current row
    }
  });

  return allSeats;
}

function calculateTotalPrice(seats: Seat[], selectedSeats: string[]): number {
  return selectedSeats.reduce((total, seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return total;
    const bandConfig = BAND_CONFIG.find((b) => b.bandId === seat.band);
    return total + (bandConfig?.price || 0);
  }, 0);
}

function clearLocalStorage(): void {
  localStorage.removeItem("occupiedSeats");
  localStorage.removeItem("countdownTimer");
  localStorage.removeItem("seatsByBand");
  localStorage.removeItem("counterEndTime");
}

function getSeatsByBand(selectedSeats: string[]): SeatsByBand {
  return selectedSeats.reduce<SeatsByBand>((acc, seat) => {
    const band = seat.charAt(0); // First letter of seat (A, B, C)
    acc[band] = (acc[band] || 0) + 1;
    return acc;
  }, {});
}

async function verifySeats(
  eventId: string | undefined,
  showId: string | undefined,
  selectedSeats: string[]
): Promise<void> {
  if (!eventId || !showId) {
    throw new Error("Event ID or Show ID is missing");
  }
  const path = `api/v1/seats/verify/${eventId}/${showId}`;
  postData(path, selectedSeats);
}

function saveToLocalStorage(
  eventId: string | undefined,
  showId: string | undefined,
  selectedSeats: string[]
): void {
  if (!eventId || !showId) return;

  const occupiedSeats: OccupiedSeatsStorage = {
    selectedSeats,
    eventId,
    showId,
    timestamp: new Date().getTime(),
  };

  localStorage.setItem("occupiedSeats", JSON.stringify(occupiedSeats));
  localStorage.setItem(
    "seatsByBand",
    JSON.stringify(getSeatsByBand(selectedSeats))
  );
}

export default BookSeats;

// Loader function
export const loader = async ({ params }: any) => {
  if (!params.eventId || !params.showId) {
    return [];
  }
  const path = `api/v1/seats/booked-seats/${params.eventId}/${params.showId}`;
  const response = getData(path).then((data) => data || []);
  return await response;
};
