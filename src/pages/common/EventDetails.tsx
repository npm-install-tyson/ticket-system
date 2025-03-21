import { FormEvent, useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  Navigate,
  useLoaderData,
  useOutletContext,
} from "react-router";
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
import { ReviewForm } from "../../components/ReviewForm";
import { ShowTimeDialog } from "../../components/ShowTimeDialog";
import { EventDetailsSection } from "../../components/EventDetailsSection";
import { EventHeaderSection } from "../../components/EventHeaderSection";

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
          <EventHeaderSection
            eventDetails={eventDetails}
            averageRating={averageRating}
          />
          <p className="mt-6 text-gray-500 text-justify">
            {eventDetails.description}
          </p>
          <EventDetailsSection eventDetails={eventDetails} />
          <ShowTimesList
            showTimes={showTimes}
            setIsDialogOpen={setIsDialogOpen}
          />
          <ShowTimeDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            newShowTimes={newShowTimes}
            setNewShowTimes={setNewShowTimes}
            handleSaveShowTimes={handleSaveShowTimes}
            handleInputChange={handleInputChange}
            eventDetails={eventDetails}
            handleAddTime={handleAddTime}
            handleRemoveTime={handleRemoveTime}
          />
          {user.role === "USER" && <ReviewForm eventDetails={eventDetails} />}
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
