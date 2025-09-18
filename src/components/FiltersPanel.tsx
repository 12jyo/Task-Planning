import React from "react";
import type { TaskCategory } from "../types/task";

interface FiltersPanelProps {
  categories: TaskCategory[];
  selectedCategories: TaskCategory[];
  onCategoryChange: (category: TaskCategory) => void;

  durationFilter: number | null;
  setDurationFilter: (weeks: number | null) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  setSelectedCategories: (cats: TaskCategory[]) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  durationFilter,
  setDurationFilter,
  searchQuery,
  setSearchQuery,
  setSelectedCategories,
}) => {
  const handleClear = () => {
    setSelectedCategories(categories);
    setDurationFilter(null);
    setSearchQuery("");
  };

  return (
    <>
      <div className="p-2 mb-[1rem] flex justify-between mb-4">
        <div className="flex gap-4">
          {categories.map((c) => (
            <label key={c} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c)}
                onChange={() => onCategoryChange(c)}
              />
              {c}
            </label>
          ))}
        </div>

        <div className="flex gap-4">
          {[1, 2, 3].map((w) => (
            <label key={w} className="flex items-center gap-1">
              <input
                type="radio"
                name="duration"
                checked={durationFilter === w}
                onChange={() => setDurationFilter(w)}
              />
              Tasks within {w} week{w > 1 ? "s" : ""}
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-1"
          style={{
            marginRight: "38px",
            height: "1.5rem",
            borderRadius: "18px",
            padding: "2px 13px"
          }}

        />
      </div>

      <button
        type="button"
        className="ml-2 text-sm underline"
        onClick={handleClear}
        style={{
          marginLeft: "50%",
          padding: "5px",
          width: "9rem",
          borderRadius: "15px",
          border: "1px solid",
          textDecoration: "none",
          marginBottom: "1rem"
        }}
      >
        Clear Filters
      </button>
    </>
  );
};