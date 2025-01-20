import type { components } from "../src/lib/api/v1";
type fetchJobs = components["schemas"]["WorkplaceResponse"];

export const checkPendingStatus = (
  job: fetchJobs,
  addToast: (message: string, type: "info" | "success" | "error") => void
) => {
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

  if (job.status === "Draft" && timeDifference <= 2 && timeDifference >= 0) {
    if (timeDifference < 1) {
      addToast(
        `Apply for position "${job.position}". Deadline in ${Math.ceil(timeDifference)} day!`,
        "error"
      );
    } else {
      addToast(
        `Apply for position "${job.position}". Deadline in ${Math.ceil(timeDifference)} days!`,
        "error"
      );
    }
  } else if (job.status === "Draft" && timeDifference < 0) {
    addToast(`The deadline for "${job.position}" has passed.`, "error");
  }

  if (
    job.status === "waiting for an answer" &&
    statusTimeStamp <= twoWeeksAgo
  ) {
    addToast(
      `Follow up on the job "${job.position}". It's been over two weeks without reply.`,
      "info"
    );
  }

  if (job.status === "interview booked" && timeForJob <= 2 && timeForJob >= 0) {
    const daysToInterview = Math.ceil(timeForJob);
    addToast(
      `Prepare for your interview "${job.position}". It's in ${daysToInterview} days!`,
      "success"
    );
  }
};
