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

function normalizeSkills(skills: unknown) {
  if (Array.isArray(skills)) {
    return skills.map(String).map((skill) => skill.trim()).filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}

function getValidApplicationId(id: string) {
  const applicationId = Number(id);

  if (Number.isNaN(applicationId)) {
    return null;
  }

  return applicationId;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const applicationId = getValidApplicationId(id);

    if (applicationId === null) {
      return Response.json(
        {
          success: false,
          message: "Invalid application ID",
        },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!application) {
      return Response.json(
        {
          success: false,
          message: "Application not found",
        },
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
    const { id } = await context.params;
    const applicationId = getValidApplicationId(id);

    if (applicationId === null) {
      return Response.json(
        {
          success: false,
          message: "Invalid application ID",
        },
        { status: 400 }
      );
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!existingApplication) {
      return Response.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const status =
      typeof body.status === "string" &&
      allowedStatuses.includes(body.status as ApplicationStatus)
        ? body.status
        : undefined;

    const skills =
      body.skills !== undefined ? normalizeSkills(body.skills) : undefined;

    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        ...(body.company !== undefined && { company: body.company }),
        ...(body.role !== undefined && { role: body.role }),
        ...(status !== undefined && { status }),
        ...(skills !== undefined && { skills }),
        ...(body.jobLink !== undefined && { jobLink: body.jobLink || null }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
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
    const { id } = await context.params;
    const applicationId = getValidApplicationId(id);

    if (applicationId === null) {
      return Response.json(
        {
          success: false,
          message: "Invalid application ID",
        },
        { status: 400 }
      );
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!existingApplication) {
      return Response.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    await prisma.application.delete({
      where: {
        id: applicationId,
      },
    });

    return Response.json({
      success: true,
      message: "Application deleted successfully",
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