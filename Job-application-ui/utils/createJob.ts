import createClient from "openapi-fetch";
import type { components, paths } from "..//src/lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5279/" });

type postWork = components["schemas"]["WorkplaceRequest"];

export const CreateWorkplace = async (input: postWork) => {
  try {
    const username = localStorage.getItem("userFullName");

    if (!username) {
      throw new Error("User not found in localStorage!");
    }
    const workplaceRequest = {
      ...input,
    };

    const createWorkplaceResponse = await client.POST("/api/Workplaces", {
      body: workplaceRequest,
      params: {
        query: {
          name: username,
        },
      },
    });
    return createWorkplaceResponse.data;
  } catch (error) {
    console.error("Error creating workplace:", error);
    throw error;
  }
};
