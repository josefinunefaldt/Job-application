import { Jobs } from "../components/Jobs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs")({
  component: RouteComponent,
});
function RouteComponent() {
  return (
    <div className="min-h-screen bg-[#F4E4BA]">
      <div className="overflow-x-auto">
        <Jobs />
      </div>
    </div>
  );
}
