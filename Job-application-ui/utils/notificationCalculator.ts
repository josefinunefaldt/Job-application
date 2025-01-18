import type { components } from "../src/lib/api/v1";
type fetchJobs = components["schemas"]["WorkplaceResponse"];

export const checkPendingStatus = (job: fetchJobs) => {
  const currentDate = new Date();
  const statusTimeStamp = new Date(job.statusTimeStamp || "");
  const twoWeeksAgo = new Date(currentDate.setDate(currentDate.getDate() - 14));

  if (
    job.status === "waiting for an answer" &&
    statusTimeStamp <= twoWeeksAgo
  ) {
    alert(
      `Reminder: Follow up on the job "${job.position}". It's been over two weeks since the status was updated.`
    );
  }
};
