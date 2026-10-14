// Shared trigger/popover styles for Dropdown and DatePicker

export type FieldTheme = "primary" | "admin";
export type FieldSize = "md" | "sm";

export const fieldThemeClasses = {
  primary: {
    active: "border-cyan-400",
    focus: "focus:border-cyan-400",
    selected: "text-[#00D2D9]",
    selectedBg: "bg-[#00D2D9] text-[#1E1E1E] hover:bg-[#00D2D9]",
    ring: "ring-1 ring-[#00D2D9]",
    link: "text-[#00D2D9] hover:text-cyan-300",
  },
  admin: {
    active: "border-[#8979FF]",
    focus: "focus:border-[#8979FF]",
    selected: "text-[#8979FF]",
    selectedBg: "bg-[#8979FF] text-[#1E1E1E] hover:bg-[#8979FF]",
    ring: "ring-1 ring-[#8979FF]",
    link: "text-[#8979FF] hover:text-[#A194FF]",
  },
};

export const fieldSizeClasses = {
  md: "px-4 py-3 bg-transparent",
  sm: "h-10 px-3 text-sm bg-gray-800",
};

export const fieldTriggerClass =
  "w-full flex items-center justify-between gap-2 text-left border rounded-md transition-colors focus:outline-none hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export const popoverClass =
  "fixed z-[60] flex flex-col bg-gray-900 border border-gray-700 rounded-md shadow-xl overflow-hidden [color-scheme:dark]";
