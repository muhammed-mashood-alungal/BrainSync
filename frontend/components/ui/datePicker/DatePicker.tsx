"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import React, { KeyboardEvent, useRef, useState } from "react";
import { usePopover } from "@/components/ui/popover/usePopover";
import {
  FieldSize,
  FieldTheme,
  fieldSizeClasses,
  fieldThemeClasses,
  fieldTriggerClass,
  popoverClass,
} from "@/components/ui/popover/fieldStyles";
import { parseDateValue, toDateValue } from "@/utils/time.util";

interface DatePickerProps {
  // "yyyy-mm-dd", or "" when empty
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // "yyyy-mm-dd" bounds, inclusive
  min?: string;
  max?: string;
  clearable?: boolean;
  theme?: FieldTheme;
  size?: FieldSize;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const CALENDAR_WIDTH = 288;
const CALENDAR_HEIGHT = 390;
const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, count: number) =>
  new Date(date.getFullYear(), date.getMonth() + count, 1);

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function DatePicker({
  value,
  onChange,
  placeholder = "Select a date",
  min,
  max,
  clearable = true,
  theme = "primary",
  size = "md",
  disabled = false,
  id,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"days" | "months">("days");
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(parseDateValue(value) ?? new Date())
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const colors = fieldThemeClasses[theme];
  const selectedDate = value ? parseDateValue(value) : null;
  const today = toDateValue(new Date());

  const isOutOfRange = (dateValue: string) =>
    (!!min && dateValue < min) || (!!max && dateValue > max);

  // A month is selectable if any of its days is within min/max
  const isMonthOutOfRange = (month: Date) => {
    const first = toDateValue(month);
    const last = toDateValue(
      new Date(month.getFullYear(), month.getMonth() + 1, 0)
    );
    return (!!min && last < min) || (!!max && first > max);
  };

  const closeCalendar = (focusTrigger = false) => {
    setIsOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const openCalendar = () => {
    if (disabled) return;
    setViewMonth(startOfMonth(selectedDate ?? new Date()));
    setMode("days");
    setIsOpen(true);
  };

  const selectDate = (dateValue: string) => {
    if (isOutOfRange(dateValue)) return;
    onChange(dateValue);
    closeCalendar(true);
  };

  const position = usePopover(containerRef, triggerRef, {
    isOpen,
    onClose: () => closeCalendar(),
    preferredHeight: CALENDAR_HEIGHT,
    width: CALENDAR_WIDTH,
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isOpen && e.key === "Escape") {
      // Keep Escape from also closing a parent modal.
      e.preventDefault();
      e.stopPropagation();
      closeCalendar(true);
    }
  };

  // Always 6 weeks so the calendar height doesn't jump between months
  const gridStart = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth(),
    1 - viewMonth.getDay()
  );
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i
    );
    return {
      date,
      value: toDateValue(date),
      inCurrentMonth: date.getMonth() === viewMonth.getMonth(),
    };
  });

  const prevMonth = addMonths(viewMonth, mode === "days" ? -1 : -12);
  const nextMonth = addMonths(viewMonth, mode === "days" ? 1 : 12);
  const canGoPrev =
    mode === "days"
      ? !isMonthOutOfRange(prevMonth)
      : !min || `${prevMonth.getFullYear()}-12-31` >= min;
  const canGoNext =
    mode === "days"
      ? !isMonthOutOfRange(nextMonth)
      : !max || `${nextMonth.getFullYear()}-01-01` <= max;

  const navButtonClass =
    "p-1.5 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white hover:cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent";

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeCalendar() : openCalendar())}
        className={`${fieldTriggerClass} ${fieldSizeClasses[size]} ${
          isOpen ? colors.active : `border-gray-700 ${colors.focus}`
        }`}
      >
        <span
          className={`truncate ${selectedDate ? "text-white" : "text-gray-400"}`}
        >
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        <CalendarDays
          size={size === "sm" ? 16 : 20}
          className="shrink-0 text-gray-400"
        />
      </button>

      {isOpen && position && (
        <div
          role="dialog"
          aria-label="Choose date"
          className={popoverClass}
          style={{
            top: position.top,
            bottom: position.bottom,
            left: position.left,
            width: position.width,
            maxHeight: position.maxHeight,
          }}
        >
          <div className="overflow-y-auto p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setViewMonth(prevMonth)}
                disabled={!canGoPrev}
                aria-label={mode === "days" ? "Previous month" : "Previous year"}
                className={navButtonClass}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setMode(mode === "days" ? "months" : "days")}
                className="px-2 py-1 rounded-md text-sm font-semibold text-white hover:bg-gray-800 hover:cursor-pointer transition-colors"
              >
                {mode === "days"
                  ? viewMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : viewMonth.getFullYear()}
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(nextMonth)}
                disabled={!canGoNext}
                aria-label={mode === "days" ? "Next month" : "Next year"}
                className={navButtonClass}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {mode === "days" ? (
              <>
                <div className="grid grid-cols-7 mb-1">
                  {WEEK_DAYS.map((day) => (
                    <span
                      key={day}
                      className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {days.map((day) => {
                    const isSelected = day.value === value;
                    const isToday = day.value === today;
                    const isDisabled = isOutOfRange(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => selectDate(day.value)}
                        aria-label={formatDisplayDate(day.date)}
                        aria-pressed={isSelected}
                        className={`h-9 w-9 mx-auto flex items-center justify-center rounded-md text-sm transition-colors ${
                          isSelected
                            ? `${colors.selectedBg} font-semibold`
                            : isDisabled
                            ? "text-gray-600 cursor-not-allowed"
                            : `${
                                day.inCurrentMonth ? "text-white" : "text-gray-500"
                              } hover:bg-gray-800 hover:cursor-pointer`
                        } ${isToday && !isSelected ? colors.ring : ""}`}
                      >
                        {day.date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-3 gap-2 py-2">
                {MONTHS.map((label, index) => {
                  const month = new Date(viewMonth.getFullYear(), index, 1);
                  const isDisabled = isMonthOutOfRange(month);
                  const isSelected =
                    !!selectedDate &&
                    selectedDate.getFullYear() === month.getFullYear() &&
                    selectedDate.getMonth() === index;
                  return (
                    <button
                      key={label}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        setViewMonth(month);
                        setMode("days");
                      }}
                      className={`h-12 rounded-md text-sm transition-colors ${
                        isSelected
                          ? `${colors.selectedBg} font-semibold`
                          : isDisabled
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-white hover:bg-gray-800 hover:cursor-pointer"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700 text-sm">
              {clearable && value ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    closeCalendar(true);
                  }}
                  className="text-gray-400 hover:text-white hover:cursor-pointer transition-colors"
                >
                  Clear
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                disabled={isOutOfRange(today)}
                onClick={() => selectDate(today)}
                className={`${colors.link} font-medium hover:cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
