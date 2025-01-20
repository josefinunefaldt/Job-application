import { FetchJobs } from "./fetchJobs";
import { fetchJobs } from "../src/types/workplaceResponseType";

export const filterJobsByStatus = async (
  status: string
): Promise<fetchJobs[]> => {
  try {
    const data: fetchJobs[] = await FetchJobs();

    if (status === "waiting for an answer") {
      return data.filter((job) => job.status === "waiting for an answer");
    } else if (status === "Draft") {
      return data.filter((job) => job.status === "Draft");
    } else if (status === "interview booked") {
      return data.filter((job) => job.status === "interview booked");
    } else {
      return data;
    }
  } catch (error) {
    console.error(`Error filtering jobs by status "${status}":`, error);
    return [];
  }
};
