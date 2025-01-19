import { useState } from "react";
import ModalForm from "../components/ModalForm";
import { Jobs } from "../components/Jobs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs")({
  component: RouteComponent,
});
function RouteComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="flex justify-end">
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Add Workplace
            </button>
            <ModalForm
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              existingJob={null}
            />
          </div>
          <Jobs />
        </div>
      </div>
    </>
  );
}
