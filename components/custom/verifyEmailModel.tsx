"use client";

import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { type User, verifyEmail } from "@/api/auth/verifyEmail";
import { useRouter } from "next/navigation";
import { createSession } from "@/app/_lib/session";
import { removeUserFromLocalStorage } from "@/app/_lib/localStorage";
import ResendOtpButton from "@/components/custom/ResendOtpButton"; // Import ResendOtpButton
import { getme } from "@/api/auth/getme";

interface EmailVerificationDrawerProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmailVerificationDrawer({
  user,
  open,
  onOpenChange,
}: EmailVerificationDrawerProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyEmail(user, otp.join(""));
      toast.success("Email verified successfully!", {
        description: "You can now access all features of the app.",
      });
      removeUserFromLocalStorage(); // Remove user from local storage after verification
      await getme();
      createSession(user.id, user.role);
      router.push(`/${user.role}`); // Redirect to the page based on user role
      onOpenChange(false);
    } catch (error) {
      toast.error("Verification failed", {
        description:
          error instanceof Error
            ? "Please check your OTP and try again."
            : "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
      <div className="fixed inset-0 flex items-center justify-center">
        <DrawerContent
          className="w-[350px] mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <DrawerHeader>
            <DrawerTitle>Verify Your Email</DrawerTitle>
            <DrawerDescription>
              Enter the 6-digit code sent to your email
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(index, e)
                  }
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="w-10 h-10 text-center"
                />
              ))}
            </div>
            <Button
              onClick={handleVerify}
              disabled={otp.join("").length !== 6 || loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
            <ResendOtpButton user={user} /> {/* Add ResendOtpButton */}
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="mt-4 w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerContent>
      </div>
    </Drawer>
  );
}
