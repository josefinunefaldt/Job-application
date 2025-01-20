import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guide")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen flex justify-center items-start">
      <h1 className="text-4xl index-text font-bold mt-16">
        Under construction!
      </h1>
    </div>
  );
}
