import {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  RefObject,
  useState,
} from "react";
import Label from "./Label";
import Plop from "./Plop";

type CheckboxInputsProps = {
  options: string[];
  defaultValue?: string[];
};

export default function CheckboxInputs({
  id,
  name,
  options,
  defaultValue = [],
  onChange,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type" | "defaultValue"> &
  CheckboxInputsProps) {
  const [values, setValues] = useState<string[]>(defaultValue);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (values.includes(e.target.value)) {
      setValues((values) => values.filter((value) => value !== e.target.value));
    } else {
      setValues((values) => [...values, e.target.value]);
    }

    if (onChange) onChange(e);
  };

  const handleClickClone = (nextValue: string) => {
    if (values.includes(nextValue)) {
      setValues((values) => values.filter((value) => value !== nextValue));
    } else {
      setValues((values) => [...values, nextValue]);
    }
  };

  return (
    <div className="flex w-full flex-col">
      {options.map((option, i) => {
        const innerId = id + "-" + i;

        return (
          <Plop
            onClick={() => handleClickClone(option)}
            key={innerId}
            render={(ref) => {
              return (
                <div
                  ref={ref as RefObject<HTMLDivElement>}
                  className="hover:bg-pastel-yellow-200 rounded-md transition-colors duration-300"
                >
                  <Label
                    htmlFor={innerId}
                    className="inline-block w-full cursor-pointer px-4 py-4"
                  >
                    <input
                      onChange={handleChange}
                      checked={values.includes(option)}
                      type="checkbox"
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
