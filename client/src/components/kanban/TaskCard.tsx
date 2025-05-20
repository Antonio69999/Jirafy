import { cn } from "@/lib/utils";
import { type Task } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MessageSquare } from "lucide-react";

interface TaskCardProps {
  task: Task;
  colorTheme: string;
  getPriorityClass: (priority?: string) => string;
}

export function TaskCard({
  task,
  colorTheme,
  getPriorityClass,
}: TaskCardProps) {
  // Function to get initials from a name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get label color based on label name
  const getLabelClass = (label: string) => {
    switch (label.toLowerCase()) {
      case "bug":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "feature":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "enhancement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "documentation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "design":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      case "testing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "database":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "security":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "devops":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
    }
  };

  return (
    <div
      className={cn(
        "bg-background mb-2 p-3 rounded-md border shadow-sm",
        `theme-${colorTheme}`,
        "hover:border-[var(--hover-border)]"
      )}
    >
      {/* Header with priority indicator and title */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              getPriorityClass(task.priority)
            )}
            title={`Priority: ${task.priority}`}
          />
          <h4 className="font-medium text-sm">{task.title}</h4>
        </div>

        {/* Task ID or reference */}
        <div className="text-xs text-muted-foreground">
          #{task.id.split("-")[1]}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
      )}

      {/* Task image if available */}
      {task.image && (
        <div className="mb-3 rounded-md overflow-hidden">
          <img
            src={task.image}
            alt="Task attachment"
            className="w-full h-auto object-cover"
            style={{ maxHeight: "120px" }}
          />
        </div>
      )}

      {/* Footer with metadata */}
      <div className="mt-2 flex flex-col gap-2">
        {/* Labels if available */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label, index) => (
              <span
                key={index}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  getLabelClass(label)
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Task metadata and assignees */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {task.comments && (
              <div
                className="flex items-center mr-2"
                title={`${task.comments} comments`}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                {task.comments}
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center" title={`Due: ${task.dueDate}`}>
                <Clock className="h-3 w-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee, index) => (
                <Avatar
                  key={index}
                  className="h-5 w-5 border-2 border-background"
                >
                  <AvatarImage src={assignee.avatar} alt={assignee.name} />
                  <AvatarFallback className="text-[8px]">
                    {getInitials(assignee.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 3 && (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-medium border-2 border-background">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Single assignee */}
          {task.assignee && !task.assignees && (
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={task.assignee.avatar}
                alt={task.assignee.name}
              />
              <AvatarFallback className="text-[8px]">
                {getInitials(task.assignee.name)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
