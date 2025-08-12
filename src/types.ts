export interface TimelineBaseItem {
  id: number;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface TimelineItemWithLane extends TimelineBaseItem {
  lane: number;
}
