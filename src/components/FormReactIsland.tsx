import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

interface Question {
  type: "open" | "single_choice" | "multiple_choice" | "matching";
  label: string;
  options?: string[];
  optionsMatch?: string[];
}

interface FormReactIslandProps {
  setProgress: (currentProgress: number) => void;
  questions: Question[];
}

const zTypes: Record<string, z.ZodTypeAny> = {
  open: z.string().min(1, "Esta pregunta abierta debe ser respondida."),
  single_choice: z.string().min(1, "Debes seleccionar una opción."),
  multiple_choice: z.array(
    z.string().min(1, "Debes seleccionar al menos una opción.")
  ),
  matching: z.object({
    left: z.string(),
    right: z.string(),
  }),
};

const FormReactIsland = ({ setProgress, questions }: FormReactIslandProps) => {
  const FormSchema = z.object(
    Object.fromEntries(
      questions.map((field, index) => [`question-${index}`, zTypes[field.type]])
    )
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: Object.fromEntries(
      questions.map((_, index) => [`question-${index}`, ""])
    ),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Submitted Data:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Card className="max-w-6xl w-full block h-full pt-2 overflow-y-scroll">
      <a
        href="/"
        className="flex gap-1 items-center italic text-destructive hover:opacity-50"
      >
        <svg
          className="w-5 h-5 ms-2 rotate-180"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
        Volver
      </a>
      <CardContent className="py-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {questions.map((question, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`question-${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {question.label}
                      <span className="font-extrabold">({question.type})</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button className="w-full cursor-pointer" type="submit">
              Revisar cuestionario
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormReactIsland;
