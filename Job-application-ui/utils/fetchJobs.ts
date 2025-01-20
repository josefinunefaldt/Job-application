import createClient from "openapi-fetch";
import type { paths } from "..//src/lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5279/" });

export const FetchJobs = async () => {
  try {
    const username = localStorage.getItem("userFullName");

    if (!username) {
      throw new Error("User not found in localStorage!");
    }

    const response = await client.GET("/api/Workplaces", {
      params: {
        query: {
          name: username,
        },
      },
    });

    const sortedJobs = (response.data || []).sort((a, b) => {
      const deadlineA = new Date(a.deadline!);
      const deadlineB = new Date(b.deadline!);

      return deadlineA.getTime() - deadlineB.getTime();
    });

    return sortedJobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
