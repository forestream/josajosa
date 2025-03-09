import { ChangeEvent, ComponentPropsWithoutRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function TextInput({
  className,
  defaultValue = "",
  onChange,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  type: "text";
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
      className={twMerge(
        "border-pastel-yellow-800 w-full rounded border p-2",
        className,
      )}
    />
  );
}
