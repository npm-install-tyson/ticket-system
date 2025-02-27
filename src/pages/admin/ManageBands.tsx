import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import ModalForm from "../../components/ModalForm";
import fetchData from "../../util/fetchAPI";

interface Band {
  bandId: string;
  seatsPerBand: number;
  price: number;
}

const ManageBands = () => {
  const [open, setOpen] = useState(false);
  const [bands, setBands] = useState<Band[]>([]);

  const url = `http://192.168.120.169:8080/api/v1/bands/all`;

  useEffect(() => {
    fetchData(url, setBands);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Band Types</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of band types and total seats in each band including prices
            for each band type.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="block rounded-md bg-cyan-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            Add band type
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <DataTable data="band" items={bands} setItems={setBands} />
          </div>
        </div>
      </div>
      <ModalForm
        setOpen={setOpen}
        isOpen={open}
        type={"band"}
        setItems={setBands}
      />
    </div>
  );
};

export default ManageBands;
