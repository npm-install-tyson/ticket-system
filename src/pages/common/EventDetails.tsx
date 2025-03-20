import { FormEvent, useEffect, useState } from "react";
import { PlusCircleIcon, StarIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  LoaderFunctionArgs,
  Navigate,
  useLoaderData,
  useOutletContext,
} from "react-router";
import { formatDate } from "../../util/formatdate";
import { TrashIcon } from "@heroicons/react/24/outline";
import Reviews from "../../components/Reviews";
import ShowTimesList from "../../components/ShowTimeList";
import {
  ADDNEWSHOWTIME,
  EVENTDETAILS,
  REVIEW,
  SHOWTIME,
  USER,
} from "../../util/types";
import { getData, postData } from "../../services/api/fetchAPI";

// Component
const EventDetails = () => {
  const user: USER = useOutletContext();

  if (user == undefined) {
    return <Navigate to={"/auth/login"} replace />;
  }

  const [reviews, setReviews] = useState<REVIEW[]>([]);
  const [showTimes, setShowTimes] = useState<SHOWTIME[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newShowTimes, setNewShowTimes] = useState<ADDNEWSHOWTIME[]>([
    { date: "", time: "" },
  ]);

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  console.log(reviews);

  // Hooks
  const eventDetails = useLoaderData() as EVENTDETAILS;

  // showTimeUrl
  const showTimePath = `event/${eventDetails.eventId}/get-show-times`;
  const reviewPath = `api/v1/reviews/all/${eventDetails.eventId}`;

  // Effects
  useEffect(() => {
    getData(showTimePath).then((data: SHOWTIME[]) => setShowTimes(data));
    getData(reviewPath).then((data: REVIEW[]) => setReviews(data));
  }, []);

  // Handlers
  const handleAddTime = () => {
    setNewShowTimes([...newShowTimes, { date: "", time: "" }]);
  };

  const handleRemoveTime = (index: number) => {
    const updatedTimes = newShowTimes.filter((_, i) => i !== index);
    setNewShowTimes(updatedTimes);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedTimes = newShowTimes.map((time, i) => {
      if (i === index) {
        return { ...time, [field]: value };
      }
      return time;
    });
    setNewShowTimes(updatedTimes);
  };

  const handleSaveShowTimes = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedShowTimes = newShowTimes
      .map((d) => (d.date && d.time ? `${d.date}T${d.time}` : null))
      .filter(Boolean);
    const postUrlPath = `event/add-show-times`;
    const reqData = {
      eventId: eventDetails.eventId,
      showTimes: formattedShowTimes,
    };
    postData(postUrlPath, reqData).then(() =>
      getData(showTimePath).then((showTimes: SHOWTIME[]) =>
        setShowTimes(showTimes)
      )
    );
    // Reset form and reload data
    setIsDialogOpen(false);
    setNewShowTimes([{ date: "", time: "" }]);
  };

  // Sub-components for better organization
  const renderEventHeader = () => (
    <div className="flex flex-col-reverse">
      <div className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {eventDetails.name}
        </h1>
        <h2 id="information-heading" className="sr-only">
          Product information
        </h2>
        <p className="mt-2 text-sm text-gray-500 capitalize">
          {eventDetails.genre}
        </p>
      </div>
      <div>
        <h3 className="sr-only">Reviews</h3>
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              aria-hidden="true"
              className={`size-5 shrink-0 ${
                averageRating > rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderEventDetails = () => (
    <div className="mt-10">
      <h3 className="text-sm font-medium text-gray-900">Event Details</h3>
      <div className="mt-4">
        <ul role="list" className="space-y-1 text-sm/6 text-gray-500">
          <li>
            Date: {formatDate(new Date(eventDetails.startDate))} -{" "}
            {formatDate(new Date(eventDetails.endDate))}
          </li>
          <li>Venue: {eventDetails.venue || "Greenwich Community Theatre"}</li>
          <li>Runtime: {eventDetails.duration}</li>
          <li>Director: {eventDetails.director}</li>
          <li>Producer: {eventDetails.producer}</li>
        </ul>
      </div>
    </div>
  );

  const renderShowTimeDialog = () => (
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

  const renderReviewForm = () => {
    const [hover, setHover] = useState(1);
    const [rating, setRating] = useState(1);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [reviewDescription, setReviewDescription] = useState("");
    const [userName, setUserName] = useState("");
    const [isReviewSuccess, setUsReviewSuccess] = useState(false);

    const handleClick = (value: number) => {
      setRating(value);
    };

    const reviewHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const path = "api/v1/reviews/save";
      const review: REVIEW = {
        userName: isAnonymous ? "" : userName,
        rating,
        description: reviewDescription,
        eventId: eventDetails.eventId,
      };
      postData(path, review).then(
        (res) => res?.data && setUsReviewSuccess(true)
      );
      setUserName("");
      setReviewDescription("");
      setRating(1);
      setIsAnonymous(false);
    };

    return (
      <div className="mt-10 border-t border-gray-200 pt-10">
        <h3 className="text-md font-bold text-gray-900">Write a review</h3>
        <form className="mt-4 space-y-2" onSubmit={reviewHandler}>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const value = index + 1;
              return (
                <StarIcon
                  key={value}
                  className={`size-7 shrink-0 pr-1 ${
                    value <= (hover || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => handleClick(value)}
                />
              );
            })}
          </div>
          {!isAnonymous && (
            <div>
              <label
                htmlFor="userName"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                />
              </div>
            </div>
          )}
          <div className="flex gap-x-2">
            <input
              type="checkbox"
              name="anonymus"
              id="anonymus"
              className=""
              onChange={() => setIsAnonymous((pre) => !pre)}
              checked={isAnonymous}
            />
            <label htmlFor="anonymus" className="text-sm/6 font-medium">
              Write as an anonymus
            </label>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="about"
              className="block text-sm/6 font-medium text-gray-900"
            >
              About this play
            </label>
            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                rows={3}
                onChange={(e) => setReviewDescription(e.target.value)}
                value={reviewDescription}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
              />
            </div>
            <p className="mt-3 text-sm/6 text-gray-600">
              Write a few sentences about this play.
            </p>
          </div>
          <div className="flex flex-row-reverse justify-between items-center">
            <button
              type="submit"
              className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              Save
            </button>
            {isReviewSuccess && (
              <p className=" text-sm text-green-600 font-medium">
                Thank you for the review!
              </p>
            )}
          </div>
        </form>
      </div>
    );
  };

  // Main render
  return (
    <div className="mx-auto lg:max-w-7xl">
      <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        {/* Event image */}
        <div className="lg:col-span-4 lg:row-end-1">
          <img
            src={eventDetails.imageUrl}
            alt={eventDetails.name}
            className="aspect-4/3 w-full rounded-lg object-contain"
          />
        </div>

        {/* Event details */}
        <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:w-full">
          {renderEventHeader()}
          <p className="mt-6 text-gray-500 text-justify">
            {eventDetails.description}
          </p>
          {renderEventDetails()}
          <ShowTimesList
            showTimes={showTimes}
            setIsDialogOpen={setIsDialogOpen}
          />
          {renderShowTimeDialog()}
          {user.role === "USER" && renderReviewForm()}
        </div>

        {/* Reviews section */}
        <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
          <Reviews reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

// Data loader
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const path = `event/get-event?id=${params.id}`;
  const data = await getData(path).then((data) => data);
  return data;
};
