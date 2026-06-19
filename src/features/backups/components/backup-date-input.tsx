"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type BackupDateInputProps = {
  id: string;
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
};

export function BackupDateInput({
  id,
  label,
  value,
  onChange,
}: BackupDateInputProps) {
  const selected = value ? parseISO(value) : undefined;

  return (
    <div>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "mt-1 h-9 w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, "PPP") : "Pick date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) =>
              onChange(date ? format(date, "yyyy-MM-dd") : undefined)
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
