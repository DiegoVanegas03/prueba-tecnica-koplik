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

interface FieldProps {
  question: Question;
  field: ControllerRenderProps;
}

const CustomField = ({ question, field }: FieldProps) => {
  switch (question.type) {
    case "open":
      return (
        <FormItem>
          <FormLabel className="italic">{question.label} </FormLabel>
          <FormDescription>
            Responde de una manera clara y breve.
          </FormDescription>
          <FormControl>
            <Input type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      );
    case "single_choice":
      const { options } = question;
      if (!options) return null;
      return (
        <FormItem>
          <FormLabel className="italic">{question.label} </FormLabel>
          <FormDescription>
            Selecciona una de las siguientes opciones.
          </FormDescription>
          {options.map((option, index) => (
            <FormField
              key={`${field.name}-option-${index}`}
              name={field.name}
              render={() => (
                <FormItem className="flex pl-2 flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === option}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange(option)
                          : field.onChange("");
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {option}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
          <FormMessage />
        </FormItem>
      );
    default:
      return null;
  }
};

export default CustomField;
