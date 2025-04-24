import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  generateContract,
  ContractGenerationResponse,
} from "@/api/jobs/generateContract";
import { toast } from "sonner";
import { Application } from "@/types/job";

interface ContractDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application;
  jobId: number | string;
  onContractGenerated?: (contractData: ContractGenerationResponse) => void;
}

const ContractGenerationDialog: React.FC<ContractDialogProps> = ({
  isOpen,
  onOpenChange,
  application,
  onContractGenerated,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [terms, setTerms] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper function to format dates in YYYY-MM-DD format
  const formatDateForAPI = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    return format(date, "yyyy-MM-dd");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate) {
      toast.error("Start date is required");
      return;
    }

    setIsGenerating(true);

    try {
      const requestData = {
        app_id: application.id,
        start_date: formatDateForAPI(startDate)!,
        ...(endDate && { end_date: formatDateForAPI(endDate) }),
        ...(terms && { terms }),
      };

      const response = await generateContract(requestData);

      toast.success("Contract generated successfully");

      if (onContractGenerated) {
        onContractGenerated(response);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error generating contract:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate contract. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Employment Contract</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date (Required)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Additional Terms (Optional)</Label>
            <Textarea
              id="terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Enter any additional terms or conditions..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isGenerating || !startDate}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Contract"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContractGenerationDialog;
