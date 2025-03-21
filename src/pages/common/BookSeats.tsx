import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { BAND_CONFIG, EVENTDETAILS, Seat, SHOWTIME } from "../../util/types";
import { formatShowtime } from "../../util/formatShowtime";
import { getData, postData } from "../../services/api/fetchAPI";
import { SeatingArea } from "../../components/SeatingArea";
import { SeatLegend } from "../../components/SeatLegend";
import { SelectedSeatsInfo } from "../../components/SelectedSeatsInfo";

// Type definitions

interface SeatsByBand {
  [key: string]: number;
}

interface OccupiedSeatsStorage {
  selectedSeats: string[];
  eventId: string;
  showId: string;
  timestamp: number;
}

const bands: BAND_CONFIG[] = [
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
  const rowsByBand = bands.map((band) => ({
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
        <div className="bg-gray-300 h-16 mb-8 flex items-center justify-center rounded">
          <span className="text-xl">Stage</span>
        </div>
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

// Helper Functions
function generateSeats(occupiedSeats: string[]): Seat[] {
  const allSeats: Seat[] = [];
  let currentRow = 1;

  bands.forEach((band) => {
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
    const bandConfig = bands.find((b) => b.bandId === seat.band);
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
