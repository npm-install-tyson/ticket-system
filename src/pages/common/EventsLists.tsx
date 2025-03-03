import { useLoaderData } from "react-router";
import EventCard from "../../components/EventCard";
import { EVENTDETAILS, GENRE } from "../../util/types";
import { getData } from "../../services/api/fetchAPI";

const EventLists = () => {
  // In a real app, this would come from useLoaderData()
  // const eventData = DUMMY_EVENTS;
  const eventData = useLoaderData();

  const genres: GENRE[] = [
    {
      id: 1,
      name: "musical",
    },
    {
      id: 2,
      name: "drama",
    },
    {
      id: 3,
      name: "comedy",
    },
    {
      id: 4,
      name: "children",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl lg:max-w-7xl">
      <h2 className="text-2xl font-extrabold text-gray-900">Manage Events</h2>

      {eventData.length > 0 &&
        genres.map((genre, index) => (
          <div key={index} className="mt-8 flex flex-col">
            <h1 className="text-xl font-bold capitalize">{genre.name}</h1>
            <div className="mt-4 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {eventData.map((event: EVENTDETAILS) => {
                if (
                  event.genre === genre.name &&
                  new Date(event.endDate) > new Date()
                ) {
                  return <EventCard key={event.eventId} event={event} />;
                }
                return null;
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default EventLists;

// Loader function for when API is working
export const loader = async () => {
  // const token = localStorage.getItem("token"); // Add your authentication token here
  // try {
  //   const response =
  //     token &&
  //     (await fetch("http://127.0.0.1:8080/event/get-all-events", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: `Bearer ${token}`, // Add your authentication token here
  //       },
  //     }));
  //   if (response && !response.ok) {
  //     throw new Error("Failed to fetch events");
  //   }

  //   const data = response && (await response.json());

  //   return data;
  // } catch (error) {
  //   console.error("Error loading events:", error);
  //   return [];
  // }
  const path = "event/get-all-events";
  const data = await getData(path).then((data) => data || []);
  return data;
};
