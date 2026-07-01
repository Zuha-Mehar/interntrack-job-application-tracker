import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";
import type { ApplicationStatus } from "../../../../types";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedStatuses: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

function getValidApplicationId(id: string) {
  const applicationId = Number(id);

  if (Number.isNaN(applicationId)) {
    return null;
  }

  return applicationId;
}

function normalizeSkills(skills: unknown) {
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  if (Array.isArray(skills)) {
    return skills
      .map((skill) => String(skill).trim())
      .filter(Boolean);
  }

  return undefined;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const applicationId = getValidApplicationId(id);

    if (!applicationId) {
      return Response.json(
        { success: false, message: "Invalid application id", data: null },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
    });

    if (!application) {
      return Response.json(
        { success: false, message: "Application not found", data: null },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Application fetched successfully",
      data: application,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch application",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const applicationId = getValidApplicationId(id);

    if (!applicationId) {
      return Response.json(
        { success: false, message: "Invalid application id", data: null },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
    });

    if (!existingApplication) {
      return Response.json(
        { success: false, message: "Application not found", data: null },
        { status: 404 }
      );
    }

    let status: ApplicationStatus | undefined;

    if (body.status !== undefined) {
      if (!allowedStatuses.includes(body.status)) {
        return Response.json(
          { success: false, message: "Invalid status", data: null },
          { status: 400 }
        );
      }

      status = body.status;
    }

    const skills = body.skills !== undefined ? normalizeSkills(body.skills) : undefined;

    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        ...(body.company !== undefined && { company: body.company }),
        ...(body.role !== undefined && { role: body.role }),
        ...(status !== undefined && { status }),
        ...(skills !== undefined && { skills }),
        ...(body.resumeUsed !== undefined && {
          resumeUsed: body.resumeUsed || null,
        }),
        ...(body.resumeFileName !== undefined && {
          resumeFileName: body.resumeFileName || null,
        }),
        ...(body.resumeUrl !== undefined && {
          resumeUrl: body.resumeUrl || null,
        }),
        ...(body.jobLink !== undefined && {
          jobLink: body.jobLink || null,
        }),
        ...(body.notes !== undefined && {
          notes: body.notes || null,
        }),
      },
    });

    return Response.json({
      success: true,
      message: "Application updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update application",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const applicationId = getValidApplicationId(id);

    if (!applicationId) {
      return Response.json(
        { success: false, message: "Invalid application id", data: null },
        { status: 400 }
      );
    }

    const deletedApplication = await prisma.application.deleteMany({
      where: {
        id: applicationId,
        userId,
      },
    });

    if (deletedApplication.count === 0) {
      return Response.json(
        { success: false, message: "Application not found", data: null },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Application deleted successfully",
      data: null,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to delete application",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}