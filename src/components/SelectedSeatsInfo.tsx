interface SelectedSeatsInfoProps {
  selectedSeats: string[];
  totalPrice: number;
  onContinue: () => void;
}

export const SelectedSeatsInfo: React.FC<SelectedSeatsInfoProps> = ({
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
