import { FormControl, FormLabel } from "@/components/ui/form";
import type { ControllerRenderProps } from "react-hook-form";

interface RelationFieldProps {
  columnLeft: string[];
  columnRight: string[];
  field: ControllerRenderProps;
}
const RelationField = ({
  columnLeft,
  columnRight,
  field,
}: RelationFieldProps) => {
  const changeInputMatching = (index: number, value: string) => {
    if (
      (Number(value) <= 0 && value !== "") ||
      Number(value) > columnLeft.length
    )
      return;
    const newValue = [...field.value];
    if (!newValue[index]) {
      newValue[index] = [value, columnRight[index]];
    } else {
      newValue[index] = [...newValue[index]];
      newValue[index][0] = value;
    }
    field.onChange(newValue);
  };

  return (
    <div className=" space-y-2 px-4">
      {columnLeft.map((option, index) => (
        <div
          className="grid grid-cols-2 items-center"
          key={`${field.name}-option-columnRight-${index}`}
        >
          <FormLabel>
            <span className="font-bold">{`${index + 1}° - `}</span>
            {option}
          </FormLabel>
          <div className="flex gap-2 items-center">
            <input
              className="rounded-sm h-6 w-6 px-1.5 border-2"
              maxLength={1}
              value={field.value[index]?.[0] ?? ""}
              onChange={(e) => changeInputMatching(index, e.target.value)}
            />
            <FormLabel>{columnRight[index]}</FormLabel>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelationField;
