import {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  RefObject,
  useState,
} from "react";
import Label from "./Label";
import Plop from "./Plop";

type RadioInputsProps = {
  options: string[];
  defaultValue?: string;
};

export default function RadioInputs({
  id,
  name,
  options,
  defaultValue = "",
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type" | "defaultValue"> &
  RadioInputsProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setValue(e.target.value);

  return (
    <div className="flex w-full flex-col">
      {options.map((option, i) => {
        const innerId = id + "-" + i;

        return (
          <Plop
            key={innerId}
            render={(ref) => {
              return (
                <div
                  ref={ref as RefObject<HTMLDivElement>}
                  className="hover:bg-pastel-yellow-200 rounded-md transition-colors duration-300"
                >
                  <Label
                    htmlFor={innerId}
                    className="block w-full cursor-pointer px-4 py-4"
                  >
                    <input
                      onChange={handleChange}
                      checked={option === value}
                      type="radio"
                      id={innerId}
                      value={option}
                      name={name}
                      {...props}
                    />
                    {option}
                  </Label>
                </div>
              );
            }}
          />
        );
      })}
    </div>
  );
}
