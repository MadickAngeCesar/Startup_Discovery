import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token } from "../env";

if (!token) {
  throw new Error("Missing SANITY_WRITE_TOKEN environment variable");
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});
