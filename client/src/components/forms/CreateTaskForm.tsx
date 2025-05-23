import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
import { DatePickerField } from "@/components/forms/DatePickerField";
import { LabelSelector } from "@/components/selectors/LabelSelector";
import { UserSelector } from "@/components/selectors/UserSelector";

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

  const handleLabelsChange = (labels: string[]) => {
    setSelectedLabels(labels);
    form.setValue("labels", labels);
  };

  const handleAssigneesChange = (
    users: { id: string; name: string; avatar?: string }[]
  ) => {
    setSelectedAssignees(users);
    form.setValue(
      "assignees",
      users.map((u) => u.id)
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
                    `theme-${colorTheme}`,
                    "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)] hover:border-[var(--hover-border)]"
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
                    `theme-${colorTheme}`,
                    "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)] hover:border-[var(--hover-border)]"
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
            <DatePickerField
              value={field.value}
              onChange={field.onChange}
              label={t("dashboard.addTask.dueDate") || "Due Date"}
              placeholder={t("dashboard.addTask.pickDate") || "Pick a date"}
              error={form.formState.errors.dueDate?.message}
            />
          )}
        />

        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <LabelSelector
              selectedLabels={selectedLabels}
              onLabelsChange={handleLabelsChange}
              availableLabels={availableLabels}
              label={t("dashboard.addTask.labels") || "Labels"}
              error={form.formState.errors.labels?.message}
            />
          )}
        />

        <FormField
          control={form.control}
          name="assignees"
          render={({ field }) => (
            <UserSelector
              selectedUsers={selectedAssignees}
              onUsersChange={handleAssigneesChange}
              availableUsers={availableUsers}
              label={t("dashboard.addTask.assignees") || "Assignees"}
              error={form.formState.errors.assignees?.message}
            />
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
