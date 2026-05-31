import { NextRequest, NextResponse } from "next/server";
import { enrollCourse } from "@/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const { email, courseId } = await req.json();

    if (!email || !courseId) {
      return NextResponse.json(
        { error: "Email and courseId are required" },
        { status: 400 }
      );
    }

    const user = await enrollCourse(email, courseId);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}