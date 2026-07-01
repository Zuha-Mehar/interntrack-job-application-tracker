import { auth } from "@clerk/nextjs/server";
import { get } from "@vercel/blob";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getValidApplicationId(id: string) {
  const applicationId = Number(id);

  if (Number.isNaN(applicationId)) {
    return null;
  }

  return applicationId;
}

function getPathnameFromBlobUrl(blobUrl: string) {
  const url = new URL(blobUrl);
  return url.pathname.replace(/^\/+/, "");
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const applicationId = getValidApplicationId(id);

    if (!applicationId) {
      return Response.json(
        { success: false, message: "Invalid application id" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
      select: {
        resumeUrl: true,
        resumeFileName: true,
      },
    });

    if (!application || !application.resumeUrl) {
      return Response.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    const pathname = getPathnameFromBlobUrl(application.resumeUrl);

    const result = await get(pathname, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (result?.statusCode !== 200) {
      return new Response("Resume not found", { status: 404 });
    }

    const fileName = application.resumeFileName || "resume.pdf";

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/pdf",
        "Content-Disposition": `inline; filename="${fileName.replaceAll(
          '"',
          ""
        )}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Resume view error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to open resume",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}