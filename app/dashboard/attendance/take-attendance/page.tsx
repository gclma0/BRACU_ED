import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import TakeAttendanceForm from "./take-attendance-form";
import type { PageProps } from "next";

interface SearchParams {
  [key: string]: string;
}

type SearchParamsPromise = Promise<SearchParams>;

export default async function TakeAttendancePage({
  searchParams,
}: PageProps<{
  searchParams: SearchParamsPromise;
}>) {
  const { date, courseId, section, time } = await searchParams;

  const session = await auth();

  const course = await db.course.findFirst({
    where: {
      id: courseId,
      facultyId: session?.user.id,
      section: section,
    },
    include: {
      faculty: true,
      Enrollment: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!course) return <div>Course not found</div>;

  return (
    <div className="container mx-auto py-10">
      <TakeAttendanceForm course={course} date={date} timeSchedule={time} />
    </div>
  );
}
