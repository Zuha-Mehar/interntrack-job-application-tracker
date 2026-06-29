import { applications as mockApplications } from "../../../../data/mockData";
import { prisma } from "../../../../lib/prisma";
import type { ApplicationStatus } from "../../../../types";

const allowedStatuses: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

function parseAppliedDate(dateValue: string) {
  const parsedDate = new Date(dateValue);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return new Date();
}

function getValidStatus(status: string): ApplicationStatus {
  if (allowedStatuses.includes(status as ApplicationStatus)) {
    return status as ApplicationStatus;
  }

  return "Applied";
}

export async function POST() {
  try {
    await prisma.application.deleteMany();

    const demoApplications = mockApplications.map((application) => ({
      company: application.company,
      role: application.role,
      status: getValidStatus(application.status),
      appliedDate: parseAppliedDate(application.appliedDate),
      skills: application.skills,
      jobLink: application.jobLink || null,
      notes: application.notes || null,
    }));

    const createdApplications = await prisma.application.createMany({
      data: demoApplications,
    });

    return Response.json({
      success: true,
      message: "Demo applications reset successfully",
      data: createdApplications,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to reset demo applications",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}