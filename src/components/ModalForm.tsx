import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "axios";
import { FormEvent, useState } from "react";
import fetchData from "../util/fetchAPI";
import { BAND, DISCOUNT } from "../util/types";

const ModalForm = ({ setOpen, isOpen, type, setItems }: any) => {
  const [bandData, setBandData] = useState<BAND>({
    bandId: "A",
    seatsPerBand: 20,
    price: 0,
  });

  const [discountData, setDiscountData] = useState<DISCOUNT>({
    discountType: "CHILDREN",
    discountPercentage: 0,
  });

  const fetchURL =
    type === "band"
      ? `http://192.168.120.169:8080/api/v1/bands/all`
      : `http://192.168.120.169:8080/api/v1/discounts/all-discounts`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `http://192.168.120.169:8080/api/v1/${
      type === "band" ? "bands/create" : "discounts/create-discount"
    }`;
    try {
      // Send JSON payload instead of FormData
      await axios.post(url, type === "band" ? bandData : discountData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    } catch (error: any) {
      console.error("Submission error:", error);
    } finally {
      setOpen(false);
      setBandData({
        bandId: "A",
        seatsPerBand: 20,
        price: 0,
      });
      setDiscountData({
        discountType: "CHILDREN",
        discountPercentage: 0,
      });
      fetchData(fetchURL, setItems);
    }
  };

  return (
    <Dialog open={isOpen} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-aut lg:pl-72">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <form onSubmit={handleSubmit}>
              {type === "band" && (
                <div className="grid grid-cols-3 gap-x-2">
                  <div>
                    <label
                      htmlFor="bandType"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Band Type
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white px-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-600">
                        <select
                          name="bandType"
                          id="bandType"
                          onChange={(e) => {
                            const id = e.target.value;
                            setBandData({
                              ...bandData,
                              bandId: id,
                              seatsPerBand:
                                id === "A" ? 20 : id === "B" ? 60 : 80,
                            });
                          }}
                          className="min-w-fit grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        >
                          {["A", "B", "C"].map((band, index) => {
                            return (
                              <option key={index} value={band}>
                                {band}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="seatsPerBand"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Seats per band
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white px-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-600">
                        <input
                          readOnly
                          id="seatsPerBand"
                          name="seatsPerBand"
                          type="number"
                          value={bandData.seatsPerBand}
                          placeholder="20"
                          className=" block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Price
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white px-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-600">
                        <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                          £
                        </div>
                        <input
                          id="price"
                          name="price"
                          type="number"
                          placeholder="0.00"
                          value={bandData.price}
                          min={0}
                          onChange={(e) =>
                            setBandData({
                              ...bandData,
                              price: parseFloat(e.target.value),
                            })
                          }
                          aria-describedby="price-currency"
                          className=" block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        />
                        <div
                          id="price-currency"
                          className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"
                        >
                          GBP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {type === "discount" && (
                <div className="grid grid-cols-4 gap-x-2">
                  <div className=" col-span-3">
                    <label
                      htmlFor="discountType"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Discount Name
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white px-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-600">
                        <select
                          name="discountType"
                          id="discountType"
                          onChange={(e) => {
                            const type = e.target.value;
                            setDiscountData({
                              ...discountData,
                              discountType: type,
                            });
                          }}
                          className="min-w-fit grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        >
                          {[
                            "CHILDREN",
                            "PENSIONERS",
                            "SOCIAL_CLUB",
                            "QUANTITY",
                            "LAST_HOUR",
                            "WEEKDAY_SPECIAL",
                          ].map((type, index) => {
                            return (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="percentage"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Percentage
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white px-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-600">
                        <input
                          id="percentage"
                          name="percentage"
                          type="number"
                          value={discountData.discountPercentage}
                          onChange={(e) =>
                            setDiscountData({
                              ...discountData,
                              discountPercentage: parseInt(e.target.value),
                            })
                          }
                          min={0}
                          max={100}
                          placeholder="10"
                          aria-describedby="price-currency"
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        />
                        <div
                          id="price-currency"
                          className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"
                        >
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-cyan-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:col-start-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:col-start-1 sm:mt-0"
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
};

export default ModalForm;
