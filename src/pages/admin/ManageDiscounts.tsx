import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import ModalForm from "../../components/ModalForm";
import { DISCOUNT } from "../../util/types";
import { getData } from "../../services/api/fetchAPI";

const ManageDiscounts = () => {
  const [open, setOpen] = useState(false);
  const [discounts, setDiscounts] = useState<DISCOUNT[]>([]);

  const path = `api/v1/discounts/all-discounts`;

  useEffect(() => {
    getData(path).then((data) => data && setDiscounts(data));
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Discounts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of discounts type and their percentages based on the original
            seat ticket price.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="block rounded-md bg-cyan-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            Add/ Update Discount
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <DataTable
              data="discount"
              items={discounts}
              setItems={setDiscounts}
            />
          </div>
        </div>
      </div>
      <ModalForm
        setOpen={setOpen}
        isOpen={open}
        type={"discount"}
        setItems={setDiscounts}
      />
    </div>
  );
};

export default ManageDiscounts;
