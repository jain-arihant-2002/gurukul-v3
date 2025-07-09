import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/utils/env";
import { fulfillCoursePurchase } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headerList = await headers()
    const signature = headerList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error("Webhook signature verification failed.", error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        console.log("Checkout session completed event received.");

        if (!session?.metadata?.userId || !session?.metadata?.courseId) {
            console.error("Missing metadata on checkout session.");
            return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
        }

        const { userId, courseId } = session.metadata;
        const amount = (session.amount_total! / 100).toFixed(2);

        // Call our DAL function
        const result = await fulfillCoursePurchase(userId, courseId, amount);

        if (!result.success) {
            console.error("Webhook Error: DAL function failed to fulfill order.", { userId, courseId });
            // Return a 500 to let Stripe know it should retry the webhook
            return new NextResponse("Webhook Error: Could not update database.", { status: 500 });
        }
        if (result.success)
            revalidatePath(`/courses`, 'layout');


        console.log(`Successfully fulfilled order for userId: ${userId}, courseId: ${courseId}`);
    } else {
        console.log(`Received unhandled event type: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
}