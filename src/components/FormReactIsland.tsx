import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Question } from "@/lib/types";
import FieldOpen from "@/components/CustomField";

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
    <Card className="max-w-6xl w-full block h-full pt-2 gap-2 overflow-y-scroll">
      <CardHeader className="flex-row relative p-0">
        <a
          href="/"
          className="flex gap-1 absolute top-0 left-0 items-center italic text-destructive hover:opacity-50"
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
        <p className="text-center w-full font-title text-2xl">Cuestionario:</p>
      </CardHeader>
      <CardContent className="py-2 px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {questions.map((question, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`question-${index}`}
                render={({ field }) => (
                  <FieldOpen question={question} field={field} />
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
