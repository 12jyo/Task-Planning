import React from "react";
import type { Task } from "../types/task";

const categoryColors: Record<Task["category"], string> = {
  "To Do": "bg-blue-500",
  "In Progress": "bg-yellow-500",
  "Review": "bg-purple-500",
  "Completed": "bg-green-500",
};

interface TaskBarProps {
  task: Task;
  onResizeStart: (task: Task, edge: "start" | "end") => void;
  onDragStart: (task: Task) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({ task, onResizeStart, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      className={`relative text-xs text-white px-2 py-1 rounded cursor-move ${categoryColors[task.category]}`}
      title={`${task.name} (${task.start.toDateString()} → ${task.end.toDateString()})`}
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize bg-black/20"
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeStart(task, "start");
        }}
      />
      {task.name}
      <span
        className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize bg-black/20"
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeStart(task, "end");
        }}
      />
    </div>
  );
};