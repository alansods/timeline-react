import React from "react";

interface TimelineHeaderProps {
  minDate: Date;
  maxDate: Date;
  dateToPosition: (date: string) => number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  minDate,
  maxDate,
  dateToPosition,
}) => {
  // Generate date markers
  const generateDateMarkers = () => {
    const markers = [];
    const totalDays = Math.ceil(
      (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine the interval based on total days and zoom level
    let interval = 1; // days
    if (totalDays > 60) interval = 7; // weekly
    if (totalDays > 180) interval = 30; // monthly

    // Work in UTC to avoid timezone-induced off-by-one shifts
    const currentDate = new Date(
      Date.UTC(
        minDate.getUTCFullYear(),
        minDate.getUTCMonth(),
        minDate.getUTCDate()
      )
    );

    while (currentDate <= maxDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      const position = dateToPosition(dateString);

      // Format the date for display
      let displayDate = "";
      if (interval === 1) {
        displayDate = currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });
      } else if (interval === 7) {
        displayDate = currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });
      } else {
        displayDate = currentDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });
      }

      markers.push({
        date: dateString,
        position,
        displayDate,
        isMonth: currentDate.getDate() === 1,
      });

      // Move to next interval
      currentDate.setUTCDate(currentDate.getUTCDate() + interval);
    }

    return markers;
  };

  const markers = generateDateMarkers();

  return (
    <div className="sticky top-0 left-0 right-0 h-12 border-b border-gray-200 bg-white/95 backdrop-blur pointer-events-none z-50">
      {markers.map((marker, index) => (
        <div
          key={index}
          className="absolute flex flex-col items-center"
          style={{ left: marker.position }}
        >
          {/* Date label above the tick */}
          <span
            className={`text-xs text-gray-600 mb-1 whitespace-nowrap ${
              marker.isMonth ? "font-medium" : ""
            }`}
            style={{ transform: "translateX(-50%)" }}
          >
            {marker.displayDate}
          </span>

          {/* Date tick */}
          <div
            className={`w-px bg-gray-300 ${marker.isMonth ? "h-6" : "h-4"}`}
          />
        </div>
      ))}

      {/* Today indicator */}
      {(() => {
        const today = new Date().toISOString().split("T")[0];
        const todayDate = new Date(today);
        if (todayDate >= minDate && todayDate <= maxDate) {
          const position = dateToPosition(today);
          return (
            <div
              className="absolute top-0 bottom-0 border-l-2 border-red-500"
              style={{ left: position }}
            >
              <span
                className="absolute -top-5 text-xs font-medium text-red-600 whitespace-nowrap"
                style={{ transform: "translateX(-50%)" }}
              >
                Today
              </span>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default TimelineHeader;
