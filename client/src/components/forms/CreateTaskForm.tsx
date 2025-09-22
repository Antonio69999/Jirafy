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
import { useCreateIssue, useUpdateIssue } from "@/hooks/useIssue";
import { useProjects } from "@/hooks/useProject";
import { useAuthStore } from "@/store/authStore";
import type { Issue } from "@/types/issue";

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  priority: z.string(),
  dueDate: z.date().optional(),
  assignee: z.string().optional(),
  labels: z.array(z.string()).optional(),
  project: z.string().min(1, "Le projet est requis"),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  isEditing?: boolean;
  initialData?: Partial<TaskFormValues>;
  onClose?: () => void;
  onSuccess?: (issue: Issue) => void;
}

export default function CreateTaskForm({
  isEditing = false,
  initialData,
  onClose,
  onSuccess,
}: CreateTaskFormProps) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const { user } = useAuthStore();

  const { create, loading: createLoading, error: createError } = useCreateIssue();
  const { update, loading: updateLoading, error: updateError } = useUpdateIssue();
  const { data: projectsData } = useProjects({ per_page: 50 });

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  const defaultValues: Partial<TaskFormValues> = {
    title: "",
    description: "",
    priority: "medium",
    assignee: undefined,
    labels: [],
    project: initialData?.project || "",
  };

  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    initialData?.labels || []
  );
  const [selectedAssignee, setSelectedAssignee] = useState<
    { id: string; name: string; avatar?: string } | undefined
  >();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  });

  // Mock data - à remplacer par de vrais appels API
  const availableLabels = [
    { id: "bug", name: "Bug", color: "red" },
    { id: "feature", name: "Feature", color: "green" },
    { id: "enhancement", name: "Enhancement", color: "blue" },
    { id: "documentation", name: "Documentation", color: "purple" },
    { id: "design", name: "Design", color: "pink" },
    { id: "testing", name: "Testing", color: "yellow" },
  ];

  const availableUsers = [
    { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "3", name: "David Miller", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "4", name: "Emma Johnson", avatar: "https://i.pravatar.cc/150?img=4" },
  ];

  // Mock data pour les types d'issues, statuts et priorités
  const issueTypes = [
    { id: 1, name: "Bug", key: "BUG" },
    { id: 2, name: "Feature", key: "FEATURE" },
    { id: 3, name: "Task", key: "TASK" },
    { id: 4, name: "Story", key: "STORY" },
  ];

  const issueStatuses = [
    { id: 1, name: "To Do", key: "TODO" },
    { id: 2, name: "In Progress", key: "IN_PROGRESS" },
    { id: 3, name: "Done", key: "DONE" },
  ];

  const issuePriorities = [
    { id: 1, name: "Low", key: "LOW", weight: 1 },
    { id: 2, name: "Medium", key: "MEDIUM", weight: 2 },
    { id: 3, name: "High", key: "HIGH", weight: 3 },
    { id: 4, name: "Urgent", key: "URGENT", weight: 4 },
  ];

  async function onSubmit(data: TaskFormValues) {
    if (!user) {
      toast.error("Vous devez être connecté pour créer une tâche");
      return;
    }

    try {
      // Mapper les données du formulaire vers le format API
      const priority = issuePriorities.find(p => p.key.toLowerCase() === data.priority.toLowerCase());
      const issueType = issueTypes.find(t => t.key === "TASK"); // Par défaut
      const status = issueStatuses.find(s => s.key === "TODO"); // Par défaut

      const issueData = {
        project_id: parseInt(data.project),
        type_id: issueType?.id || 3,
        status_id: status?.id || 1,
        priority_id: priority?.id || 2,
        reporter_id: user.id,
        assignee_id: data.assignee ? parseInt(data.assignee) : undefined,
        title: data.title,
        description: data.description || null,
        story_points: null,
        due_date: data.dueDate ? data.dueDate.toISOString().split('T')[0] : null,
      };

      let result: Issue | null = null;

      if (isEditing) {
        // Pour l'édition, il faudrait passer l'ID de l'issue
        // result = await update(issueId, issueData);
        toast.info("Édition d'issue pas encore implémentée");
        return;
      } else {
        result = await create(issueData);
      }

      if (result) {
        toast.success(
          isEditing
            ? t("dashboard.editTask.success") || "Tâche mise à jour avec succès"
            : t("dashboard.addTask.success") || "Tâche créée avec succès"
        );

        form.reset();
        setSelectedLabels([]);
        setSelectedAssignee(undefined);

        if (onSuccess) {
          onSuccess(result);
        }

        if (onClose) {
          onClose();
        }
      }
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const handleLabelsChange = (labels: string[]) => {
    setSelectedLabels(labels);
    form.setValue("labels", labels);
  };

  const handleAssigneeChange = (
    users: { id: string; name: string; avatar?: string }[]
  ) => {
    const assignee = users[0]; // Prendre seulement le premier utilisateur
    setSelectedAssignee(assignee);
    form.setValue("assignee", assignee?.id || undefined);
  };

  // Afficher les erreurs du serveur
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dashboard.addTask.title") || "Titre"} *</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    t("dashboard.addTask.titlePlaceholder") ||
                    "Que faut-il faire ?"
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
                    "Décrivez la tâche ici"
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
                  {t("dashboard.addTask.project") || "Projet"} *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        `theme-${colorTheme}`,
                        "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
                      )}
                    >
                      <SelectValue
                        placeholder={
                          t("dashboard.addTask.selectProject") ||
                          "Sélectionner un projet"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectsData?.data?.map((project) => (
                      <SelectItem key={project.id} value={String(project.id)}>
                        [{project.key}] {project.name}
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
                  {t("dashboard.addTask.priorities.title") || "Priorité"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        `theme-${colorTheme}`,
                        "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
                      )}
                    >
                      <SelectValue
                        placeholder={
                          t("dashboard.addTask.selectPriority") ||
                          "Sélectionner une priorité"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">
                      {t("dashboard.addTask.priorities.low") || "Basse"}
                    </SelectItem>
                    <SelectItem value="medium">
                      {t("dashboard.addTask.priorities.medium") || "Moyenne"}
                    </SelectItem>
                    <SelectItem value="high">
                      {t("dashboard.addTask.priorities.high") || "Haute"}
                    </SelectItem>
                    <SelectItem value="urgent">
                      {t("dashboard.addTask.priorities.urgent") || "Urgente"}
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
              label={t("dashboard.addTask.dueDate") || "Date d'échéance"}
              placeholder={t("dashboard.addTask.pickDate") || "Choisir une date"}
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
              label={t("dashboard.addTask.labels") || "Étiquettes"}
              error={form.formState.errors.labels?.message}
            />
          )}
        />

        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <UserSelector
              selectedUsers={selectedAssignee ? [selectedAssignee] : []}
              onUsersChange={handleAssigneeChange}
              availableUsers={availableUsers}
              label={t("dashboard.addTask.assignee") || "Assigné à"}
              error={form.formState.errors.assignee?.message}
              maxUsers={1} // Limiter à un seul utilisateur pour l'assigné
            />
          )}
        />

        <div className="flex justify-end gap-2">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {t("dashboard.addTask.cancel") || "Annuler"}
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={loading}
            className={cn(
              `theme-${colorTheme}`,
              "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
            )}
          >
            {loading
              ? isEditing
                ? t("dashboard.editTask.updating") || "Mise à jour..."
                : t("dashboard.addTask.creating") || "Création..."
              : isEditing
              ? t("dashboard.editTask.submit") || "Mettre à jour"
              : t("dashboard.addTask.submit") || "Créer la tâche"}
          </Button>
        </div>
      </form>
    </Form>
  );
}