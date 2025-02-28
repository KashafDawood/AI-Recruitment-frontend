"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resendEmail } from "@/api/auth/resendEmail";
import type { User } from "@/api/auth/verifyEmail";

interface ResendOtpButtonProps {
  user: User;
}

export default function ResendOtpButton({ user }: ResendOtpButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendEmail(user);
      toast.success("OTP resent successfully!", {
        description: "Please check your email for the new OTP.",
      });
    } catch (error) {
      toast.error("Failed to resend OTP", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleResend} disabled={loading} className="w-full">
      {loading ? "Resending..." : "Resend OTP"}
    </Button>
  );
}
