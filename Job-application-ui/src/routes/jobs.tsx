import { useState } from "react";
import ModalForm from "../components/ModalForm";
import { Jobs } from "../components/Jobs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs")({
  component: RouteComponent,
});
function RouteComponent() {
  return (
    <div className="min-h-screen bg-[#F4E4BA]">
      <div className="overflow-x-auto">
        <div className="flex justify-end"></div>
        <Jobs />
      </div>
    </div>
  );
}
