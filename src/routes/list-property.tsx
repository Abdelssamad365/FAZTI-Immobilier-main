import { createFileRoute, redirect } from "@tanstack/react-router";

// Old selling URL: the publish form now lives at /vendre.
export const Route = createFileRoute("/list-property")({
  beforeLoad: () => { throw redirect({ to: "/vendre", statusCode: 301 }); },
});
