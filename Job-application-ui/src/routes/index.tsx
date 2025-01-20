import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Link } from "@tanstack/react-router";
import ModalForm from "../components/ModalForm";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(./bg.jpg)" }}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-16  mt-[5%] text-[#5f7470] ">
          Track your application process
        </h1>
        <div className="flex space-x-12 ">
          <button
            className="hover:bg-[#FFCF56]  hover:text-[#5f7470] transition-all duration-200 ease-in-out btn rounded-full w-32 h-32 text-lg index-text flex border-0 text-[#F4E4BA]  bg-[#5f7470] items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            ADD JOB
          </button>
          <Link to="/guide">
            <button className=" text-lg btn rounded-full index-text hover:bg-[#FFCF56]  hover:text-[#5f7470] transition-all duration-200 ease-in-out  text-[#F4E4BA] border-0 bg-[#5f7470] w-32 h-32 flex items-center justify-center">
              GUIDE ME
            </button>
          </Link>
        </div>
      </div>
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingJob={null}
      />
    </div>
  );
}
