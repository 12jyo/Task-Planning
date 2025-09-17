export type TaskCategory = "To Do" | "In Progress" | "Review" | "Completed";

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  start: Date;
  end: Date;
}