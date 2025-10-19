'use client';

import React, { forwardRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingLinkButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  href: string;
  children: React.ReactNode;
  asChild?: boolean;
}

const LoadingLinkButton = forwardRef<HTMLButtonElement, LoadingLinkButtonProps>(
  ({ href, children, className, asChild = false, ...buttonProps }, ref) => {
    
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      startTransition(() => {
        router.push(href);
      });
    };

    return (
      <Button
      
        ref={ref} // Forward the ref to the underlying Button
        className={cn("relative cursor-pointer", className)}
        onClick={handleClick}
        disabled={isPending}
        {...buttonProps}
        asChild={asChild}
      >
        <span>
          {isPending && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Loader2 className="w-5 h-5 animate-spin" />
            </span>
          )}

          <span className={cn({ "invisible": isPending })}>
            {children}
          </span>
        </span>
      </Button>
    );
  }
);


export default LoadingLinkButton;