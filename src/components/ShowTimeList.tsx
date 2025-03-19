import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { formatShowtime } from "../util/formatShowtime";
import { Link, useOutletContext } from "react-router";
import { SHOWTIME, USER } from "../util/types";
import { Dispatch, SetStateAction } from "react";

interface ChildProps {
  showTimes: SHOWTIME[];
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const ShowTimesList = ({ showTimes, setIsDialogOpen }: ChildProps) => {
  const user: USER = useOutletContext();
  return (
    <div className="mt-10 border-t border-gray-200 pt-10">
      <div className="flex gap-x-4 items-center">
        <h3 className="text-md font-bold text-gray-900">Show Times</h3>
        {user && user.role === "ADMIN" && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="text-xs flex items-center gap-x-1 text-white bg-cyan-900 hover:bg-cyan-900 px-2 py-1 rounded-md"
          >
            <PlusCircleIcon className="w-5" />
            Add Show Time
          </button>
        )}
      </div>
      <div className="mt-4 w-full">
        <ul role="list" className="space-y-3 text-sm/6 text-gray-500">
          {showTimes
            .sort(
              (a: SHOWTIME, b: SHOWTIME) =>
                new Date(a.showTime).getTime() - new Date(b.showTime).getTime()
            )
            .map((showtime: SHOWTIME, index: number) => {
              const formattedTime = formatShowtime(showtime.showTime);

              if (new Date(showtime.showTime) > new Date()) {
                return (
                  <li key={index} className="flex w-full items-center">
                    <div className="basis-2/3 flex justify-between">
                      <span className="w-full">{formattedTime.date}</span>
                      <span className="w-full text-center">
                        {formattedTime.time}
                      </span>
                    </div>
                    <div className="basis-1/3 flex justify-end gap-x-3">
                      <Link
                        to={showtime.id}
                        className="bg-cyan-900 text-white rounded-md px-2 py-1 hover:bg-cyan-900"
                      >
                        Book Seats
                      </Link>
                    </div>
                  </li>
                );
              }
            })}
        </ul>
      </div>
    </div>
  );
};

export default ShowTimesList;
