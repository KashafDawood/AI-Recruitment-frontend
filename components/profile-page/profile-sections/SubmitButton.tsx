import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="bg-primary hover:bg-primary/90 text-white"
    >
      {isSubmitting ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
};

export default SubmitButton;
