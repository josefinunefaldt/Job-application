import { createFileRoute } from "@tanstack/react-router";
import { Jobs } from "../components/Jobs";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-9 flex flex-col">
      <div className="overflow-x-auto">
        <button className="btn btn-neutral float-end mb-4 ml-auto">Add</button>
        <Jobs />
      </div>
    </div>
  );
}
