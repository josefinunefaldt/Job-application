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

  const hasInterviewDate = jobs.some((job) => job.interviewDate);

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
    <div className="p-4">
      <button onClick={filterJobInterview}>Filter job interview</button>
      <button onClick={filterNoAnswer}>No answer</button>
      <button onClick={filterDraft}>Draft</button>
      <button onClick={reset}>Reset</button>

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
              <th>Notifications</th>
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
                  {hasNotifications(job) && (
                    <button
                      onClick={() => handleCheckNotification(job)}
                      className="btn btn-primary"
                    >
                      Check Notifications
                    </button>
                  )}
                </td>
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
