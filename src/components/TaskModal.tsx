import React, { useState } from "react";
import type { Task, TaskCategory } from "../types/task";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  start: Date;
  end: Date;
}

const categories: TaskCategory[] = ["To Do", "In Progress", "Review", "Completed"];

export const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, start, end }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TaskCategory>("To Do");
  const [startDate, setStartDate] = useState(start.toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(end.toISOString().slice(0, 10));

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold mb-2">New Task</h2>

        <input
          type="text"
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <div>


          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="border p-2 w-full mb-2"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex gap-2 mb-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 w-1/2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 w-1/2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button
              onClick={() => {
                if (name.trim()) {
                  onSave({
                    name,
                    category,
                    start: new Date(startDate),
                    end: new Date(endDate),
                  });
                  onClose();
                }
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};