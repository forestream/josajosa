import { ChangeEvent, ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export default function TextInput({
  onChange,
  value,
  className,
  resetTimer,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  type: "text";
  resetTimer?: () => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (resetTimer) resetTimer();
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
