import React, { useState, useEffect } from "react";
import { getMonthDays } from "../utils/dateUtils";
import { DayCell } from "./DayCell";
import { TaskModal } from "./TaskModal";
import { FiltersPanel } from "./FiltersPanel";
import { v4 as uuid } from "uuid";
import type { Task, TaskCategory } from "../types/task";
import { addDays } from "date-fns";

const categories: TaskCategory[] = ["To Do", "In Progress", "Review", "Completed"];

export const Calendar: React.FC = () => {
  const [currentDate] = useState(new Date());
  const days = getMonthDays(currentDate);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<TaskCategory[]>(categories);
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);

  const [resizing, setResizing] = useState<{ taskId: string; edge: "start" | "end" } | null>(null);

  const [dragTask, setDragTask] = useState<Task | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTasks(parsed.map((t: Task) => ({ ...t, start: new Date(t.start), end: new Date(t.end) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSaveTask = (task: Omit<Task, "id">) => {
    setTasks((prev) => [
      ...prev,
      { ...task, id: uuid(), start: new Date(task.start), end: new Date(task.end) },
    ]);
  };

  const getRange = () => {
    if (!dragStart || !dragEnd) return null;
    const start = dragStart < dragEnd ? dragStart : dragEnd;
    const end = dragStart < dragEnd ? dragEnd : dragStart;
    return { start, end };
  };
  const finalRange = getRange();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!resizing) return;
      const target = (e.target as HTMLElement).closest("[data-date]") as HTMLElement | null;
      if (!target) return;
      const dateStr = target.getAttribute("data-date");
      if (!dateStr) return;
      const date = new Date(dateStr);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === resizing.taskId
            ? {
              ...t,
              start: resizing.edge === "start" ? date : t.start,
              end: resizing.edge === "end" ? date : t.end,
            }
            : t
        )
      );
    };
    const stop = () => setResizing(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stop);
    };
  }, [resizing]);

  const handleDropTask = (date: Date) => {
    if (!dragTask) return;
    const duration =
      (dragTask.end.getTime() - dragTask.start.getTime()) / (1000 * 60 * 60 * 24);
    const newStart = date;
    const newEnd = addDays(newStart, duration);
    setTasks((prev) =>
      prev.map((t) => (t.id === dragTask.id ? { ...t, start: newStart, end: newEnd } : t))
    );
    setDragTask(null);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesCategory = selectedCategories.includes(t.category);
    const matchesName = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesTime = true;

    if (durationFilter) {
      const today = new Date();
      const endDate = addDays(today, durationFilter * 7);
      matchesTime = t.start >= today && t.start <= endDate;
    }

    return matchesCategory && matchesName && matchesTime;
  });

  return (
    <div className="p-4">
      <FiltersPanel
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={(c) =>
          setSelectedCategories((prev) =>
            prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
          )
        }
        durationFilter={durationFilter}
        setDurationFilter={setDurationFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategories={setSelectedCategories}
      />

      <div
        className="grid grid-cols-7 gap-1 select-none"
        onMouseUp={() => {
          if (finalRange) {
            setRange(finalRange);
            setModalOpen(true);
          }
          setIsDragging(false);
        }}
      >
        {days.map((d) => (
          <DayCell
            key={d.toISOString()}
            date={d}
            tasks={filteredTasks.filter((t) => {
              const day = new Date(d).setHours(0, 0, 0, 0);
              const start = new Date(t.start).setHours(0, 0, 0, 0);
              const end = new Date(t.end).setHours(0, 0, 0, 0);
              return day >= start && day <= end;
            })}
            isSelected={!!(
              isDragging && finalRange && d >= finalRange.start && d <= finalRange.end
            )}
            onMouseDown={() => {
              setIsDragging(true);
              setDragStart(d);
              setDragEnd(d);
            }}
            onMouseEnter={() => {
              if (isDragging) setDragEnd(d);
            }}
            onResizeStart={(task, edge) => setResizing({ taskId: task.id, edge })}
            onTaskDragStart={(task) => setDragTask(task)}
            onTaskDrop={() => handleDropTask(d)}
          />
        ))}
      </div>

      {range && (
        <TaskModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTask}
          start={range.start}
          end={range.end}
        />
      )}
    </div>
  );
};