import { createFileRoute } from "@tanstack/react-router";
import { Jobs } from "../components/Jobs";
import { useState } from "react";
import ModalForm from "../components/ModalForm";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className=" flex justify-end">
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add Workplace
          </button>
          <ModalForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
        <Jobs />
      </div>
    </div>
  );
}
