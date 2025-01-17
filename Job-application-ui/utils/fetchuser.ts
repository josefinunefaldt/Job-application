import createClient from "openapi-fetch";
import type { paths } from "..//src/lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5279/" });

export const GetUser = async (getUser: string) => {
  try {
    const response = await client.GET("/api/Users/{name}", {
      params: {
        path: {
          name: getUser,
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};
