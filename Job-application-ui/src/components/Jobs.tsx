import { useState, useEffect } from "react";
import { FetchJobs } from "../../utils/fetchJobs";
import { DeleteJob } from "../../utils/deletejob";
import ModalForm from "./ModalForm";
import { checkPendingStatus } from "../../utils/notificationCalculator";
import { formatInterviewDate } from "../../utils/dateFormatter";
import { Toast } from "../types/toastType";
import { fetchJobs } from "../types/workplaceResponseType";

export const Jobs = () => {
  const [jobs, setJobs] = useState<fetchJobs[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<fetchJobs | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastQueue, setToastQueue] = useState<Toast[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: fetchJobs[] = await FetchJobs();
        setJobs(data ?? []);
      } catch {
        console.error("Error fetching jobs:");
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const hasInterviewDate = jobs.some((job) => job.interviewDate);

  const addToast = (message: string, type: "info" | "success" | "error") => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { message, type, id };
    setToastQueue((prevQueue) => [...prevQueue, newToast]);
  };

  useEffect(() => {
    const processToasts = () => {
      if (toastQueue.length > 0) {
        const toast = toastQueue[0];

        setToasts((prevToasts) => [...prevToasts, toast]);

        setTimeout(() => {
          setToasts((prevToasts) =>
            prevToasts.filter((t) => t.id !== toast.id)
          );
          setToastQueue((prevQueue) => prevQueue.slice(1));
        }, 5000);
      }
    };

    processToasts();
  }, [toastQueue]);

  const handleJobstatus = () => {
    jobs.forEach((job) => {
      checkPendingStatus(job, addToast);
    });
  };

  const handleUpdate = (job: fetchJobs) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await DeleteJob(id);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch {
      console.error("Error deleting job:");
    }
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Position</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Location</th>
              <th>Status</th>
              <th>Company</th>
              <th>Link</th>
              {hasInterviewDate && <th>Interview Date</th>}
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className={
                  job.status === "Draft" &&
                  job.deadline &&
                  (new Date(job.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24) <=
                    2
                    ? "highlight-error"
                    : job.status === "waiting for an answer" &&
                        job.statusTimeStamp &&
                        new Date(job.statusTimeStamp) <=
                          new Date(
                            new Date().getTime() - 14 * 24 * 60 * 60 * 1000
                          )
                      ? "highlight-info"
                      : job.status === "interview booked" &&
                          job.interviewDate &&
                          (new Date(job.interviewDate).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24) <=
                            2
                        ? "highlight-success"
                        : ""
                }
              >
                <td>{job.position}</td>
                <td>{job.contactPerson}</td>
                <td>{job.email}</td>
                <td>{job.location}</td>
                <td>{job.status}</td>
                <td>{job.company}</td>
                <td>
                  <a href={job.link!} target="_blank" rel="noopener noreferrer">
                    View Job
                  </a>
                </td>
                {hasInterviewDate && (
                  <td>
                    {job.interviewDate
                      ? formatInterviewDate(job.interviewDate)
                      : "N/A"}
                  </td>
                )}
                <td>{job.deadline}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleUpdate(job)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => handleDelete(job.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleJobstatus} className="btn btn-primary mt-4">
        Check Pending Jobs
      </button>

      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${
              toast.type === "info"
                ? "toast-info"
                : toast.type === "success"
                  ? "toast-success"
                  : "toast-error"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {isModalOpen && selectedJob && (
        <ModalForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          existingJob={selectedJob}
        />
      )}
    </div>
  );
};
