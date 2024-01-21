import { ChangeEvent } from "react";

interface TabBarProps {
  options: {
    label: string;
    value: string;
  }[];
  name: string;
  value: string;
  onChange: (_: string) => void;
}

function TabBar({ options, name, value, onChange }: TabBarProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }
  return (
    <div className="inline-flex p-2 w-full lg:min-w-80 lg:w-auto">
      <div className="mx-auto flex justify-evenly gap-2 bg-neutral-600 p-2 rounded-md grow flex-wrap">
        {options.map(({ label, value: radioValue }, index) => (
          <label key={index} className="grow basis-0">
            <input
              type="radio"
              name={name}
              value={radioValue}
              checked={value === radioValue}
              onChange={handleChange}
              className="hidden peer"
            />
            <span className="block rounded text-center w-full py-2 peer-checked:bg-neutral-500 hover:bg-neutral-500">
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export { TabBar };
