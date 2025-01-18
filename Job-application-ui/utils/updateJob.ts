import createClient from "openapi-fetch";
import type { components, paths } from "../src/lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5279/" });

type postWork = components["schemas"]["WorkplaceRequest"];

export const UpdateWorkplace = async (id: number, input: postWork) => {
  try {
    const workplaceRequest = {
      ...input,
    };

    const updateWorkplaceResponse = await client.PATCH("/api/Workplaces/{id}", {
      params: {
        path: {
          id: id,
        },
      },
      body: workplaceRequest,
    });

    return updateWorkplaceResponse.data;
  } catch (error) {
    console.error("Error updating workplace:", error);
    throw error;
  }
};
