import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import FormField from "../../components/FormField";
import { v4 as uuidv4 } from "uuid";

interface FormData {
  name: string;
  description: string;
  genre: string;
  startDate: string;
  endDate: string;
  runTimeHour: string;
  runTimeMin: string;
  producer: string;
  director: string;
}

const GENRES: Genre[] = [
  { id: 1, name: "musical" },
  { id: 2, name: "drama" },
  { id: 3, name: "comedy" },
  { id: 4, name: "children" },
];

interface Genre {
  id: number;
  name: string;
}

const HOURS = [1, 2, 3, 4, 5];
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const INITIAL_FORM_STATE: FormData = {
  name: "",
  description: "",
  genre: GENRES[0].name,
  startDate: "",
  endDate: "",
  runTimeHour: HOURS[0].toString(),
  runTimeMin: MINUTES[0].toString(),
  producer: "",
  director: "",
};

const AddEvent = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate > endDate) {
        throw new Error("Start date cannot be after end date");
      }

      const eventDetails = {
        eventId: uuidv4(),
        ...formData,
        duration: `${formData.runTimeHour}${
          parseInt(formData.runTimeHour) < 2 ? "hr" : "hrs"
        } ${formData.runTimeMin}${
          parseInt(formData.runTimeMin) < 2 ? "min" : "mins"
        }`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append(
        "eventDetails",
        new Blob([JSON.stringify(eventDetails)], {
          type: "application/json",
        })
      );

      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await axios.post(
        "http://192.168.165.169:8080/event/add-event",
        formDataToSend,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (response.data) {
        resetForm();
        setMessage("Event added successfully!");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setMessage(error.message || "Failed to submit form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setImage(null);
    setImagePreview("");
  };

  return (
    <div className="mx-auto max-w-2xl lg:max-w-7xl">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Add Event</h2>
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-600">
              Add the information related to the event.
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              {/* Event Name Input */}
              <FormField
                label="Event Name"
                name="name"
                type="text"
                placeholder="Peter Pan"
                value={formData.name}
                onChange={handleInputChange}
              />

              {/* Description Input */}
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="description"
                  className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
                >
                  Description
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-900 sm:max-w-2xl sm:text-sm/6"
                  />
                  <p className="mt-3 text-sm/6 text-gray-600">
                    Write a few sentences about the event.
                  </p>
                </div>
              </div>

              {/* Genre Select */}
              <FormField
                label="Event Genre"
                name="genre"
                type="select"
                value={formData.genre}
                onChange={handleInputChange}
                options={GENRES.map((g) => ({ value: g.name, label: g.name }))}
              />

              {/* Image Upload */}
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="poster"
                  className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
                >
                  Event Poster
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  {imagePreview ? (
                    <div className="flex flex-col max-w-2xl justify-center gap-y-2">
                      <img
                        src={imagePreview}
                        className="border rounded-lg border-gray-900/25"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview("")}
                        className="w-fit self-end rounded-md bg-cyan-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-cyan-800"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <PhotoIcon className="mx-auto size-12 text-gray-300" />
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                          <label className="relative cursor-pointer rounded-md bg-white font-semibold text-cyan-900 focus-within:ring-2 focus-within:ring-cyan-900 focus-within:ring-offset-2 hover:text-cyan-800">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs/5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Duration */}
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                  Event Duration
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0 flex gap-x-2 items-center">
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-cyan-900"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-cyan-900"
                  />
                </div>
              </div>

              {/* Runtime */}
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                  Runtime
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0 flex gap-x-2">
                  <select
                    name="runTimeHour"
                    value={formData.runTimeHour}
                    onChange={handleInputChange}
                    className="rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-cyan-900"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={`${h}`}>
                        {h}
                        {h < 2 ? "hr" : "hrs"}
                      </option>
                    ))}
                  </select>
                  <select
                    name="runTimeMin"
                    value={formData.runTimeMin}
                    onChange={handleInputChange}
                    className="rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-cyan-900"
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={`${m}`}>
                        {m}
                        {m < 2 ? "min" : "mins"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Producer Name */}
              <FormField
                label="Producer Name"
                name="producer"
                type="text"
                placeholder="Producer name"
                value={formData.producer}
                onChange={handleInputChange}
              />

              {/* Director Name */}
              <FormField
                label="Director Name"
                name="director"
                type="text"
                placeholder="Director name"
                value={formData.director}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {message && <div className="mt-4 text-sm text-red-600">{message}</div>}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-md bg-cyan-900 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-900 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
