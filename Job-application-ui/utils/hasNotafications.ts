import { fetchJobs } from "././../src/types/workplaceResponseType";

export const hasNotifications = (job: fetchJobs) => {
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
