import { useState } from "react";
import { EVENTDETAILS, REVIEW } from "../util/types";
import { postData } from "../services/api/fetchAPI";
import { StarIcon } from "@heroicons/react/20/solid";

export const ReviewForm = ({
  eventDetails,
}: {
  eventDetails: EVENTDETAILS;
}) => {
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
      (res: any) => res?.data && setUsReviewSuccess(true)
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
