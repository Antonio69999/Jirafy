export type TaskStatus = "todo" | "in-progress" | "done";

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: "low" | "medium" | "high" | "urgent";
  labels?: string[];
  assignee?: {
    id: string; 
    name: string;
    avatar?: string;
    email?: string; 
  };
  dueDate?: string;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
