// components/LoadingLinkButton.tsx

'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingLinkButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function LoadingLinkButton({
  href,
  children,
  className,
  ...buttonProps
}: LoadingLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Safety: reset if navigation fails
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    // Button uses `asChild` so its props (className, onClick, disabled, etc.)
    // are forwarded to the Link child. We keep `relative` on the button to
    // allow absolutely-positioned spinner overlay.
    <Button
      asChild
      className={cn("relative", className)}
      onClick={() => setIsLoading(true)}
      disabled={isLoading}
      {...buttonProps}
    >
      <Link href={href}>
        {/* spinner overlays the content without affecting layout */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader2 className="w-5 h-5 animate-spin" />
          </span>
        )}

        {/* keep text in DOM (invisible) so button size doesn't change */}
        <span className={cn({ invisible: isLoading })}>{children}</span>
      </Link>
    </Button>
  );
}