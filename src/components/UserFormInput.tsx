interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  colSpan: string;
  maxLength?: number;
  minLength?: number;
  blockReg?: boolean;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const UserFormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  colSpan,
  maxLength,
  minLength,
  blockReg,
  required,
}) => {
  return (
    <div className={colSpan}>
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
        />
      </div>
      {(id === "password" || id === "confirmPassword") && blockReg && (
        <p className=" text-sm text-red-600">Passwords do not match</p>
      )}
    </div>
  );
};

export default UserFormInput;
