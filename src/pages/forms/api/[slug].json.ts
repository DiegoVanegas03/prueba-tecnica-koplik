import type { APIRoute } from "astro";

import memorizedResponse from "@/pages/forms/api/memorizedForms.json";

export const GET: APIRoute = ({ params }) => {
  if (!params.slug) return new Response();
  const slug = params.slug as
    | "sistema-nervioso-humano"
    | "sistema-digestivo-humano";

  return new Response(
    JSON.stringify({
      message: "Exito",
      data: memorizedResponse[slug],
    })
  );
};

export function getStaticPaths() {
  return [
    { params: { slug: "sistema-nervioso-humano" } },
    { params: { slug: "sistema-digestivo-humano" } },
  ];
}
