"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import React, {
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePopover } from "@/components/ui/popover/usePopover";
import {
  FieldSize,
  FieldTheme,
  fieldSizeClasses,
  fieldThemeClasses,
  fieldTriggerClass,
  popoverClass,
} from "@/components/ui/popover/fieldStyles";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  theme?: FieldTheme;
  size?: FieldSize;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const MENU_MAX_HEIGHT = 288;
const MENU_MIN_HEIGHT = 200;
const MENU_MIN_WIDTH = 176;

function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = true,
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  theme = "primary",
  size = "md",
  disabled = false,
  id,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const colors = fieldThemeClasses[theme];
  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search)
    );
  }, [options, query]);

  const closeMenu = (focusTrigger = false) => {
    setIsOpen(false);
    setQuery("");
    if (focusTrigger) triggerRef.current?.focus();
  };

  const openMenu = () => {
    if (disabled) return;
    const selectedIndex = options.findIndex((option) => option.value === value);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const selectOption = (option: DropdownOption) => {
    onChange(option.value);
    closeMenu(true);
  };

  const position = usePopover(containerRef, triggerRef, {
    isOpen,
    onClose: () => closeMenu(),
    preferredHeight: MENU_MAX_HEIGHT,
    minHeight: MENU_MIN_HEIGHT,
    minWidth: MENU_MIN_WIDTH,
  });

  useEffect(() => {
    if (query) setHighlightedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector(`[data-index="${highlightedIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, filteredOptions.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        // Keep Escape from also closing a parent modal.
        e.preventDefault();
        e.stopPropagation();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu();
        break;
    }
  };

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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        className={`${fieldTriggerClass} ${fieldSizeClasses[size]} ${
          isOpen ? colors.active : `border-gray-700 ${colors.focus}`
        }`}
      >
        <span
          className={`truncate ${selectedOption ? "text-white" : "text-gray-400"}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={size === "sm" ? 16 : 20}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && position && (
        <div
          className={popoverClass}
          style={{
            top: position.top,
            bottom: position.bottom,
            left: position.left,
            width: position.width,
            maxHeight: position.maxHeight,
          }}
        >
          {searchable && (
            <div className="relative p-2 border-b border-gray-700">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className={`w-full pl-8 pr-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none ${colors.focus}`}
              />
            </div>
          )}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="overflow-y-auto py-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                {emptyMessage}
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => selectOption(option)}
                    className={`flex items-center justify-between gap-2 px-4 py-2 text-sm cursor-pointer transition-colors ${
                      index === highlightedIndex ? "bg-gray-800" : ""
                    } ${isSelected ? colors.selected : "text-white"}`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check size={16} className="shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
