import { Seat } from "../util/types";

interface SeatButtonProps {
  seat: Seat;
  isSelected: boolean;
  onClick: () => void;
}

export const SeatButton: React.FC<SeatButtonProps> = ({
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
    <div className={getSeatClassName()} onClick={onClick}>
      {seat.number}
    </div>
  );
};
