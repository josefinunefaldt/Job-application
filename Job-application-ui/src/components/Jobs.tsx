import { useState, useEffect } from "react";
import { FetchJobs } from "../../utils/fetchJobs";
import { DeleteJob } from "../../utils/deletejob";
import ModalForm from "./ModalForm";
import { checkPendingStatus } from "../../utils/notificationCalculator";
import { Toast } from "../types/toastType";
import { fetchJobs } from "../types/workplaceResponseType";
import { filterJobsByStatus } from "../../utils/filter";
import { hasNotifications } from "../../utils/hasNotafications";
export const Jobs = () => {
  const [jobs, setJobs] = useState<fetchJobs[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<fetchJobs | null>(null);
  const [infoJob, setInfoJob] = useState<fetchJobs | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    }, 3000);
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
    const jobs = await filterJobsByStatus("interview booked");
    setJobs(jobs);
    setIsFiltered(true);
  };

  const filterNoAnswer = async () => {
    const jobs = await filterJobsByStatus("waiting for an answer");
    setJobs(jobs);
    setIsFiltered(true);
  };

  const [highlightedJobId, setHighlightedJobId] = useState<number | null>(null);
  const [isOpacityChanged, setIsOpacityChanged] = useState(false);

  const handleRowClick = (jobId: number) => {
    setHighlightedJobId(jobId);
    setIsOpacityChanged(true);
    setTimeout(() => {
      setIsOpacityChanged(false);
      setHighlightedJobId(null);
    }, 3000);
  };

  const filterDraft = async () => {
    const jobs = await filterJobsByStatus("Draft");
    setJobs(jobs);
    setIsFiltered(true);
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

  // const hasNotifications = (job: fetchJobs) => {
  //   const currentDate = new Date();
  //   const statusTimeStamp = new Date(job.statusTimeStamp || "");
  //   const interviewDate = new Date(job.interviewDate || "");
  //   const deadline = new Date(job.deadline || "");
  //   const twoWeeksAgo = new Date(
  //     currentDate.getTime() - 14 * 24 * 60 * 60 * 1000
  //   );

  //   const timeDifference =
  //     (deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
  //   const timeForJob =
  //     (interviewDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

  //   return (
  //     (job.status === "Draft" && timeDifference <= 2 && timeDifference >= 0) ||
  //     (job.status === "Draft" && timeDifference < 0) ||
  //     (job.status === "waiting for an answer" &&
  //       statusTimeStamp <= twoWeeksAgo) ||
  //     (job.status === "interview booked" && timeForJob <= 2 && timeForJob >= 0)
  //   );
  // };

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
      <div className="p-4 mt-6 ">
        <div className="mb-4 ml-4">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="btn mr-2 border-0 text-[#F4E4BA] hover:bg-[#6b8279] hover:text-[#F4E4BA] transition-all duration-200 ease-in-out bg-[#5f7470]"
            >
              Filter ▾
            </button>
            {isDropdownOpen && (
              <div className="absolute text-[#f4e4ba] mt-2 w-56 bg-[#5f7470] rounded-md shadow-lg z-10">
                <ul className="">
                  <li>
                    <button
                      onClick={filterJobInterview}
                      className="block w-full text-left px-4 py-2 text-[#f4e4ba]  hover:bg-[#FFCF56] hover:text-[#5f7470] transition-all duration-200"
                    >
                      Interview booked
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={filterNoAnswer}
                      className="block w-full text-left px-4 py-2 text-[#f4e4ba] hover:bg-[#FFCF56] hover:text-[#5f7470] transition-all duration-200"
                    >
                      Waiting for answer
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={filterDraft}
                      className="block w-full text-left px-4 py-2 text-[#f4e4ba] hover:bg-[#FFCF56] hover:text-[#5f7470] transition-all duration-200"
                    >
                      Draft
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={reset}
                      className="block w-full text-left px-4 py-2 text-[#f4e4ba] hover:bg-[#FFCF56] hover:text-[#5f7470] transition-all duration-200"
                    >
                      All
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button
            className="btn bg-[#FFCF56] border-0  hover:bg-[#FFD76A] hover:text-[#5f7470] transition-all duration-200 ease-in-out text-[#5f7470]"
            onClick={() => setIsModalOpen(true)}
          >
            + Add application
          </button>
          <ModalForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            existingJob={null}
          />
        </div>

        <div className="overflow-x-auto mr-4 ml-4 h-full">
          <table className=" h-full table-auto w-full border-b border-[#5f7470] border-spacing-0 hidden lg:table">
            <thead>
              <tr>
                <th className="border-b border-[#5f7470] text-left index-text  job-text">
                  Position
                </th>
                <th className="border-b border-[#5f7470] p-2  text-center job-text">
                  Location
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center job-text">
                  Status
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center job-text">
                  Company
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center job-text">
                  Link
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center job-text">
                  Deadline
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center job-text">
                  Notifications
                </th>
                <th className="border-b border-[#5f7470] p-2 text-center job-text"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className={
                    isOpacityChanged && job.id !== highlightedJobId
                      ? "opacity-10 bg-opacity-100 bg-gray-250 shadow-lg"
                      : ""
                  }
                  onClick={() => handleRowClick(job.id!)}
                >
                  <td className="border-b border-[#5f7470] text-left pl-5 border-t  text-gray-700  text-base">
                    {job.position}
                  </td>
                  <td className="border-b border-[#5f7470] p-2 text-center border-t  text-gray-700  text-base">
                    {job.location}
                  </td>
                  <td className="border-b border-[#5f7470] p-2 text-center border-t  text-gray-700  text-base">
                    {job.status}
                  </td>
                  <td className="border-b border-[#5f7470] p-2 text-center border-t  text-gray-700  text-base">
                    {job.company}
                  </td>
                  <td className="border-b border-[#5f7470] p-2 text-center border-t  text-gray-700  text-base">
                    <a
                      href={job.link!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Job
                    </a>
                  </td>
                  <td className="border-b border-[#5f7470] p-2 text-center border-t  text-gray-700 text-base">
                    {job.deadline}
                  </td>
                  <td className="border-b border-[#5f7470] border-t  p-2 text-center">
                    {hasNotifications(job) && (
                      <button
                        onClick={() => handleCheckNotification(job)}
                        className="btn border-0 bg-[#FFCF56] hover:bg-[#FFD76A] hover:text-[#5f7470] transition-all duration-200 ease-in-out text-[#5f7470]"
                      >
                        Next step
                      </button>
                    )}
                  </td>
                  <td className="border-b border-[#5f7470] border-t  p-2 text-right">
                    <button className="p-0" onClick={() => setInfoJob(job)}>
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
                      className="ml-2"
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
        <div className="lg:hidden block">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`flex flex-col bg-[#5f7470] p-4 mb-4 rounded-lg shadow-md ${isOpacityChanged && job.id !== highlightedJobId ? "opacity-50" : ""}`}
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-[#f4e4ba]">
                  {job.position}
                </h3>
                <span className=" text-[#f4e4ba]">{job.status}</span>
              </div>
              <p className="text-[#f4e4ba]">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-[#f4e4ba]">
                <strong>Company:</strong> {job.company}
              </p>
              <p className="text-[#f4e4ba]">
                <strong>Deadline:</strong> {job.deadline}
              </p>
              <p className="text-[#f4e4ba]">
                <strong>Link:</strong>{" "}
                <a href={job.link!} target="_blank" rel="noopener noreferrer">
                  Job link
                </a>
              </p>
              <div className="flex items-center justify-between mt-4">
                {hasNotifications(job) && (
                  <button
                    onClick={() => handleCheckNotification(job)}
                    className="btn border-0 bg-[#FFCF56] hover:bg-[#FFD76A] hover:text-[#5f7470] transition-all duration-200 ease-in-out text-[#5f7470] px-4 py-2"
                  >
                    Next step
                  </button>
                )}
                <div className="flex items-center">
                  <button className="ml-2" onClick={() => setInfoJob(job)}>
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
                    className="ml-2"
                    onClick={() => handleDelete(job.id!)}
                  >
                    <img src="./trash.png" alt="Delete" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                  <strong>Interview date:</strong> {infoJob.interviewDate}
                </p>
              )}
              <button
                onClick={handleCloseInfo}
                className="mt-4 btn border-0 bg-[#FFCF56] hover:bg-[#FFD76A] hover:text-[#5f7470] transition-all duration-200 ease-in-out text-[#5f7470]"
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
