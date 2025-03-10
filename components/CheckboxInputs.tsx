import {
  ChangeEvent,
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  RefObject,
} from "react";
import Label from "./Label";
import Plop from "./Plop";

type CheckboxInputsProps = {
  options: string[];
  defaultValue?: string[];
  resetTimer?: () => void;
};

export default function CheckboxInputs({
  id,
  name,
  options,
  onChange,
  value,
  resetTimer,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type" | "defaultValue"> &
  CheckboxInputsProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (onChange) onChange(e);
    if (resetTimer) resetTimer();
  };

  const handleClickClone = (nextValue: string) => {
    if (onChange)
      onChange({
        target: { value: nextValue },
      } as ChangeEvent<HTMLInputElement>);
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
                      checked={(value as string[]).includes(option)}
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
