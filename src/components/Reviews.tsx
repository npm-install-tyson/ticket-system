import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { REVIEW } from "../util/types";
import { StarIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/20/solid";

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

const Reviews = ({ reviews }: { reviews: REVIEW[] }) => (
  <TabGroup>
    <div className="border-b border-gray-200">
      <TabList className="-mb-px flex space-x-8">
        <Tab className="border-b-2 border-transparent py-6 text-sm font-medium whitespace-nowrap text-gray-700 hover:border-gray-300 hover:text-gray-800 data-selected:border-cyan-900 data-selected:text-cyan-900">
          Customer Reviews
        </Tab>
      </TabList>
    </div>
    <TabPanels as={Fragment}>
      <TabPanel className="-mb-10 overflow-scroll h-150">
        <h3 className="sr-only">Customer Reviews</h3>

        {reviews.map((review: REVIEW, index: number) => (
          <div
            key={review.reviewId}
            className="flex space-x-4 text-sm text-gray-500"
          >
            <div className="flex-none py-10">
              <UserCircleIcon className="size-10 rounded-full bg-gray-100" />
            </div>
            <div
              className={classNames(
                index === 0 ? "" : "border-t border-gray-200",
                "py-10"
              )}
            >
              <h3 className="font-medium text-gray-900">{review.userName}</h3>
              <p>
                <time dateTime={review.reviewdDate}>{review.reviewdDate}</time>
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
                dangerouslySetInnerHTML={{ __html: review.description }}
                className="mt-4 text-sm/6 text-gray-500"
              />
            </div>
          </div>
        ))}
      </TabPanel>
    </TabPanels>
  </TabGroup>
);

export default Reviews;
