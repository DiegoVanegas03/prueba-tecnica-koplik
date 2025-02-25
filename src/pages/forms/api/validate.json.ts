import type { APIRoute } from "astro";

import memorizedResponse from "@/pages/forms/api/memorizedForms.json";
import { type Question, type ResponseApi } from "@/lib/types";

// Esto es muy importante para que clientes externos a astro consuman el endpoint.
export const prerender = false;

const mensajesReconfortantes = [
  "¡No te preocupes! Todos los errores son una oportunidad para aprender. ¡Lo lograrás con esfuerzo!",
  "¡Ánimo! Este es solo un paso en el proceso. La mejora viene con el tiempo.",
  "¡No es el final! Cada intento te acerca más a tus objetivos. Sigue adelante.",
  "¡Vas bien! Cada esfuerzo cuenta y el progreso es clave. ¡Sigue así!",
  "¡Buen trabajo! Estás en el camino correcto, no te detengas.",
  "¡Bien hecho! Sigue con ese ritmo y verás cómo mejoras aún más.",
  "¡Muy bien! Tu esfuerzo se está notando, sigue practicando para llegar más lejos.",
  "¡Genial! Has mejorado mucho, sigue perfeccionando cada paso.",
  "¡Excelente trabajo! Tu dedicación está dando frutos, sigue así, vas por el camino correcto.",
  "¡Increíble! Lo hiciste muy bien, sigue alcanzando nuevas metas y desafiándote.",
];

type Slug = "sistema-nervioso-humano" | "sistema-digestivo-humano";
type AnswerType = string | string[] | string[][];
interface QuestionsAnsweredType extends Question {
  answer: AnswerType;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const slug: Slug = body["slug"];

  if (
    slug !== "sistema-nervioso-humano" &&
    slug !== "sistema-digestivo-humano"
  ) {
    return new Response(null, {
      status: 404,
      statusText: "Formulario no encontrado",
    });
  }

  const questions: QuestionsAnsweredType[] = memorizedResponse[
    slug
  ].questions.map((question) => {
    return {
      ...question,
      type: question.type as Question["type"],
    };
  });

  const answers: AnswerType[] = Object.values(body["answers"]);

  let numberCorrects = 0;
  let badAnswers: Record<string, AnswerType> = {};
  questions.forEach((question, index) => {
    const { type, answer, id, options } = question;
    const userAnswer = answers[index];
    let validation = false;

    switch (type) {
      case "multiple_choice":
        if (Array.isArray(answer) && Array.isArray(userAnswer)) {
          const sortedAnswer = answer.sort();
          const sortedUserAnswer = userAnswer.sort();
          if (JSON.stringify(sortedAnswer) === JSON.stringify(sortedUserAnswer))
            validation = true;
        }
        break;
      case "matching":
        if (Array.isArray(answer) && Array.isArray(userAnswer) && options) {
          const convertKeyForText = userAnswer
            .map(([key, relation]) => [options[Number(key) - 1], relation])
            .sort();
          const sortedAnswer = answer.sort();
          if (
            JSON.stringify(sortedAnswer) === JSON.stringify(convertKeyForText)
          )
            validation = true;
        }
        break;
      case "open":
        //No agregare una logica mas complicada por lo que un random determinara si es correcta o no.
        const isCorrect = Math.random() > 0.5;
        if (isCorrect) validation = true;
        break;
      case "single_choice":
      default:
        if (userAnswer === answer) validation = true;
        break;
    }
    if (validation) {
      numberCorrects++;
    } else {
      badAnswers[id] = answer;
    }
    validation = false;
  });

  const calificacion = (numberCorrects / questions.length) * 100;

  return new Response(
    JSON.stringify({
      message: mensajesReconfortantes[numberCorrects],
      data: {
        calificacion: calificacion,
        badAnswers: badAnswers,
      },
    })
  );
};
