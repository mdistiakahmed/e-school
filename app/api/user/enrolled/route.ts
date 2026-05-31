import { NextRequest, NextResponse } from "next/server";
import { getEnrolledCourses } from "@/lib/userStore";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const enrolledCourses = await getEnrolledCourses(email);

    return NextResponse.json({ enrolledCourses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrolled courses" },
      { status: 500 }
    );
  }
}