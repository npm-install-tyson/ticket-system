import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteData } from "../services/api/fetchAPI";

const DataTable = ({ data, items, setItems }: any) => {
  const handleDelete = (id: number) => {
    const path =
      data === "discount" ? `api/v1/discounts/${id}` : `api/v1/bands/${id}`;
    const confirmation = confirm(`Are you sure you want to delete?`);
    if (confirmation) {
      deleteData(path).then((res) => console.log(res));
      setItems((prev: any) =>
        prev.filter((d: any) =>
          data === "band" ? d.bandId !== id : d.id !== id
        )
      );
    }
  };
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        {data === "band" && (
          <tr>
            <th
              scope="col"
              className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            ></th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Band Type
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Seats per band
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Price
            </th>
            <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-3">
              <span className="sr-only"></span>
            </th>
          </tr>
        )}
        {data === "discount" && (
          <tr>
            <th
              scope="col"
              className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            ></th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Discount Type
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Percentage
            </th>
            <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-3">
              <span className="sr-only"></span>
            </th>
          </tr>
        )}
      </thead>
      <tbody className="bg-white">
        {data === "band" &&
          items.map((band: any, index: number) => (
            <tr key={index} className="even:bg-gray-50">
              <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                {index + 1}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {band.bandId}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {band.seatsPerBand} seats
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                £{band.price}
              </td>
              <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3 flex gap-x-2 items-center justify-center">
                <button
                  onClick={() => handleDelete(band.bandId)}
                  className="text-cyan-600 hover:text-cyan-900"
                >
                  <TrashIcon className="w-5" />
                  <span className="sr-only">, {band.bandId}</span>
                </button>
              </td>
            </tr>
          ))}
        {data === "discount" &&
          items.map((discount: any, index: number) => (
            <tr key={index} className="even:bg-gray-50">
              <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                {index + 1}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {discount.discountType}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {discount.discountPercentage}%
              </td>
              <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3 flex gap-x-2 items-center justify-center">
                <button
                  onClick={() => handleDelete(discount.id)}
                  className="text-cyan-600 hover:text-cyan-900"
                >
                  <TrashIcon className="w-5" />
                  <span className="sr-only">
                    Delete, {discount.discountType}
                  </span>
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default DataTable;
