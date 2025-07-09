'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { env } from '@/utils/env';
import { useAuth } from '@/lib/auth/use-session';
import { freeCoursePurchaseAction } from '../../_actions/action';

// Initialize Stripe outside of the component to avoid re-creating it on every render.
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface PurchaseButtonProps {
  courseId: string;
  price: number;
}

export default function PurchaseButton({ courseId, price }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handlePurchase = async () => {
    // 1. Check if user is logged in
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase a course.");
      router.push('/sign-in');
      return;
    }

    setIsLoading(true);
    toast.loading("Redirecting to checkout...");

    try {
      // 2. Call our backend to create the checkout session
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const session = await response.json();

      if (!response.ok) {
        // Handle errors from our API (e.g., course not found, free course)
        toast.dismiss();
        toast.error(session.message || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      // 3. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js failed to load.");
      }

      toast.dismiss();
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (error) {
        toast.error(error.message || "Failed to redirect to Stripe.");
      }

    } catch (err) {
      console.error("Purchase failed:", err);
      toast.dismiss();
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleFreePurchase = async () => {
    // 1. Check if user is logged in
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase a course.");
      router.push('/sign-in');
      return;
    }
    setIsLoading(true);
    toast.loading("Redirecting to checkout...");

    try {
      const result = await freeCoursePurchaseAction(courseId)
      if (result.error) {
        toast.dismiss();
        console.error("Free purchase failed:", result.error);
        return toast.error("An unexpected error occurred. Please try again.");
      }
      router.push(`/courses/${courseId}/success`);
      return toast.success("Course purchased successfully!");
    }
    catch (error) {
      toast.dismiss();
      console.error("Free purchase failed:", error);
      return toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (price === 0) {
    return (
      <Button className="w-full text-lg font-semibold" onClick={handleFreePurchase} disabled={isLoading}>
        <CheckCircle className="w-5 h-5 mr-2" />
        Enroll for Free
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      className="w-full text-lg font-semibold"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <span>Buy Course  <span className="font-bold">${price}</span></span>
      )}
    </Button>
  );
}