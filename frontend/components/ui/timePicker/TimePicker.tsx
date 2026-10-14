"use client";

import { Clock } from "lucide-react";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { usePopover } from "@/components/ui/popover/usePopover";
import {
  FieldSize,
  FieldTheme,
  fieldSizeClasses,
  fieldThemeClasses,
  fieldTriggerClass,
  popoverClass,
} from "@/components/ui/popover/fieldStyles";

interface TimePickerProps {
  // 24-hour "HH:mm", or "" when empty
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // Gap between the minutes listed (an off-step value is still shown)
  minuteStep?: number;
  clearable?: boolean;
  theme?: FieldTheme;
  size?: FieldSize;
  disabled?: boolean;
  id?: string;
  className?: string;
}

type Period = "AM" | "PM";

const POPOVER_WIDTH = 240;
const POPOVER_HEIGHT = 300;
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);

const pad = (num: number) => String(num).padStart(2, "0");

const parseTime = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes) || !value) return null;
  return {
    hour12: hours % 12 || 12,
    minute: minutes,
    period: (hours >= 12 ? "PM" : "AM") as Period,
  };
};

const toTimeValue = (hour12: number, minute: number, period: Period) => {
  const hours = (hour12 % 12) + (period === "PM" ? 12 : 0);
  return `${pad(hours)}:${pad(minute)}`;
};

export const formatTimeValue = (value: string) => {
  const time = parseTime(value);
  if (!time) return "";
  return `${pad(time.hour12)}:${pad(time.minute)} ${time.period}`;
};

function TimePicker({
  value,
  onChange,
  placeholder = "Select a time",
  minuteStep = 5,
  clearable = true,
  theme = "primary",
  size = "md",
  disabled = false,
  id,
  className = "",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  const colors = fieldThemeClasses[theme];
  const selected = parseTime(value);

  const minutes = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep
  );
  if (selected && !minutes.includes(selected.minute)) {
    minutes.push(selected.minute);
    minutes.sort((a, b) => a - b);
  }

  const closePicker = (focusTrigger = false) => {
    setIsOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const position = usePopover(containerRef, triggerRef, {
    isOpen,
    onClose: () => closePicker(),
    preferredHeight: POPOVER_HEIGHT,
    width: POPOVER_WIDTH,
  });

  // Picking one part fills the others from the current value, or sensible
  // defaults (":00", and the current AM/PM) when nothing is set yet.
  const update = (part: { hour12?: number; minute?: number; period?: Period }) => {
    const now = new Date();
    onChange(
      toTimeValue(
        part.hour12 ?? selected?.hour12 ?? (now.getHours() % 12 || 12),
        part.minute ?? selected?.minute ?? 0,
        part.period ?? selected?.period ?? (now.getHours() >= 12 ? "PM" : "AM")
      )
    );
  };

  // Bring the selected hour/minute into view when the picker opens
  const isPositioned = !!position;
  useEffect(() => {
    if (!isOpen || !isPositioned) return;
    columnsRef.current
      ?.querySelectorAll<HTMLElement>("[data-selected='true']")
      .forEach((el) => {
        const column = el.parentElement;
        if (column) {
          column.scrollTop =
            el.offsetTop - column.clientHeight / 2 + el.clientHeight / 2;
        }
      });
  }, [isOpen, isPositioned]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isOpen && e.key === "Escape") {
      // Keep Escape from also closing a parent modal.
      e.preventDefault();
      e.stopPropagation();
      closePicker(true);
    }
  };

  const optionClass = (isSelected: boolean) =>
    `w-full h-9 shrink-0 flex items-center justify-center rounded-md text-sm transition-colors hover:cursor-pointer ${
      isSelected
        ? `${colors.selectedBg} font-semibold`
        : "text-white hover:bg-gray-800"
    }`;

  const columnClass =
    "relative h-52 flex flex-col gap-1 overflow-y-auto px-1 [scrollbar-width:thin]";

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
        onClick={() => (isOpen ? closePicker() : setIsOpen(true))}
        className={`${fieldTriggerClass} ${fieldSizeClasses[size]} ${
          isOpen ? colors.active : `border-gray-700 ${colors.focus}`
        }`}
      >
        <span
          className={`truncate ${selected ? "text-white" : "text-gray-400"}`}
        >
          {selected ? formatTimeValue(value) : placeholder}
        </span>
        <Clock
          size={size === "sm" ? 16 : 20}
          className="shrink-0 text-gray-400"
        />
      </button>

      {isOpen && position && (
        <div
          role="dialog"
          aria-label="Choose time"
          className={popoverClass}
          style={{
            top: position.top,
            bottom: position.bottom,
            left: position.left,
            width: position.width,
            maxHeight: position.maxHeight,
          }}
        >
          <div className="grid grid-cols-3 text-xs font-medium text-gray-500 text-center pt-3 pb-1 px-2">
            <span>Hour</span>
            <span>Min</span>
            <span />
          </div>

          <div
            ref={columnsRef}
            className="grid grid-cols-3 gap-1 px-2"
          >
            <div className={columnClass}>
              {HOURS.map((hour) => {
                const isSelected = selected?.hour12 === hour;
                return (
                  <button
                    key={hour}
                    type="button"
                    data-selected={isSelected}
                    onClick={() => update({ hour12: hour })}
                    className={optionClass(isSelected)}
                  >
                    {pad(hour)}
                  </button>
                );
              })}
            </div>
            <div className={columnClass}>
              {minutes.map((minute) => {
                const isSelected = selected?.minute === minute;
                return (
                  <button
                    key={minute}
                    type="button"
                    data-selected={isSelected}
                    onClick={() => update({ minute })}
                    className={optionClass(isSelected)}
                  >
                    {pad(minute)}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-1 px-1">
              {(["AM", "PM"] as Period[]).map((period) => {
                const isSelected = selected?.period === period;
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => update({ period })}
                    className={optionClass(isSelected)}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between mx-3 mt-2 py-3 border-t border-gray-700 text-sm">
            {clearable && value ? (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  closePicker(true);
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
              onClick={() => closePicker(true)}
              className={`${colors.link} font-medium hover:cursor-pointer transition-colors`}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePicker;
