"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import React, {
  KeyboardEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  theme?: "primary" | "admin";
  size?: "md" | "sm";
  disabled?: boolean;
  id?: string;
  className?: string;
}

interface MenuPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

const MENU_MAX_HEIGHT = 288;
const MENU_MIN_WIDTH = 176;
const MENU_GAP = 6;
const VIEWPORT_PADDING = 8;

const themeClasses = {
  primary: {
    active: "border-cyan-400",
    focus: "focus:border-cyan-400",
    selected: "text-[#00D2D9]",
  },
  admin: {
    active: "border-[#8979FF]",
    focus: "focus:border-[#8979FF]",
    selected: "text-[#8979FF]",
  },
};

const sizeClasses = {
  md: "px-4 py-3 bg-transparent",
  sm: "h-10 px-3 text-sm bg-gray-800",
};

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
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const colors = themeClasses[theme];
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

  // The menu is position: fixed so it is never clipped by an overflow-hidden
  // parent (e.g. BaseModal), but it stays inside this component's DOM so
  // "click outside" checks on parents still treat it as inside.
  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP;
    const spaceAbove = rect.top - MENU_GAP;
    const openUpwards =
      spaceBelow < Math.min(MENU_MAX_HEIGHT, 200) && spaceAbove > spaceBelow;

    const width = Math.max(rect.width, MENU_MIN_WIDTH);
    const left = Math.max(
      VIEWPORT_PADDING,
      Math.min(rect.left, window.innerWidth - width - VIEWPORT_PADDING)
    );
    const maxHeight = Math.min(
      MENU_MAX_HEIGHT,
      (openUpwards ? spaceAbove : spaceBelow) - VIEWPORT_PADDING
    );

    setPosition(
      openUpwards
        ? { bottom: window.innerHeight - rect.top + MENU_GAP, left, width, maxHeight }
        : { top: rect.bottom + MENU_GAP, left, width, maxHeight }
    );
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
        className={`w-full flex items-center justify-between gap-2 text-left border rounded-md transition-colors focus:outline-none hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          sizeClasses[size]
        } ${isOpen ? colors.active : `border-gray-700 ${colors.focus}`}`}
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
          className="fixed z-[60] flex flex-col bg-gray-900 border border-gray-700 rounded-md shadow-xl overflow-hidden [color-scheme:dark]"
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
