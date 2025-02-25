import { FormEvent, Fragment, useEffect, useState } from "react";
import { PlusCircleIcon, StarIcon } from "@heroicons/react/20/solid";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { formatDate } from "../../util/formatdate";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import fetchData from "../../util/fetchAPI";

const reviews = {
  average: 4,
  featured: [
    {
      id: 1,
      rating: 5,
      content: `
        <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
      `,
      date: "July 16, 2021",
      datetime: "2021-07-16",
      author: "Emily Selman",
      avatarSrc:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    },
    {
      id: 2,
      rating: 5,
      content: `
        <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
      `,
      date: "July 12, 2021",
      datetime: "2021-07-12",
      author: "Hector Gibbons",
      avatarSrc:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    },
    // More reviews...
  ],
};

interface NewShowTime {
  date: string;
  time: string;
}

interface EventDetails {
  id: string;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  duration: string;
  director: string;
  producer: string;
  venue: string;
}

// Helper function to format datetime
const formatShowtime = (datetime: string): { date: string; time: string } => {
  const date = new Date(datetime);
  return {
    date: formatDate(date),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const EventDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const eventDetails = dummyEventDetails;
  const eventDetails = useLoaderData();

  const [open, setOpen] = useState(false);

  const [newShowTime, setNewShowTime] = useState<NewShowTime[]>([
    { date: "", time: "" },
  ]);

  const handleAddTime = () => {
    setNewShowTime([...newShowTime, { date: "", time: "" }]);
  };

  const handleRemoveTime = (index: number) => {
    const updatedTimes = newShowTime.filter((_, i) => i !== index);
    setNewShowTime(updatedTimes);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedTimes = newShowTime.map((time, i) => {
      if (i === index) {
        return { ...time, [field]: value };
      }
      return time;
    });
    setNewShowTime(updatedTimes);
  };

  const saveShowTimeHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const filterData = newShowTime.map((d) => {
      if (d.date !== "" && d.time !== "") {
        return d.date + "T" + d.time;
      }
    });

    try {
      // Send JSON payload instead of FormData
      await axios.post(
        "http://192.168.165.169:8080/event/add-show-times",
        {
          eventId: eventDetails.eventId,
          showTimes: filterData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    } catch (error: any) {
      console.error("Submission error:", error);
    } finally {
      setOpen(false);
      setIsLoading(false);
      setNewShowTime([{ date: "", time: "" }]);
      fetchData(url, setShowTimes);
    }
  };

  const [error, setError] = useState(null);

  const [showTimes, setShowTimes] = useState([]);

  const url = `http://192.168.165.169:8080/event/${eventDetails.eventId}/get-show-times`;

  useEffect(() => {
    fetchData(url, setShowTimes);
  }, []);

  return (
    <div className="mx-auto lg:max-w-7xl">
      {/* Product */}
      <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        {/* Product image */}
        <div className="lg:col-span-4 lg:row-end-1">
          <img
            src={eventDetails.imageUrl}
            className={`aspect-4/3 w-full rounded-lg object-contain`}
          />
        </div>

        {/* Product details */}
        <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:w-full">
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
                    className={classNames(
                      reviews.average > rating
                        ? "text-yellow-400"
                        : "text-gray-300",
                      "size-5 shrink-0"
                    )}
                  />
                ))}
              </div>
              <p className="sr-only">{reviews.average} out of 5 stars</p>
            </div>
          </div>

          <p className="mt-6 text-gray-500 text-justify">
            {eventDetails.description}
          </p>

          <div className="mt-10">
            <h3 className="text-sm font-medium text-gray-900">Event Details</h3>
            <div className="mt-4">
              <ul role="list" className="space-y-1 text-sm/6 text-gray-500">
                <li>
                  Date: {formatDate(new Date(eventDetails.startDate))} -{" "}
                  {formatDate(new Date(eventDetails.endDate))}
                </li>
                <li>Venue: Greenwich Community Theatre</li>
                <li>Runtime: {eventDetails.duration}</li>
                <li>Director: {eventDetails.director}</li>
                <li>Producer: {eventDetails.producer}</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-10">
            <div className="flex gap-x-4 items-center">
              <h3 className="text-md font-bold text-gray-900">Show Times</h3>
              <button
                onClick={() => setOpen(true)}
                className="text-xs flex items-center gap-x-1 text-white bg-cyan-900 hover:bg-cyan-900 px-2 py-1 rounded-md"
              >
                <PlusCircleIcon className="w-5" />
                Add Show Time
              </button>
            </div>
            <div className="mt-4 w-full">
              <ul role="list" className="space-y-3 text-sm/6 text-gray-500">
                {showTimes.map((showtime: any, index: number) => {
                  const showTime = formatShowtime(showtime.showTime);

                  return (
                    <li key={index} className="flex w-full items-center">
                      <div className="basis-2/3 flex justify-between">
                        <span className="w-full">{showTime.date}</span>
                        <span className="w-full text-center">
                          {showTime.time}
                        </span>
                      </div>
                      <div className="basis-1/3 flex justify-end gap-x-3">
                        <Link
                          to={`/admin/events/${eventDetails.eventId}/book/${showtime.id}`}
                          className="bg-cyan-900 text-white rounded-md px-2 py-1 hover:bg-cyan-900"
                        >
                          Book Seats
                        </Link>
                        <button>
                          <PencilSquareIcon className="w-5 text-cyan-900 hover:text-cyan-800" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                  <form onSubmit={saveShowTimeHandler}>
                    <ul className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col gap-y-3">
                      {newShowTime.map((showtime, index) => (
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
                            {index === newShowTime.length - 1 ? (
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
                        disabled={isLoading}
                        className="inline-flex w-full justify-center rounded-md bg-cyan-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-cyan-900 sm:ml-3 sm:w-auto"
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        data-autofocus
                        onClick={() => {
                          setOpen(false);
                          setNewShowTime([{ date: "", time: "" }]);
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

          <div className="mt-10 border-t border-gray-200 pt-10">
            <h3 className="text-sm font-medium text-gray-900">Share</h3>
            <ul role="list" className="mt-4 flex items-center space-x-6">
              <li>
                <a
                  href="#"
                  className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Share on Facebook</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path
                      d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Share on Instagram</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-6"
                  >
                    <path
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Share on X</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
          <TabGroup>
            <div className="border-b border-gray-200">
              <TabList className="-mb-px flex space-x-8">
                <Tab className="border-b-2 border-transparent py-6 text-sm font-medium whitespace-nowrap text-gray-700 hover:border-gray-300 hover:text-gray-800 data-selected:border-cyan-900 data-selected:text-cyan-900">
                  Customer Reviews
                </Tab>
              </TabList>
            </div>
            <TabPanels as={Fragment}>
              <TabPanel className="-mb-10">
                <h3 className="sr-only">Customer Reviews</h3>

                {reviews.featured.map((review, reviewIdx) => (
                  <div
                    key={review.id}
                    className="flex space-x-4 text-sm text-gray-500"
                  >
                    <div className="flex-none py-10">
                      <img
                        alt=""
                        src={review.avatarSrc}
                        className="size-10 rounded-full bg-gray-100"
                      />
                    </div>
                    <div
                      className={classNames(
                        reviewIdx === 0 ? "" : "border-t border-gray-200",
                        "py-10"
                      )}
                    >
                      <h3 className="font-medium text-gray-900">
                        {review.author}
                      </h3>
                      <p>
                        <time dateTime={review.datetime}>{review.date}</time>
                      </p>

                      <div className="mt-4 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(
                              review.rating > rating
                                ? "text-yellow-400"
                                : "text-gray-300",
                              "size-5 shrink-0"
                            )}
                          />
                        ))}
                      </div>
                      <p className="sr-only">{review.rating} out of 5 stars</p>

                      <div
                        dangerouslySetInnerHTML={{ __html: review.content }}
                        className="mt-4 text-sm/6 text-gray-500"
                      />
                    </div>
                  </div>
                ))}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const detailResponse = await fetch(
      `http://192.168.165.169:8080/event/get-event?id=${params.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!detailResponse.ok) {
      throw new Error("Failed to fetch events");
    }
    const eventDetails = await detailResponse.json();
    return eventDetails;
  } catch (error) {
    console.error("Error loading events:", error);
    throw error;
  }
};
