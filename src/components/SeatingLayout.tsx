import React, { useState } from 'react';

interface Seat {
  id: string;
  band: 'A' | 'B' | 'C';
  row: number;
  number: number;
  occupied: boolean;
}

const SeatLayout: React.FC = () => {
  const [seats] = useState<Seat[]>(() => {
    const allSeats: Seat[] = [];

    const occupiedSeats = ['C28', 'C30', 'C32', 'C34', 'C36', 'C38', 'C40', 'C42', 'C44', 'A4', 'A6', 'A20', 'A22', 'A34', 'A36', 'B5', 'B7', 'B9', 'B11', 'B13', 'B15', 'B17', 'B19', 'B21'];
    
    // Band A: 2 rows * 20 seats = 40 seats, numbers 1-40
    let seatCounterA = 1;
    for (let row = 1; row <= 2; row++) {
      for (let num = 1; num <= 20; num++) {
        allSeats.push({
          id: `A-${row}-${seatCounterA}`,
          band: 'A',
          row,
          number: seatCounterA,
          occupied: occupiedSeats.includes(`A${seatCounterA}`)
        });
        seatCounterA++;
      }
    }
    
    // Band B: 3 rows * 20 seats = 60 seats, numbers 1-60
    let seatCounterB = 1;
    for (let row = 3; row <= 6; row++) {
      for (let num = 1; num <= 20; num++) {
        allSeats.push({
          id: `B-${row}-${seatCounterB}`,
          band: 'B',
          row,
          number: seatCounterB,
          occupied: occupiedSeats.includes(`B${seatCounterB}`)
        });
        seatCounterB++;
      }
    }
    
    // Band C: 4 rows * 20 seats = 80 seats, numbers 1-80
    let seatCounterC = 1;
    for (let row = 7; row <= 10; row++) {
      for (let num = 1; num <= 20; num++) {
        allSeats.push({
          id: `C-${row}-${seatCounterC}`,
          band: 'C',
          row,
          number: seatCounterC,
          occupied: occupiedSeats.includes(`C${seatCounterC}`)
        });
        seatCounterC++;
      }
    }
    
    return allSeats;
  });

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.occupied) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(id => id !== seat.id);
      }
      return [...prev, seat.id];
    });
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return total;
    return total + (seat.band === 'A' ? 50 : seat.band === 'B' ? 35 : 20);
  }, 0)

  const renderRow = (rowSeats: Seat[]) => {
    const leftSection = rowSeats.slice(0, 6);
    const middleSection = rowSeats.slice(6, 14);
    const rightSection = rowSeats.slice(14, 20);

    return (
      <div className="flex justify-center items-center gap-6 mb-2">
        <div className="flex gap-2">
          {leftSection.map(seat => (
            <div
              key={seat.id}
              className={`w-10 h-10 rounded cursor-pointer transition-colors flex items-center justify-center text-sm
                ${seat.occupied 
                  ? 'border-2 border-gray-400 text-white  cursor-not-allowed bg-gray-400' 
                  : 'border-2 border-gray-500 text-black  hover:border-cyan-900 hover:bg-cyan-900 hover:text-white'
                }
                ${selectedSeats.includes(seat.id) ? 'border-cyan-800 bg-cyan-800 text-white' : ''}`}
              onClick={() => handleSeatClick(seat)}
              title={`Band ${seat.band} - Row ${seat.row} - Seat ${seat.number}`}
            >
              {seat.number}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {middleSection.map(seat => (
            <div
              key={seat.id}
              className={`w-10 h-10 rounded cursor-pointer transition-colors flex items-center justify-center text-sm
                ${seat.occupied 
                  ? 'border-2 border-gray-400 text-white  cursor-not-allowed bg-gray-400' 
                  : 'border-2 border-gray-500 text-black  hover:border-cyan-900 hover:bg-cyan-900 hover:text-white'
                }
                ${selectedSeats.includes(seat.id) ? 'border-cyan-800 bg-cyan-800 text-white' : ''}`}
              onClick={() => handleSeatClick(seat)}
              title={`Band ${seat.band} - Row ${seat.row} - Seat ${seat.number}`}
            >
              {seat.number}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {rightSection.map(seat => (
            <div
              key={seat.id}
              className={`w-10 h-10 rounded cursor-pointer transition-colors flex items-center justify-center text-sm
                ${seat.occupied 
                  ? 'border-2 border-gray-400 text-white  cursor-not-allowed bg-gray-400' 
                  : 'border-2 border-gray-500 text-black  hover:border-cyan-900 hover:bg-cyan-900 hover:text-white'
                }
                ${selectedSeats.includes(seat.id) ? 'border-cyan-800 bg-cyan-800 text-white' : ''}`}
              onClick={() => handleSeatClick(seat)}
              title={`Band ${seat.band} - Row ${seat.row} - Seat ${seat.number}`}
            >
              {seat.number}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const rows = Array.from({ length: 10 }, (_, i) => i + 1).map(rowNum =>
    seats.filter(seat => seat.row === rowNum)
  );

  return (
    <div className="min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">Community Theater Seating</h1>
      
      <div className="max-w-5xl mx-auto">
        {/* Stage */}
        <div className="bg-gray-300 h-16 mb-8 flex items-center justify-center rounded">
          <span className="text-xl">Stage</span>
        </div>

        {/* Seating Area */}
        <div className=" overflow-y-auto overflow-x-auto">
          <div className='min-w-fit'>
          <div className="text-center mb-2 text-lg font-semibold">Band A</div>
          {rows.slice(0, 2).map((rowSeats, index) => (
            <div key={index}>{renderRow(rowSeats)}</div>
          ))}
          
          <div className="text-center mb-2 text-lg font-semibold mt-5">Band B</div>
          {rows.slice(2, 6).map((rowSeats, index) => (
            <div key={index + 2}>{renderRow(rowSeats)}</div>
          ))}
          
          <div className="text-center mb-2 text-lg font-semibold mt-5">Band C</div>
          {rows.slice(6, 10).map((rowSeats, index) => (
            <div key={index + 5}>{renderRow(rowSeats)}</div>
          ))}
        </div>
          </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-500 rounded " />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-cyan-800 bg-cyan-800 rounded " />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 bg-gray-400 rounded " />
            <span>Occupied</span>
          </div>
        </div>

        {/* Selected Seats Info */}
        {selectedSeats.length > 0 && (
          <div className="mt-4 text-center">
            <p>Selected Seats: {selectedSeats.length}</p>
            <p>Total Price: ${totalPrice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatLayout;