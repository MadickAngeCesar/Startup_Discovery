import * as Sentry from "@sentry/nextjs";
import { GET, POST } from "@/auth";

export const POST = async (req: Request) => {
  try {
    // ...existing POST logic...
  } catch (error) {
    Sentry.captureException(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    // ...existing GET logic...
  } catch (error) {
    Sentry.captureException(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
