import type { Question } from "@/lib/types";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  FormField,
} from "./ui/form";
import { Input } from "./ui/input";
import type { ControllerRenderProps } from "react-hook-form";
import { Checkbox } from "./ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import RelationField from "./RelationField";

interface FieldProps {
  question: Question;
  numberQuestion: number;
  field: ControllerRenderProps;
}

const CustomField = ({ question, field, numberQuestion }: FieldProps) => {
  const { type, options, optionsMatch } = question;
  switch (question.type) {
    case "open":
      return (
        <FormItem>
          <FormLabel className="italic">
            {`${numberQuestion}-.`} {question.label}
          </FormLabel>
          <FormDescription>
            Responde de una manera clara y breve.
          </FormDescription>
          <FormControl>
            <Input type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      );
    case "multiple_choice":
    case "single_choice":
      if (!options) return null;
      return (
        <FormItem>
          <FormLabel className="italic">
            {`${numberQuestion}-.`} {question.label}
          </FormLabel>
          <FormDescription>
            Selecciona una {type === "multiple_choice" && "o varias"} de las
            siguientes opciones.
          </FormDescription>
          {options.map((option, index) => (
            <FormField
              key={`${field.name}-option-${index}`}
              name={field.name}
              render={() => {
                const isChecked =
                  type === "single_choice"
                    ? field.value === option
                    : field.value?.includes(option);
                const onCheckedChange = (checked: CheckedState) => {
                  if (type === "single_choice") {
                    return checked
                      ? field.onChange(option)
                      : field.onChange("");
                  } else {
                    return checked
                      ? field.onChange([...field.value, option])
                      : field.onChange(
                          field.value?.filter(
                            (value: string) => value !== option
                          )
                        );
                  }
                };
                return (
                  <FormItem className="flex pl-2 flex-row items-start space-x-3 space-y-0 ">
                    <FormControl>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={onCheckedChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-102">
                      {option}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      );
    case "matching":
      if (!options || !optionsMatch) return null;
      return (
        <FormItem>
          <FormLabel className="italic">
            {`${numberQuestion}-.`} {question.label}
          </FormLabel>
          <FormDescription>
            Relaciona las sigueintes opciones en su orden correcto.
          </FormDescription>
          <FormControl>
            <RelationField
              columnLeft={options}
              columnRight={optionsMatch}
              field={field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      );
    default:
      return null;
  }
};

export default CustomField;
