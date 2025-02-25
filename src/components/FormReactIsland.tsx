import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import type { Question, AnswerType } from "@/lib/types";
import CustomField from "@/components/CustomField";
import ResultsModal from "./ResultsModal";
import { useEffect, useState } from "react";

interface FormReactIslandProps {
  title: string;
  slug: string;
  description: string;
  children?: React.ReactNode;
  questions: Question[];
}

interface ResponseForm {
  calificacion: number;
  badAnswers: Record<string, AnswerType>;
}

const getZSchemaValidations = (
  type: Question["type"],
  matchingPairs: number = 0
): z.ZodTypeAny => {
  switch (type) {
    case "open":
      return z.string().nonempty("Esta pregunta abierta debe ser respondida.");
    case "single_choice":
      return z.string().nonempty("Debes seleccionar una opción.");
    case "multiple_choice":
      return z
        .array(z.string())
        .nonempty("Debes seleccionar al menos una opción.");
    case "matching":
      return z
        .array(z.array(z.string()).length(2))
        .length(matchingPairs | 0, "Relaciona todas las opciones.");
    default:
      return z.string();
  }
};

const FormReactIsland = ({
  title,
  slug,
  description,
  children,
  questions,
}: FormReactIslandProps) => {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const [responseAPI, setResponseApi] = useState<ResponseForm>({
    calificacion: 0,
    badAnswers: {},
  });
  const [visibleErrors, setVisibleErrors] = useState(false);

  const FormSchema = z.object(
    Object.fromEntries(
      questions.map((field) => [
        `question-${field.id}`,
        getZSchemaValidations(field.type, field.optionsMatch?.length),
      ])
    )
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: Object.fromEntries(
      questions.map((field) => [
        `question-${field.id}`,
        field.type === "multiple_choice" || field.type === "matching" ? [] : "",
      ])
    ),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const body = {
      slug: slug,
      answers: data,
    };
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          // Retraso simulado para tiempos de carga en api
          await delay(1000);

          const response = await fetch("/forms/api/validate.json", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
          }

          const responseData = await response.json();
          setResponseApi(responseData.data);
          setOpen(true);
          resolve(responseData);
        } catch (error) {
          reject(error);
        }
      });
    toast.promise(promise, {
      loading: "Loading...",
      success: (data: any) => {
        return data.message;
      },
      error: (error) => {
        return `Error: ${error.message}`;
      },
    });
  }

  const answers = form.watch();
  useEffect(() => {
    const total = questions.length;
    const filled = Object.values(answers).filter((val) => {
      if (typeof val === "string") {
        return val.trim() !== "";
      } else if (Array.isArray(val)) {
        return (
          val.length > 0 &&
          val.every((item) =>
            Array.isArray(item) ? item.length === 2 : item.trim() !== ""
          )
        );
      }
      return false;
    }).length;
    setProgress((filled / total) * 100);
  }, [answers]);

  return (
    <>
      <ResultsModal
        open={open}
        setOpen={setOpen}
        calificacion={responseAPI.calificacion}
        setVisibleErrors={setVisibleErrors}
      >
        <Card className="max-w-6xl w-full p-0">
          <CardHeader className="flex-row gap-4 p-0 pr-2">
            {children}
            <div className="py-2 space-y-2">
              <CardTitle className="font-title italic tracking-widest text-3xl">
                {title}
              </CardTitle>
              <CardDescription className="text-gray-700 text-sm flex gap-2">
                {description}
              </CardDescription>
              <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="max-w-6xl w-full block h-full p-0 overflow-y-scroll">
          <CardHeader className=" sticky top-0 p-0">
            <div className="flex flex-row relative pt-2 bg-white">
              <a
                href="/"
                className="flex gap-1 absolute top-0 pt-2 left-0 items-center italic text-destructive hover:opacity-50"
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
              <p className="text-center w-full font-title text-2xl">
                Cuestionario:
              </p>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {questions.map((question, index) => (
                  <div key={question.id} className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`question-${question.id}`}
                      render={({ field }) => (
                        <CustomField
                          question={question}
                          numberQuestion={index + 1}
                          field={field}
                        />
                      )}
                    />
                    {visibleErrors &&
                      responseAPI.badAnswers &&
                      responseAPI.badAnswers[question.id] && (
                        <p className="italic text-destructive text-sm">
                          <span className="font-bold">
                            La respuesta correcta seria :{" "}
                          </span>
                          {Array.isArray(responseAPI.badAnswers[question.id])
                            ? JSON.stringify(
                                responseAPI.badAnswers[question.id]
                              )
                            : responseAPI.badAnswers[question.id]}
                        </p>
                      )}
                  </div>
                ))}
                <Button className="w-full cursor-pointer" type="submit">
                  Revisar cuestionario
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </ResultsModal>
      <Toaster />
    </>
  );
};

export default FormReactIsland;
