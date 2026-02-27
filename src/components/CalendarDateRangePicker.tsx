import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { startOfYear, endOfYear, startOfMonth, endOfMonth, setMonth, setYear, getYear, getMonth, format, addDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CalendarDateRangePickerProps {
    className?: string
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
}

export function CalendarDateRangePicker({
    className,
    date,
    setDate,
}: CalendarDateRangePickerProps) {
    const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleYearChange = (yearStr: string) => {
        const year = parseInt(yearStr);
        const newDate = new Date();
        newDate.setFullYear(year);
        setDate({
            from: startOfYear(newDate),
            to: endOfYear(newDate)
        });
    };

    const handleMonthChange = (monthStr: string) => {
        const monthIndex = months.indexOf(monthStr);
        if (monthIndex === -1) return;

        // Use existing year from date range, or current year
        const currentYear = date?.from ? getYear(date.from) : new Date().getFullYear();
        const newDate = new Date();
        newDate.setFullYear(currentYear);
        newDate.setMonth(monthIndex);

        setDate({
            from: startOfMonth(newDate),
            to: endOfMonth(newDate)
        });
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-black/90 border-white/10 backdrop-blur-xl" align="end">
                    <div className="flex gap-2 mb-4">
                        <Select onValueChange={handleYearChange}>
                            <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-gray-300 h-8 text-xs">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(year => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={handleMonthChange}>
                            <SelectTrigger className="w-[130px] bg-white/5 border-white/10 text-gray-300 h-8 text-xs">
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(month => (
                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        className="bg-transparent border-0"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
