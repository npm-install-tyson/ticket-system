import { useLoaderData } from "react-router";
import EventCard from "../../components/EventCard";

interface Event {
  eventId: string;
  name: string;
  genre: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
}

// const DUMMY_EVENTS: Event[] = [
//   {
//     eventId: "1",
//     name: "The Phantom of the Opera",
//     genre: "musical",
//     startDate: "2025-03-15T00:00:00.000Z",
//     endDate: "2025-04-15T00:00:00.000Z",
//     imageUrl:
//       "https://greenwichtheatre.org.uk/wp-content/uploads/2024/11/Website-Size-10.png",
//   },
//   {
//     eventId: "2",
//     name: "Hamlet",
//     genre: "drama",
//     startDate: "2025-03-20T00:00:00.000Z",
//     endDate: "2025-04-10T00:00:00.000Z",
//     imageUrl:
//       "https://greenwichtheatre.org.uk/wp-content/uploads/2024/11/Website-Size-10.png",
//   },
//   {
//     eventId: "3",
//     name: "The Lion King",
//     genre: "musical",
//     startDate: "2025-04-01T00:00:00.000Z",
//     endDate: "2025-05-01T00:00:00.000Z",
//     imageUrl:
//       "https://greenwichtheatre.org.uk/wp-content/uploads/2024/11/Website-Size-10.png",
//   },
//   {
//     eventId: "4",
//     name: "Peter Pan",
//     genre: "children",
//     startDate: "2025-04-10T00:00:00.000Z",
//     endDate: "2025-05-10T00:00:00.000Z",
//     imageUrl:
//       "https://greenwichtheatre.org.uk/wp-content/uploads/2024/11/Website-Size-10.png",
//   },
// ];

const EventLists = () => {
  // In a real app, this would come from useLoaderData()
  // const eventData = DUMMY_EVENTS;
  const eventData = useLoaderData();

  return (
    <div className="mx-auto max-w-2xl lg:max-w-7xl">
      <h2 className="text-2xl font-extrabold text-gray-900">Manage Events</h2>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {eventData.map((event:Event) => (
            <EventCard key={event.eventId} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventLists;

// Loader function for when API is working
export const loader = async () => {
  try {
    const response = await fetch("http://192.168.165.169:8080/event/get-all-events", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error loading events:", error);
    throw error;
  }
};
