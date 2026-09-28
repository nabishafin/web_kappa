"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";

export default function AppError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // TODO: forward to the error-reporting service (Sentry etc.)
    console.error(error);
  }, [error]);

  return <ErrorState primary={<Button variant="flat" onClick={() => retry()} className="w-[162px] rounded-[8px] text-base font-semibold">Try Again</Button>} />;
}
