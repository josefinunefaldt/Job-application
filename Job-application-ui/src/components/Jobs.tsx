import { useEffect, useState } from "react";
import { FetchJobs } from "../../utils/fetchJobs";
import { DeleteJob } from "../../utils/deletejob";
import type { components } from "../lib/api/v1";
import ModalForm from "./ModalForm";

type fetchJobs = components["schemas"]["WorkplaceResponse"];

export const Jobs = () => {
  const [jobs, setJobs] = useState<fetchJobs[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<fetchJobs | null>(null);

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

  const formatInterviewDate = (date: string | undefined) => {
    if (date) {
      const formattedDate = new Date(date).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return formattedDate;
    }
    return "N/A";
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
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Location</th>
              <th>Status</th>
              {hasInterviewDate && <th>Interview Date</th>}
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.position}</td>
                <td>{job.contactPerson}</td>
                <td>{job.email}</td>
                <td>{job.location}</td>
                <td>{job.status}</td>

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
