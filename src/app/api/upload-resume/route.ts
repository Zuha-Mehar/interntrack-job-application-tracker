import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized. Please sign in again.",
          data: null,
        },
        { status: 401 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json(
        {
          success: false,
          message: "Blob token is missing.",
          error:
            "BLOB_READ_WRITE_TOKEN is not available in .env.local. Add it and restart npm run dev.",
          data: null,
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "No file uploaded.",
          data: null,
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        {
          success: false,
          message: "Only PDF resumes are allowed.",
          data: null,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        {
          success: false,
          message: "Resume PDF must be less than 4 MB.",
          data: null,
        },
        { status: 400 }
      );
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const pathname = `resumes/${userId}/${Date.now()}-${safeFileName}`;

    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return Response.json({
      success: true,
      message: "Resume uploaded successfully.",
      data: {
        resumeFileName: file.name,
        resumeUrl: blob.url,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to upload resume.",
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      },
      { status: 500 }
    );
  }
}