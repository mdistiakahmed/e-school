import { NextResponse } from "next/server";
import { getCourses, saveCourses } from "@/lib/courseStore";

export async function GET() {
  const data = await getCourses();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const data = await getCourses();

  const newCourse = {
    id: crypto.randomUUID(),
    ...body,
  };

  data.courses.push(newCourse);

  await saveCourses(data);

  return NextResponse.json(newCourse);
}

export async function PUT(req: Request) {
  const body = await req.json();

  const data = await getCourses();

  const index = data.courses.findIndex(
    (c: any) => c.id === body.id
  );

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  data.courses[index] = {
    ...data.courses[index],
    ...body,
  };

  await saveCourses(data);

  return NextResponse.json(data.courses[index]);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const data = await getCourses();

  data.courses = data.courses.filter((c: any) => c.id !== id);

  await saveCourses(data);

  return NextResponse.json({ success: true });
}