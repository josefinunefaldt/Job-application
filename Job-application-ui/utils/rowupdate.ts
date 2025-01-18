import type { components } from "../src/lib/api/v1";

type fetchJobs = components["schemas"]["WorkplaceResponse"];

export const getRowClass = (job: fetchJobs) => {
  const currentDate = new Date();
  const statusTimeStamp = new Date(job.statusTimeStamp || "");
  const twoWeeksAgo = new Date(currentDate.setDate(currentDate.getDate() - 14));

  return job.status === "waiting for an answer" &&
    statusTimeStamp <= twoWeeksAgo
    ? "highlight"
    : "";
};
