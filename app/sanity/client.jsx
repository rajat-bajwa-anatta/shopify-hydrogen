import { createClient } from "@sanity/client";

 const sanityClient = createClient({
  projectId: "ndbqii65",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default sanityClient;