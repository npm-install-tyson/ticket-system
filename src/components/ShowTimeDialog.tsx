import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import { ADDNEWSHOWTIME, EVENTDETAILS } from "../util/types";

interface ChildProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleSaveShowTimes: any;
  newShowTimes: ADDNEWSHOWTIME[];
  handleInputChange: any;
  eventDetails: EVENTDETAILS;
  handleAddTime: any;
  handleRemoveTime: any;
  setNewShowTimes: Dispatch<SetStateAction<ADDNEWSHOWTIME[]>>;
}

export const ShowTimeDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  handleSaveShowTimes,
  newShowTimes,
  handleInputChange,
  eventDetails,
  handleAddTime,
  handleRemoveTime,
  setNewShowTimes,
}: ChildProps) => (
  <Dialog
    open={isDialogOpen}
    onClose={setIsDialogOpen}
    className="relative z-10"
  >
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    />

    <div className="fixed inset-0 z-10 w-screen overflow-y-auto lg:pl-72">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <form onSubmit={handleSaveShowTimes}>
            <ul className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col gap-y-3">
              {newShowTimes.map((showtime, index) => (
                <li
                  className="flex mt-3 sm:mt-0 gap-x-2 items-center"
                  key={index}
                >
                  <div className="w-full">
                    <input
                      type="date"
                      value={showtime.date}
                      onChange={(e) =>
                        handleInputChange(index, "date", e.target.value)
                      }
                      min={
                        new Date(eventDetails.startDate)
                          .toISOString()
                          .split("T")[0]
                      }
                      max={
                        new Date(eventDetails.endDate)
                          .toISOString()
                          .split("T")[0]
                      }
                      className="block rounded-md w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-cyan-900 sm:max-w-md"
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="time"
                      value={showtime.time}
                      onChange={(e) =>
                        handleInputChange(index, "time", e.target.value)
                      }
                      className="block rounded-md w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-cyan-900 sm:max-w-md"
                    />
                  </div>
                  <div className="">
                    {index === newShowTimes.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleAddTime}
                        className="py-2 px-1 text-cyan-900 hover:text-cyan-900"
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemoveTime(index)}
                        className="py-2 px-1 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-cyan-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-cyan-900 sm:ml-3 sm:w-auto"
              >
                Save
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => {
                  setIsDialogOpen(false);
                  setNewShowTimes([{ date: "", time: "" }]);
                }}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);
