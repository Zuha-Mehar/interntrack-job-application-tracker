import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
        company: body.company,
        role: body.role,
        status: body.status || "Applied",
        skills: skills || [],
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
    await prisma.application.deleteMany();

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