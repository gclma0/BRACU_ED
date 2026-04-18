import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { StudentAttendanceTable } from "./student-attendance-table";
import type { PageProps } from "next";

export const runtime = "nodejs";

type Params = Promise<{ courseId: string }>;

export default async function AttendanceDetailPage({
  params,
}: PageProps<{
  params: Params;
}>) {
  const session = await auth();

  const { courseId } = await params; // ✅ MUST await

  const course = await db.course.findUnique({
    where: { id: courseId, facultyId: session?.user.id },
    include: {
      faculty: true,
      Enrollment: {
        include: {
          student: true,
        },
      },
      Attendance: {
        include: {
          records: true,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!course) return <div>Course not found</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        Attendance for {course.title} - Section {course.section}
      </h1>

      <StudentAttendanceTable
        enrollments={course.Enrollment}
        attendanceRecords={course.Attendance}
      />
    </div>
  );
}