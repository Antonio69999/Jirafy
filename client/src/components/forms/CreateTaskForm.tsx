import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CalendarIcon, Tag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  priority: z.string(),
  dueDate: z.date().optional(),
  assignees: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  project: z.string(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  isEditing?: boolean;
  initialData?: TaskFormValues;
  onClose?: () => void;
}

export default function CreateTaskForm({
  isEditing = false,
  initialData,
  onClose,
}: CreateTaskFormProps) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  const defaultValues: Partial<TaskFormValues> = {
    title: "",
    description: "",
    priority: "medium",
    assignees: [],
    labels: [],
  };

  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    initialData?.labels || []
  );
  const [selectedAssignees, setSelectedAssignees] = useState<
    { id: string; name: string; avatar?: string }[]
  >([]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Quand le formulaire est utilisé pour l'édition, nous devons récupérer les assignés
  useEffect(() => {
    if (isEditing && initialData?.assignees?.length) {
      // Ici, on supposerait normalement récupérer les infos complètes des utilisateurs depuis une API
      // Simulation pour l'exemple:
      const assigneeDetails = initialData.assignees.map((id) => {
        const found = availableUsers.find((u) => u.id === id);
        return found || { id, name: `User ${id}`, avatar: undefined };
      });

      setSelectedAssignees(assigneeDetails);
    }
  }, [isEditing, initialData]);

  // Similaire pour les labels pré-sélectionnés
  useEffect(() => {
    if (initialData?.labels) {
      setSelectedLabels(initialData.labels);
    }
  }, [initialData]);

  function onSubmit(data: TaskFormValues) {
    toast.success(
      isEditing
        ? t("dashboard.editTask.success") || "Task updated successfully"
        : t("dashboard.addTask.success") || "Task created successfully"
    );
    console.log(data);
    form.reset();
    setSelectedLabels([]);
    setSelectedAssignees([]);
    if (onClose) onClose();
  }

  const availableLabels = [
    { id: "bug", name: "Bug", color: "red" },
    { id: "feature", name: "Feature", color: "green" },
    { id: "enhancement", name: "Enhancement", color: "blue" },
    { id: "documentation", name: "Documentation", color: "purple" },
    { id: "design", name: "Design", color: "pink" },
    { id: "testing", name: "Testing", color: "yellow" },
    { id: "database", name: "Database", color: "indigo" },
    { id: "security", name: "Security", color: "red" },
    { id: "devops", name: "DevOps", color: "orange" },
  ];

  const availableProjects = [
    { id: "1", name: "Project Example" },
    { id: "2", name: "Mobile App" },
    { id: "3", name: "Website Redesign" },
  ];

  const availableUsers = [
    { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    {
      id: "3",
      name: "David Miller",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "4",
      name: "Emma Johnson",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  ];

  const addLabel = (labelId: string) => {
    if (!selectedLabels.includes(labelId)) {
      setSelectedLabels([...selectedLabels, labelId]);
      form.setValue("labels", [...selectedLabels, labelId]);
    }
  };

  const removeLabel = (labelId: string) => {
    const updated = selectedLabels.filter((id) => id !== labelId);
    setSelectedLabels(updated);
    form.setValue("labels", updated);
  };

  const addAssignee = (user: { id: string; name: string; avatar?: string }) => {
    if (!selectedAssignees.find((u) => u.id === user.id)) {
      const updated = [...selectedAssignees, user];
      setSelectedAssignees(updated);
      form.setValue(
        "assignees",
        updated.map((u) => u.id)
      );
    }
  };

  const removeAssignee = (userId: string) => {
    const updated = selectedAssignees.filter((user) => user.id !== userId);
    setSelectedAssignees(updated);
    form.setValue(
      "assignees",
      updated.map((u) => u.id)
    );
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getLabelClass = (labelId: string) => {
    const label = availableLabels.find((l) => l.id === labelId);
    if (!label) return "";

    return (
      {
        red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        green:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        purple:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
        yellow:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        indigo:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
        orange:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      }[label.color] || ""
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dashboard.addTask.title") || "Title"}</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    t("dashboard.addTask.titlePlaceholder") ||
                    "Enter task title"
                  }
                  className={cn(
                    `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)]`
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("dashboard.addTask.description") || "Description"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    t("dashboard.addTask.descriptionPlaceholder") ||
                    "Enter task description"
                  }
                  className={cn(
                    "min-h-[100px]",
                    `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)]`
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("dashboard.addTask.project") || "Project"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)]`
                      )}
                    >
                      <SelectValue
                        placeholder={
                          t("dashboard.addTask.selectProject") ||
                          "Select a project"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("dashboard.addTask.priorities.title") || "Priority"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          t("dashboard.addTask.selectPriority") ||
                          "Select priority"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">
                      {t("dashboard.addTask.priorities.low") || "Low"}
                    </SelectItem>
                    <SelectItem value="medium">
                      {t("dashboard.addTask.priorities.medium") || "Medium"}
                    </SelectItem>
                    <SelectItem value="high">
                      {t("dashboard.addTask.priorities.high") || "High"}
                    </SelectItem>
                    <SelectItem value="urgent">
                      {t("dashboard.addTask.priorities.urgent") || "Urgent"}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                {t("dashboard.addTask.dueDate") || "Due Date"}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button" // Ajout explicite pour empêcher la soumission du formulaire
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                        `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)] hover:border-[var(--hover-border)]`
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>
                          {t("dashboard.addTask.pickDate") || "Pick a date"}
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className={cn(`theme-${colorTheme}`)}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dashboard.addTask.labels") || "Labels"}</FormLabel>
              <div className="mb-2">
                {selectedLabels.map((labelId) => {
                  const label = availableLabels.find((l) => l.id === labelId);
                  return (
                    <Badge
                      key={labelId}
                      className={cn("mr-1 mb-1", getLabelClass(labelId))}
                      onClick={() => removeLabel(labelId)}
                    >
                      {label?.name}
                      <span className="ml-1 cursor-pointer">×</span>
                    </Badge>
                  );
                })}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                        `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)] hover:border-[var(--hover-border)]`
                      )}
                    >
                      <span>
                        {t("dashboard.addTask.addLabels") || "Add labels"}
                      </span>
                      <Tag className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 z-50">
                  <div className="p-2">
                    {availableLabels.map((label) => (
                      <div
                        key={label.id}
                        className={cn(
                          "flex items-center p-2 rounded-md cursor-pointer hover:bg-muted",
                          selectedLabels.includes(label.id) && "bg-muted"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          addLabel(label.id);
                        }}
                      >
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mr-2",
                            `bg-${label.color}-500`
                          )}
                        />
                        <span>{label.name}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("dashboard.addTask.assignees") || "Assignees"}
              </FormLabel>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedAssignees.map((user) => (
                  <Badge
                    key={user.id}
                    variant="outline"
                    className="p-1 pl-1 pr-2 flex items-center gap-1 bg-background"
                    onClick={() => removeAssignee(user.id)}
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-[8px]">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                    <span className="ml-1 cursor-pointer">×</span>
                  </Badge>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                        `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)] hover:border-[var(--hover-border)]`
                      )}
                    >
                      <span>
                        {t("dashboard.addTask.addAssignees") || "Add assignees"}
                      </span>
                      <User className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 z-50">
                  <div className="p-2">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className={cn(
                          "flex items-center p-2 rounded-md cursor-pointer hover:bg-muted",
                          selectedAssignees.some((u) => u.id === user.id) &&
                            "bg-muted"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          addAssignee(user);
                        }}
                      >
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {isEditing && onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              {t("dashboard.editTask.cancel") || "Cancel"}
            </Button>
          )}
          <Button type="submit" className={cn(`theme-${colorTheme}`)}>
            {isEditing
              ? t("dashboard.editTask.submit") || "Update Task"
              : t("dashboard.addTask.submit") || "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
