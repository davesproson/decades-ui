import { createFileRoute } from "@tanstack/react-router";
import { getFlightSummary } from "@/flight-summary/hooks";

export const Route = createFileRoute("/flight-summary")({
  loader: () => getFlightSummary(),
  staleTime: 5000,
});
