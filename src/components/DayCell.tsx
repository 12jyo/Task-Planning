import React from "react";
import { formatDay } from "../utils/dateUtils";
import type { Task } from "../types/task";
import { TaskBar } from "./TaskBar";

interface DayCellProps {
  date: Date;
  tasks: Task[];
  isSelected?: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onResizeStart: (task: Task, edge: "start" | "end") => void;
  onTaskDragStart: (task: Task) => void;
  onTaskDrop: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  tasks,
  isSelected = false,
  onMouseDown,
  onMouseEnter,
  onResizeStart,
  onTaskDragStart,
  onTaskDrop,
}) => {
  return (
    <div
      data-date={date.toISOString()}
      className={`border h-[7rem] p-1 relative pt-[12px] pl-[12px]`}
      style={{ backgroundColor: isSelected ? "#dbeafe" : undefined, borderColor: "#e8f4ff" }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onTaskDrop}
    >
      <div className="text-[24px] font-semibold">{formatDay(date)}</div>

      <div className="absolute bottom-1 left-1 right-1 space-y-1">
        {tasks.map((t) => (
          <TaskBar
            key={t.id}
            task={t}
            onResizeStart={onResizeStart}
            onDragStart={onTaskDragStart}
          />
        ))}
      </div>
    </div>
  );
};