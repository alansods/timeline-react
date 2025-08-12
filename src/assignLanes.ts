import type { TimelineBaseItem, TimelineItemWithLane } from "@/types";

export function assignLanes(items: TimelineBaseItem[]): TimelineItemWithLane[] {
  const sortedItems = [...items].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const lanes: TimelineItemWithLane[][] = [];
  const result: TimelineItemWithLane[] = [];

  for (const item of sortedItems) {
    const itemStart = new Date(item.startDate);
    const itemEnd = new Date(item.endDate);

    let assignedLane = -1;

    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      const lastItemInLane = lane[lane.length - 1];
      const lastItemEnd = new Date(lastItemInLane.endDate);

      const buffer = 1000 * 60 * 60 * 24; // 1 day
      if (itemStart.getTime() >= lastItemEnd.getTime() + buffer) {
        assignedLane = i;
        break;
      }
    }

    if (assignedLane === -1) {
      assignedLane = lanes.length;
      lanes.push([]);
    }

    const itemWithLane: TimelineItemWithLane = { ...item, lane: assignedLane };
    lanes[assignedLane].push(itemWithLane);
    result.push(itemWithLane);
  }

  return result;
}

export function getTotalLanes(items: TimelineItemWithLane[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map((item) => item.lane)) + 1;
}

export function getDateRange(items: TimelineBaseItem[]): {
  minDate: Date;
  maxDate: Date;
} {
  if (items.length === 0) {
    const now = new Date();
    return { minDate: now, maxDate: now };
  }

  const dates = items.flatMap((item) => [
    new Date(item.startDate),
    new Date(item.endDate),
  ]);

  return {
    minDate: new Date(Math.min(...dates.map((d) => d.getTime()))),
    maxDate: new Date(Math.max(...dates.map((d) => d.getTime()))),
  };
}


