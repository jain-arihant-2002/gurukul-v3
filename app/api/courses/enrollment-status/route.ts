import { getAuth } from "@/lib/auth/session";
import { checkUserEnrollment } from "@/lib/dal";
import { ApiResponses } from "@/utils/apiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {

    const { user, isAuthenticated } = await getAuth();
    if (!isAuthenticated || !user) {
      return NextResponse.json({ isEnrolled: false });
    }

    // 2. Get courseId from query parameters
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(ApiResponses.badRequest("courseId is required."), { status: 400 });
    }

    // 3. Check enrollment status via DAL
    const enrollment = await checkUserEnrollment(user.id, courseId);

    // 4. Return the status
    return NextResponse.json({ isEnrolled: !!enrollment });

  } catch (error) {
    console.error("[ENROLLMENT_STATUS_ERROR]", error);
    return NextResponse.json(ApiResponses.internalServerError("An unexpected error occurred."), { status: 500 });
  }
}