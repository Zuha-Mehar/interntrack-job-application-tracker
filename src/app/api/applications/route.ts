import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch applications",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const body = await request.json();

    const skills =
      typeof body.skills === "string"
        ? body.skills
            .split(",")
            .map((skill: string) => skill.trim())
            .filter(Boolean)
        : body.skills;

    const newApplication = await prisma.application.create({
      data: {
        userId,
        company: body.company,
        role: body.role,
        status: body.status || "Applied",
        skills: skills || [],
        resumeUsed: body.resumeUsed || null,
        resumeFileName: body.resumeFileName || null,
        resumeUrl: body.resumeUrl || null,
        jobLink: body.jobLink || null,
        notes: body.notes || null,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Application created successfully",
        data: newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to create application",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    await prisma.application.deleteMany({
      where: { userId },
    });

    return Response.json({
      success: true,
      message: "All applications deleted successfully",
      data: null,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to delete applications",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}