import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { assignLanes, getTotalLanes, getDateRange } from "../assignLanes";
import type { TimelineBaseItem, TimelineItemWithLane } from "@/types";
import TimelineItem from "./TimelineItem.tsx";
import TimelineHeader from "./TimelineHeader.tsx";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface TimelineProps {
  items: TimelineBaseItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [minZoomForContent, setMinZoomForContent] = useState(1);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [timelineItems, setTimelineItems] = useState(items);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Assign lanes to items for compact layout
  const itemsWithLanes: TimelineItemWithLane[] = useMemo(() => {
    return assignLanes(timelineItems as TimelineBaseItem[]);
  }, [timelineItems]);

  // Calculate timeline dimensions
  const { minDate, maxDate } = useMemo(
    () => getDateRange(itemsWithLanes),
    [itemsWithLanes]
  );
  const totalLanes = useMemo(
    () => getTotalLanes(itemsWithLanes),
    [itemsWithLanes]
  );
  const totalDays = useMemo(() => {
    const diffTime = maxDate.getTime() - minDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [minDate, maxDate]);
  // Span in days between min and max when mapping positions (exclusive end for mapping)
  const spanDays = useMemo(() => Math.max(totalDays - 1, 1), [totalDays]);

  // Measure available width from the scroll wrapper so the timeline uses the full space
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const update = () => setContainerWidth(wrapper.clientWidth || 800);
    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(wrapper);
    return () => resizeObserver.disconnect();
  }, []);

  // Timeline dimensions
  // Ensure zoom respects content requirements
  const effectiveZoom = Math.max(zoomLevel, minZoomForContent);
  const timelineWidth = Math.max(containerWidth, 600) * effectiveZoom;
  const laneHeight = 60;
  const timelineHeight = totalLanes * laneHeight;
  // Extra space below the header so date labels are never obscured by items
  // Increased to avoid clipping the top corners/shadows of the first-lane cards
  const headerGutterPx = 36; // extra gap below header
  const headerHeightPx = 48; // matches h-12 on header
  const bottomPaddingPx = 24; // breathing room at the bottom

  // Helper functions
  const dateToPosition = useCallback(
    (date: string) => {
      // Parse as UTC midnight to avoid timezone shifts
      const [y, m, d] = date.split("-").map((x) => parseInt(x, 10));
      const targetTime = Date.UTC(y, (m || 1) - 1, d || 1);
      const minUtc = Date.UTC(
        minDate.getUTCFullYear(),
        minDate.getUTCMonth(),
        minDate.getUTCDate()
      );
      const diffDays = (targetTime - minUtc) / (1000 * 60 * 60 * 24);
      const denom = spanDays || 1;
      return (diffDays / denom) * timelineWidth;
    },
    [minDate, spanDays, timelineWidth]
  );

  const positionToDate = useCallback(
    (position: number) => {
      const ratio = position / timelineWidth;
      const denom = spanDays || 1;
      const diffDays = ratio * denom;
      const minUtc = Date.UTC(
        minDate.getUTCFullYear(),
        minDate.getUTCMonth(),
        minDate.getUTCDate()
      );
      const targetTime = minUtc + diffDays * 24 * 60 * 60 * 1000;
      const d = new Date(targetTime);
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
    [timelineWidth, spanDays, minDate]
  );

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setMinZoomForContent(1);
  };

  // Collect min content width per item to auto-adjust zoom so items don't overlap after min-content enforcement
  const minContentWidthsRef = useRef<Map<number, number>>(new Map());
  const handleMeasureWidth = useCallback(
    (itemId: number, minContentWidthPx: number) => {
      const prev = minContentWidthsRef.current.get(itemId) || 0;
      if (prev === minContentWidthPx) return;
      minContentWidthsRef.current.set(itemId, minContentWidthPx);

      // Compute required zoom so that the pixel width for each item duration >= min content width
      const requiredZooms: number[] = [];
      for (const item of itemsWithLanes) {
        const minWidth = minContentWidthsRef.current.get(item.id) || 0;
        if (minWidth <= 0) continue;
        const days =
          (new Date(item.endDate).getTime() -
            new Date(item.startDate).getTime()) /
          (1000 * 60 * 60 * 24);
        const daysSpan = Math.max(days, 1);
        const pxPerDayAtZoom1 =
          Math.max(containerWidth, 600) / Math.max(spanDays, 1);
        const widthAtZoom1 = pxPerDayAtZoom1 * daysSpan;
        const neededZoom = widthAtZoom1 > 0 ? minWidth / widthAtZoom1 : 1;
        if (neededZoom > 1) requiredZooms.push(neededZoom);
      }
      const newMinZoom = requiredZooms.length
        ? Math.min(Math.max(...requiredZooms), 5)
        : 1;
      setMinZoomForContent((z) =>
        Math.abs(z - newMinZoom) > 0.001 ? newMinZoom : z
      );
    },
    [itemsWithLanes, containerWidth, totalDays]
  );

  // Item editing
  const handleItemNameChange = (itemId: number, newName: string) => {
    setTimelineItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, name: newName } : item
      )
    );
  };

  // Drag and drop for date changes
  const handleItemDrag = (
    itemId: number,
    newStartDate: string,
    newEndDate: string
  ) => {
    setTimelineItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, startDate: newStartDate, endDate: newEndDate }
          : item
      )
    );
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Zoom:</span>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-sm min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {totalLanes} lanes • {totalDays} days • {itemsWithLanes.length} items
        </div>
      </div>

      {/* Timeline Container */}
      <div
        ref={wrapperRef}
        className="border border-gray-200 rounded-lg overflow-x-auto overflow-y-hidden bg-white"
      >
        <div
          ref={timelineRef}
          className="relative"
          style={{
            width: Math.max(timelineWidth, 600),
            height:
              headerHeightPx +
              headerGutterPx +
              timelineHeight +
              bottomPaddingPx,
          }}
        >
          {/* Timeline Header */}
          <TimelineHeader
            minDate={minDate}
            maxDate={maxDate}
            dateToPosition={dateToPosition}
          />

          {/* Timeline Items */}
          <div className="relative" style={{ marginTop: headerGutterPx }}>
            {/* Lane separators */}
            {Array.from({ length: totalLanes }, (_, i) => (
              <div
                key={i}
                className="absolute border-b border-gray-200"
                style={{
                  top: i * laneHeight,
                  left: 0,
                  right: 0,
                  height: laneHeight,
                }}
              />
            ))}

            {/* Items */}
            {itemsWithLanes.map((item: TimelineItemWithLane) => (
              <TimelineItem
                key={item.id}
                item={item}
                laneHeight={laneHeight}
                dateToPosition={dateToPosition}
                positionToDate={positionToDate}
                isEditing={editingItem === item.id}
                isDragging={draggedItem === item.id}
                onStartEdit={() => setEditingItem(item.id)}
                onEndEdit={() => setEditingItem(null)}
                onNameChange={(newName: string) =>
                  handleItemNameChange(item.id, newName)
                }
                onDragStart={() => setDraggedItem(item.id)}
                onDragEnd={() => setDraggedItem(null)}
                onDrag={handleItemDrag}
                onMeasureWidth={handleMeasureWidth}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click on an item name to edit it inline</li>
          <li>• Drag items horizontally to change their dates</li>
          <li>• Use zoom controls to adjust the timeline scale</li>
          <li>• Items are automatically arranged in compact lanes</li>
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
