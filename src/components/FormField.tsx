import { FORMFIELDPROPS } from "../util/types";

const FormField = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  options,
}: FORMFIELDPROPS) => {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
      >
        {label}
      </label>
      <div className="mt-2 sm:col-span-2 sm:mt-0">
        {type === "text" ? (
          <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-cyan-900 sm:max-w-md"
          />
        ) : (
          <div className="relative sm:max-w-xs">
            <select
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 pr-8 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-cyan-900 capitalize"
            >
              {options?.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormField;
