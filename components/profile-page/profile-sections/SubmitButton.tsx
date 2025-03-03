import React from "react";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  isSubmitting: boolean;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="absolute bottom-4 right-4">
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default SubmitButton;
