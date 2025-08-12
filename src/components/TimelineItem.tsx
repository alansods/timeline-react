import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import type { TimelineItemWithLane } from "@/types";
import { Edit2, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  item: TimelineItemWithLane;
  laneHeight: number;
  dateToPosition: (date: string) => number;
  positionToDate: (position: number) => string;
  isEditing: boolean;
  isDragging: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onNameChange: (newName: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrag: (itemId: number, newStartDate: string, newEndDate: string) => void;
  onMeasureWidth?: (itemId: number, minContentWidthPx: number) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  laneHeight,
  dateToPosition,
  positionToDate,
  isEditing,
  isDragging,
  onStartEdit,
  onEndEdit,
  onNameChange,
  onDragStart,
  onDragEnd,
  onDrag,
  onMeasureWidth,
}) => {
  const [editValue, setEditValue] = useState(item.name);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startX: number;
    initialLeft: number;
    initialWidth: number;
    resizeHandle: "left" | "right" | "move" | null;
  }>({
    isDragging: false,
    startX: 0,
    initialLeft: 0,
    initialWidth: 0,
    resizeHandle: null,
  });

  const itemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate position and dimensions
  const left = dateToPosition(item.startDate);
  // Render inclusive end by mapping the right edge to (endDate + 1 day)
  const endPlusOne = (() => {
    const d = new Date(item.endDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();
  const right = dateToPosition(endPlusOne);
  const width = Math.max(right - left, 80);
  const top = item.lane * laneHeight + 8;
  const height = laneHeight - 16;

  // Color scheme for different items
  const colorSchemes = [
    "bg-blue-100 border-blue-300 text-blue-900",
    "bg-emerald-100 border-emerald-300 text-emerald-900",
    "bg-purple-100 border-purple-300 text-purple-900",
    "bg-orange-100 border-orange-300 text-orange-900",
    "bg-pink-100 border-pink-300 text-pink-900",
    "bg-teal-100 border-teal-300 text-teal-900",
  ];
  const colorScheme = colorSchemes[item.id % colorSchemes.length];

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Measure natural content width so the parent can auto-zoom to avoid overlaps
  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const measure = () => {
      const minWidth = contentRef.current?.scrollWidth ?? 0;
      onMeasureWidth?.(item.id, minWidth + 24); // include a small padding
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [
    item.id,
    onMeasureWidth,
    editValue,
    item.name,
    item.startDate,
    item.endDate,
  ]);

  // Handle edit submission
  const handleEditSubmit = () => {
    onNameChange(editValue.trim() || item.name);
    onEndEdit();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setEditValue(item.name);
      onEndEdit();
    }
  };

  // Mouse drag handling
  const handleMouseDown = (
    e: React.MouseEvent,
    handle: "left" | "right" | "move"
  ) => {
    e.preventDefault();
    onDragStart();

    setDragState({
      isDragging: true,
      startX: e.clientX,
      initialLeft: left,
      initialWidth: width,
      resizeHandle: handle,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      const deltaX = e.clientX - dragState.startX;
      let newStartDate = item.startDate;
      let newEndDate = item.endDate;

      if (dragState.resizeHandle === "move") {
        // Move the entire item
        const newLeft = dragState.initialLeft + deltaX;
        newStartDate = positionToDate(newLeft);
        const itemDuration =
          new Date(item.endDate).getTime() - new Date(item.startDate).getTime();
        newEndDate = new Date(new Date(newStartDate).getTime() + itemDuration)
          .toISOString()
          .split("T")[0];
      } else if (dragState.resizeHandle === "left") {
        // Resize from the left (change start date)
        const newLeft = dragState.initialLeft + deltaX;
        newStartDate = positionToDate(newLeft);
        // Ensure start date is not after end date
        if (new Date(newStartDate) >= new Date(item.endDate)) {
          const dayBefore = new Date(item.endDate);
          dayBefore.setDate(dayBefore.getDate() - 1);
          newStartDate = dayBefore.toISOString().split("T")[0];
        }
      } else if (dragState.resizeHandle === "right") {
        // Resize from the right (change end date)
        const newRight =
          dragState.initialLeft + dragState.initialWidth + deltaX;
        // Right edge maps to (end + 1 day), so subtract one day when converting back
        const endExclusive = positionToDate(newRight);
        const endInclusive = new Date(endExclusive);
        endInclusive.setDate(endInclusive.getDate() - 1);
        newEndDate = endInclusive.toISOString().split("T")[0];
        // Ensure end date is not before start date
        if (new Date(newEndDate) <= new Date(item.startDate)) {
          const dayAfter = new Date(item.startDate);
          dayAfter.setDate(dayAfter.getDate() + 1);
          newEndDate = dayAfter.toISOString().split("T")[0];
        }
      }

      onDrag(item.id, newStartDate, newEndDate);
    };

    const handleMouseUp = () => {
      if (dragState.isDragging) {
        setDragState((prev) => ({ ...prev, isDragging: false }));
        onDragEnd();
      }
    };

    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, item, positionToDate, onDrag, onDragEnd]);

  return (
    <div
      ref={itemRef}
      className={cn(
        "absolute border-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer select-none",
        colorScheme,
        isDragging && "shadow-lg scale-105",
        dragState.isDragging && "z-10"
      )}
      style={{
        left,
        top,
        width,
        height,
      }}
    >
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/10 transition-colors"
        onMouseDown={(e) => handleMouseDown(e, "left")}
        title="Resize start date"
      />

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/10 transition-colors"
        onMouseDown={(e) => handleMouseDown(e, "right")}
        title="Resize end date"
      />

      {/* Main content area */}
      <div
        ref={contentRef}
        className="flex items-center h-full px-3 cursor-move"
        onMouseDown={(e) => handleMouseDown(e, "move")}
      >
        <GripHorizontal className="h-3 w-3 text-current/50 mr-2 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleEditKeyDown}
              className="w-full bg-transparent border-none outline-none text-sm font-medium"
            />
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium whitespace-normal break-words">
                {item.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit();
                }}
                className="ml-2 p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
                title="Edit name"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="text-xs opacity-75 mt-0.5 whitespace-nowrap">
            {item.startDate} to {item.endDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
