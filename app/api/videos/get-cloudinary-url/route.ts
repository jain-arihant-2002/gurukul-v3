// In: app/api/videos/get-cloudinary-url/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/session";
import { checkUserEnrollment, getLectureWithCourseId } from "@/lib/dal";
import { ApiResponses } from "@/utils/apiResponse";
import cloudinary, { getPublicIdFromUrl } from "@/lib/cloudinary";


export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuth();
    if (!user) {
      return NextResponse.json(ApiResponses.unauthorized("You must be logged in to view this content."), { status: 401 });
    }

    const { lectureId } = await req.json();
    if (!lectureId) {
      return NextResponse.json(ApiResponses.badRequest("lectureId is required."), { status: 400 });
    }

    const { data: lecture, error: lectureError } = await getLectureWithCourseId(lectureId);

    if (lectureError || !lecture) {
      return NextResponse.json(ApiResponses.notFound("Lecture not found."), { status: 404 });
    }

    if (!lecture.videoUrl) {
      return NextResponse.json(ApiResponses.notFound("This lecture does not have a video."), { status: 404 });
    }

    let isAuthorized = false;

    if (lecture.isFreePreview) {
      isAuthorized = true;
    } else {
      const enrollment = await checkUserEnrollment(user.id, lecture.courseId);
      if (enrollment) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(ApiResponses.forbidden("You are not enrolled in this course."), { status: 403 });
    }

    // GENERATE SECURE URL: for authorized user creating time-limited URL.
    const publicId = getPublicIdFromUrl(lecture.videoUrl);

    if (!publicId) {
      console.error("Could not extract public_id from URL:", lecture.videoUrl);
      return NextResponse.json(ApiResponses.internalServerError("Video processing error."), { status: 500 });
    }

    const signedUrl = cloudinary.utils.url(`${publicId}.m3u8`, {
      resource_type: "video",
      type: "hls",
      sign_url: true,
      secure: true,
      expires_at: Math.round(Date.now() / 1000) + 3600, // URL is valid for 1 hour
    });

    // Send the secure URL to the client.
    return NextResponse.json({ signedUrl });

  } catch (error) {
    console.error("[GET_CLOUDINARY_URL_ERROR]", error);
    return NextResponse.json(ApiResponses.internalServerError(), { status: 500 });
  }
}