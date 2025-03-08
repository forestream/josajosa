import { ChangeEvent, ComponentPropsWithoutRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function TextInput({
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  type: "text";
}) {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

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
