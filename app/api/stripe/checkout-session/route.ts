import { getAuth } from "@/lib/auth/session";
import { getCourseById } from "@/lib/dal";
import { stripe } from "@/lib/stripe";
import { ApiResponses } from "@/utils/apiResponse";
import { env } from "@/utils/env";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the user
    const { user, isAuthenticated } = await getAuth();
    if (!isAuthenticated || !user) {
      return NextResponse.json(ApiResponses.unauthorized("You must be logged in to make a purchase."), { status: 401 });
    }

    // 2. Validate the request body
    const { courseId } = await req.json();
    if (!courseId || typeof courseId !== 'string') {
      return NextResponse.json(ApiResponses.badRequest("Course ID is required."), { status: 400 });
    }

    // 3. Fetch course details from the database
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json(ApiResponses.notFound("Course not found."), { status: 404 });
    }

    if (course.price === "0.00") {
        return NextResponse.json(ApiResponses.badRequest("This course is free and cannot be purchased."), { status: 400 });
    }

    // 4. Create a Stripe Checkout Session
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.shortDescription,
            images: course.coverImage ? [course.coverImage] : [],
          },
          unit_amount: Math.round(parseFloat(course.price) * 100), // Price in cents
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/success`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/cancelled`,
      metadata: {
        userId: user.id,
        courseId: course.id,
      },
    });

    // 5. Return the session ID to the client
    if (!session.id) {
        throw new Error("Stripe session creation failed.");
    }

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error("[STRIPE_CHECKOUT_SESSION_ERROR]", error);
    return NextResponse.json(ApiResponses.internalServerError("An unexpected error occurred."), { status: 500 });
  }
}