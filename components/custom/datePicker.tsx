"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function DatePicker({
  date,
  onDateChange,
  className,
  disabled = false,
  placeholder,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState<number | undefined>(date?.getFullYear());
  const [month, setMonth] = useState<number | undefined>(date?.getMonth());

  // Generate years for the dropdown (10 years back, 10 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Month names for the dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (selectedDate) {
      setYear(selectedDate.getFullYear());
      setMonth(selectedDate.getMonth());
    }
  }, [selectedDate]);

  // Update the calendar view when year or month changes
  useEffect(() => {
    if (year !== undefined && month !== undefined) {
      const newDate = new Date(selectedDate || new Date());
      newDate.setFullYear(year);
      newDate.setMonth(month);

      // Only update the view, not the selected date
      if (
        !selectedDate ||
        selectedDate.getFullYear() !== year ||
        selectedDate.getMonth() !== month
      ) {
        // This is just to update the calendar view
      }
    }
  }, [year, month, selectedDate]);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateChange(date);
    if (date) {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    }
    setIsOpen(false);
  };

  const handleYearChange = (value: string) => {
    setYear(Number.parseInt(value));
  };

  const handleMonthChange = (value: string) => {
    setMonth(Number.parseInt(value));
  };

  return (
    <div className={cn("relative", className)}>
      <Popover
        open={isOpen && !disabled}
        onOpenChange={disabled ? undefined : setIsOpen}
      >
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Select a date"
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? `${placeholder || ""} : ${format(selectedDate, "PPP")}`
              : placeholder || "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b flex justify-between items-center">
            <Select value={month?.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year?.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[100px] ml-2">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={
              month !== undefined && year !== undefined
                ? new Date(year, month)
                : undefined
            }
            initialFocus
            className="rounded-md border-none p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
