"use client";

import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface PopoverPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

interface UsePopoverOptions {
  isOpen: boolean;
  onClose: () => void;
  // Height the popover would like to have; it is capped to the space available
  preferredHeight: number;
  // Below this much space under the trigger, it opens upwards instead
  minHeight?: number;
  // Popover width; defaults to the trigger width (but at least minWidth)
  width?: number;
  minWidth?: number;
}

const GAP = 6;
const VIEWPORT_PADDING = 8;

// Positions a popover with position: fixed next to its trigger, so it is never
// clipped by an overflow-hidden parent (e.g. BaseModal). The popover must stay
// rendered inside containerRef (no portal) so "click outside" checks on parents
// still treat clicks in it as inside.
export function usePopover(
  containerRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  {
    isOpen,
    onClose,
    preferredHeight,
    minHeight = preferredHeight,
    width,
    minWidth = 0,
  }: UsePopoverOptions
) {
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const spaceBelow = window.innerHeight - rect.bottom - GAP;
      const spaceAbove = rect.top - GAP;
      const openUpwards =
        spaceBelow < Math.min(preferredHeight, minHeight) &&
        spaceAbove > spaceBelow;

      const popoverWidth = width ?? Math.max(rect.width, minWidth);
      const left = Math.max(
        VIEWPORT_PADDING,
        Math.min(rect.left, window.innerWidth - popoverWidth - VIEWPORT_PADDING)
      );
      const maxHeight = Math.min(
        preferredHeight,
        (openUpwards ? spaceAbove : spaceBelow) - VIEWPORT_PADDING
      );

      setPosition(
        openUpwards
          ? {
              bottom: window.innerHeight - rect.top + GAP,
              left,
              width: popoverWidth,
              maxHeight,
            }
          : { top: rect.bottom + GAP, left, width: popoverWidth, maxHeight }
      );
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, preferredHeight, minHeight, width, minWidth]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onCloseRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return position;
}
