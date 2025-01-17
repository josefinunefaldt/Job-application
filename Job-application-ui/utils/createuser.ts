import createClient from "openapi-fetch";
import type { components, paths } from "..//src/lib/api/v1";

const client = createClient<paths>({ baseUrl: "http://localhost:5279/" });
type postUser = components["schemas"]["UserRequest"];
export const CreateUser = async (input: postUser) => {
  try {
    const response = await client.POST("/api/Users", {
      query: undefined,
      body: input,
    });
    return response;
  } catch (error) {
    console.error("Error create user");
    throw error;
  }
};
