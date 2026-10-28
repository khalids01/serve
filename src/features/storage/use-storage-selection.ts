"use client";

import type {
  Dispatch,
  PointerEvent as ReactPointerEvent,
  SetStateAction,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Rectangle = Point & { width: number; height: number };
type Gesture = {
  pointerId: number;
  area: HTMLElement;
  start: Point;
  point: Point;
  baseline: Set<string>;
  touch: boolean;
  active: boolean;
  timer?: ReturnType<typeof setTimeout>;
};

export function useStorageSelection({
  selection,
  setSelection,
  enabled,
  scope,
}: {
  selection: Set<string>;
  setSelection: Dispatch<SetStateAction<Set<string>>>;
  enabled: boolean;
  scope: string;
}) {
  const [rectangle, setRectangle] = useState<Rectangle>();
  const gesture = useRef<Gesture | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);
  const selected = useRef(selection);
  selected.current = selection;
  const pointerType = useRef("mouse");
  const suppressClick = useRef(false);

  const cancel = useCallback(() => {
    const current = gesture.current;
    gesture.current = undefined;
    if (current?.timer) clearTimeout(current.timer);
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    frame.current = undefined;
    if (current?.area.hasPointerCapture(current.pointerId))
      current.area.releasePointerCapture(current.pointerId);
    setRectangle(undefined);
  }, []);

  const updateRectangle = useCallback(() => {
    frame.current = undefined;
    const current = gesture.current;
    if (!current || current.touch || !current.active) return;
    const bounds = current.area.getBoundingClientRect();
    const startX = Math.max(
      bounds.left,
      Math.min(bounds.right, current.start.x - window.scrollX),
    );
    const startY = Math.max(
      bounds.top,
      Math.min(bounds.bottom, current.start.y - window.scrollY),
    );
    const endX = Math.max(bounds.left, Math.min(bounds.right, current.point.x));
    const endY = Math.max(bounds.top, Math.min(bounds.bottom, current.point.y));
    const box = {
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };
    const next = new Set(current.baseline);
    for (const item of current.area.querySelectorAll<HTMLElement>(
      "[data-entry-id]",
    )) {
      const itemBounds = item.getBoundingClientRect();
      if (
        itemBounds.right > box.x &&
        itemBounds.left < box.x + box.width &&
        itemBounds.bottom > box.y &&
        itemBounds.top < box.y + box.height
      ) {
        const key = item.dataset.entryId;
        if (key) next.add(key);
      }
    }
    setRectangle(box);
    setSelection(next);
  }, [setSelection]);

  const scheduleRectangle = useCallback(() => {
    if (gesture.current?.active && frame.current === undefined)
      frame.current = requestAnimationFrame(updateRectangle);
  }, [updateRectangle]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Changing folders/pages/views must cancel the previous gesture.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancel();
    };
    window.addEventListener("blur", cancel);
    window.addEventListener("pointerup", cancel);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("scroll", scheduleRectangle, true);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("blur", cancel);
      window.removeEventListener("pointerup", cancel);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("scroll", scheduleRectangle, true);
      window.removeEventListener("keydown", handleEscape);
      cancel();
    };
  }, [cancel, scheduleRectangle, enabled, scope]);

  function pointerDown(event: ReactPointerEvent<HTMLElement>) {
    pointerType.current = event.pointerType;
    suppressClick.current = false;
    if (!event.isPrimary) {
      cancel();
      return;
    }
    if (!enabled || event.button !== 0 || gesture.current) return;
    const target = event.target as HTMLElement;
    if (
      target.closest(
        "[data-selection-control], input, select, a, thead, [role='menu']",
      )
    )
      return;
    const item = target.closest<HTMLElement>("[data-entry-id]");
    const touch = event.pointerType !== "mouse";
    // Selected desktop items retain native drag-and-drop for moving files.
    if (
      !touch &&
      item?.dataset.entryId &&
      selected.current.has(item.dataset.entryId) &&
      item.draggable &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey
    )
      return;
    const current: Gesture = {
      pointerId: event.pointerId,
      area: event.currentTarget,
      start: { x: event.pageX, y: event.pageY },
      point: { x: event.clientX, y: event.clientY },
      baseline:
        event.ctrlKey || event.metaKey || event.shiftKey
          ? new Set(selected.current)
          : new Set(),
      touch,
      active: false,
    };
    gesture.current = current;
    if (touch) {
      // Prevent Radix's long-press context menu; native scrolling remains enabled.
      event.stopPropagation();
      const key = item?.dataset.entryId;
      if (key)
        current.timer = setTimeout(() => {
          if (gesture.current !== current) return;
          current.active = true;
          suppressClick.current = true;
          setSelection((previous) => new Set(previous).add(key));
        }, 500);
    }
  }
  function pointerMove(event: ReactPointerEvent<HTMLElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.point = { x: event.clientX, y: event.clientY };
    const distance = Math.hypot(
      event.pageX - current.start.x,
      event.pageY - current.start.y,
    );
    if (current.touch) {
      if (!current.active && distance > 10) cancel();
      return;
    }
    if (!current.active && distance < 6) return;
    if (!current.active) {
      current.active = true;
      current.area.setPointerCapture(current.pointerId);
      suppressClick.current = true;
    }
    event.preventDefault();
    scheduleRectangle();
  }
  function pointerUp(event: ReactPointerEvent<HTMLElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (current.active && !current.touch) updateRectangle();
    cancel();
  }

  return {
    rectangle,
    touchSelection: () =>
      pointerType.current !== "mouse" && selected.current.size > 0,
    areaProps: {
      onPointerDownCapture: pointerDown,
      onPointerMoveCapture: pointerMove,
      onPointerUpCapture: pointerUp,
      onPointerCancel: cancel,
      onDragStartCapture(event: React.DragEvent<HTMLElement>) {
        if (gesture.current) event.preventDefault();
      },
      onLostPointerCapture: cancel,
      onClickCapture(event: React.MouseEvent<HTMLElement>) {
        if (suppressClick.current && event.detail > 0) {
          suppressClick.current = false;
          event.preventDefault();
          event.stopPropagation();
        } else if (
          !(event.target as HTMLElement).closest(
            "[data-entry-id], [data-selection-control], button, a, input",
          )
        )
          setSelection(new Set());
      },
      onContextMenuCapture(event: React.MouseEvent<HTMLElement>) {
        if (pointerType.current && pointerType.current !== "mouse") {
          event.preventDefault();
          event.stopPropagation();
        }
      },
    },
  };
}
