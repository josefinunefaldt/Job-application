import createClient from "openapi-fetch";
import type { paths } from "../src/lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5279/" });

export const DeleteJob = async (id: number) => {
  try {
    const deleteWorkplaceResponse = await client.DELETE(
      "/api/Workplaces/{id}",
      {
        params: {
          path: {
            id: id,
          },
        },
      }
    );

    return deleteWorkplaceResponse.data;
  } catch (error) {
    console.error("Error updating workplace:", error);
    throw error;
  }
};
