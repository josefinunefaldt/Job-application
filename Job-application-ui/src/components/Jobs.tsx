import { useState, useEffect } from "react";
import { FetchJobs } from "../../utils/fetchJobs";
import { DeleteJob } from "../../utils/deletejob";
import ModalForm from "./ModalForm";
import { checkPendingStatus } from "../../utils/notificationCalculator";
import { Toast } from "../types/toastType";
import { fetchJobs } from "../types/workplaceResponseType";

export const Jobs = () => {
  const [jobs, setJobs] = useState<fetchJobs[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<fetchJobs | null>(null);
  const [infoJob, setInfoJob] = useState<fetchJobs | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: fetchJobs[] = await FetchJobs();
        setJobs(data ?? []);
      } catch {
        console.error("Error fetching jobs:");
      }
    };

    if (!isFiltered) {
      fetchData();
    }
  }, [isFiltered]);

  const addToast = (message: string, type: "info" | "success" | "error") => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { message, type, id };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const handleUpdate = (job: fetchJobs) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleCloseInfo = () => {
    setInfoJob(null);
  };

  const filterJobInterview = async () => {
    try {
      const data: fetchJobs[] = await FetchJobs();
      setJobs(data.filter((job) => job.status === "interview booked"));
      setIsFiltered(true);
    } catch (error) {
      console.error("Error filtering jobs:", error);
    }
  };

  const filterNoAnswer = async () => {
    try {
      const data: fetchJobs[] = await FetchJobs();
      setJobs(data.filter((job) => job.status === "waiting for an answer"));
      setIsFiltered(true);
    } catch (error) {
      console.error("Error filtering jobs:", error);
    }
  };

  const filterDraft = async () => {
    try {
      const data: fetchJobs[] = await FetchJobs();
      setJobs(data.filter((job) => job.status === "Draft"));
      setIsFiltered(true);
    } catch (error) {
      console.error("Error filtering jobs:", error);
    }
  };

  const reset = () => {
    setIsFiltered(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await DeleteJob(id);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch {
      console.error("Error deleting job:");
    }
  };

  const hasNotifications = (job: fetchJobs) => {
    const currentDate = new Date();
    const statusTimeStamp = new Date(job.statusTimeStamp || "");
    const interviewDate = new Date(job.interviewDate || "");
    const deadline = new Date(job.deadline || "");
    const twoWeeksAgo = new Date(
      currentDate.getTime() - 14 * 24 * 60 * 60 * 1000
    );

    const timeDifference =
      (deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
    const timeForJob =
      (interviewDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

    return (
      (job.status === "Draft" && timeDifference <= 2 && timeDifference >= 0) ||
      (job.status === "Draft" && timeDifference < 0) ||
      (job.status === "waiting for an answer" &&
        statusTimeStamp <= twoWeeksAgo) ||
      (job.status === "interview booked" && timeForJob <= 2 && timeForJob >= 0)
    );
  };

  const handleCheckNotification = (job: fetchJobs) => {
    checkPendingStatus(job, addToast);
  };

  return (
    <div>
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
      <div className="p-4 mt-6">
        <div className="mb-4">
          <button
            onClick={filterJobInterview}
            className="btn mr-2  text-[#F4E4BA] hover:opacity-50 bg-[#5f7470]"
          >
            Job interview
          </button>
          <button
            onClick={filterNoAnswer}
            className="btn mr-2 text-[#F4E4BA] bg-[#5f7470]"
          >
            No answer
          </button>
          <button
            onClick={filterDraft}
            className="btn mr-2  text-[#F4E4BA]  bg-[#5f7470]"
          >
            Draft
          </button>
          <button
            onClick={reset}
            className="btn mr-2  text-[#F4E4BA] bg-[#5f7470]"
          >
            All
          </button>
          <button
            className="btn bg-[#FFCF56] text-[#5f7470]"
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

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="border-b border-[#5f7470] p-2 text-center">
                  Position
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center">
                  Location
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center">
                  Status
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center">
                  Company
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center">
                  Link
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center">
                  Deadline
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center">
                  Notifications
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="text-center">
                  <td className="border-b border-[#5f7470] p-2">
                    {job.position}
                  </td>
                  <td className="border-b border-[#5f7470] p-2">
                    {job.location}
                  </td>
                  <td className="border-b border-[#5f7470] p-2">
                    {job.status}
                  </td>
                  <td className="border-b border-[#5f7470] p-2">
                    {job.company}
                  </td>
                  <td className="border-b border-[#5f7470] p-2">
                    <a
                      href={job.link!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Job
                    </a>
                  </td>
                  <td className="border-b border-[#5f7470] p-2">
                    {job.deadline}
                  </td>
                  <td className="border-b border-[#5f7470] p-2">
                    {hasNotifications(job) && (
                      <button
                        onClick={() => handleCheckNotification(job)}
                        className="btn bg-[#FFCF56]"
                      >
                        Next step
                      </button>
                    )}
                  </td>
                  <td className="border-b border-[#5f7470] p-2">
                    <button className=" p-0" onClick={() => setInfoJob(job)}>
                      <img
                        src="./information-button.png"
                        alt="Info"
                        className="w-6 h-6"
                      />
                    </button>
                    <button className="ml-2" onClick={() => handleUpdate(job)}>
                      <img src="./pen.png" alt="Edit" className="w-6 h-6" />
                    </button>

                    <button
                      className="ml-2 p-0"
                      onClick={() => handleDelete(job.id!)}
                    >
                      <img src="./trash.png" alt="Delete" className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {infoJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#5f7470] rounded-lg p-6 w-96">
              <h2 className="text-lg index-text font-bold mb-4  text-[#F4E4BA]">
                JOB DETAILS
              </h2>
              <p className="  text-[#F4E4BA]">
                <strong>Position:</strong> {infoJob.position}
              </p>
              <p className="  text-[#F4E4BA]">
                <strong>Location:</strong> {infoJob.location}
              </p>
              <p className="  text-[#F4E4BA]">
                <strong>Company:</strong> {infoJob.company}
              </p>
              <p className="  text-[#F4E4BA]">
                <strong>Contact person:</strong> {infoJob.contactPerson}
              </p>
              <p className="  text-[#F4E4BA]">
                <strong>Email:</strong> {infoJob.email}
              </p>
              <p className="  text-[#F4E4BA]">
                <strong>Link:</strong>{" "}
                <a
                  href={infoJob.link!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Job link
                </a>
              </p>
              <p className="  text-[#F4E4BA]">
                <strong>Status:</strong> {infoJob.status}
              </p>
              <p className="  text-[#F4E4BA]">
                <strong>Deadline:</strong> {infoJob.deadline}
              </p>
              {infoJob.interviewDate && (
                <p className="  text-[#F4E4BA]">
                  <strong>Interview Date:</strong> {infoJob.interviewDate}
                </p>
              )}
              <button
                onClick={handleCloseInfo}
                className="mt-4 btn bg-[#FFCF56] border-0 text-[#5f7470]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {isModalOpen && selectedJob && (
          <ModalForm
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            existingJob={selectedJob}
          />
        )}
      </div>
    </div>
  );
};
