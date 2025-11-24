import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { cn } from "@/lib/utils";
import { useCreateProject, useUpdateProject } from "@/hooks/useProject";
import { useTeamOptions } from "@/hooks/useTeamOptions"; //  NOUVEAU
import { useUserOptions } from "@/hooks/useUserOptions"; //  NOUVEAU
import type { ProjectCreate, Project } from "@/types/project";

const projectFormSchema = z.object({
  key: z
    .string()
    .min(2, "La clé doit contenir au moins 2 caractères")
    .max(10, "La clé ne peut pas dépasser 10 caractères")
    .regex(
      /^[A-Z0-9-]+$/,
      "La clé doit être en MAJUSCULES, alphanumérique et tirets uniquement"
    ),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  team_id: z.number().optional(),
  lead_user_id: z.number().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectCreationFormProps {
  isEditing?: boolean;
  initialData?: Project;
  onSuccess?: (project: Project) => void;
  onClose?: () => void;
}

export default function ProjectCreationForm({
  isEditing = false,
  initialData,
  onSuccess,
  onClose,
}: ProjectCreationFormProps) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  // Hooks pour les opérations CRUD
  const {
    create,
    loading: createLoading,
    error: createError,
  } = useCreateProject();
  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProject();

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  //  UTILISER LES HOOKS OPTIONS
  const { data: availableTeams, loading: teamsLoading } = useTeamOptions();
  const { data: availableUsers, loading: usersLoading } = useUserOptions();

  const defaultValues: Partial<ProjectFormValues> = {
    key: "",
    name: "",
    description: "",
    team_id: undefined,
    lead_user_id: undefined,
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialData
      ? {
          key: initialData.key,
          name: initialData.name,
          description: initialData.description || "",
          team_id: initialData.team_id || undefined,
          lead_user_id: initialData.lead_user_id || undefined,
        }
      : defaultValues,
  });

  // Transformer automatiquement la clé en majuscules
  const handleKeyChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    form.setValue("key", upperValue);
  };

  // Gérer la soumission du formulaire
  const onSubmit = async (data: ProjectFormValues) => {
    try {
      let result: Project | null = null;

      if (isEditing && initialData) {
        // Mise à jour
        result = await update(initialData.id, data);
        if (result) {
          toast.success(
            t("project.form.updateSuccess") || "Projet mis à jour avec succès"
          );
        }
      } else {
        // Création
        result = await create(data as ProjectCreate);
        if (result) {
          toast.success(
            t("project.form.createSuccess") || "Projet créé avec succès"
          );
          form.reset();
        }
      }

      if (result && onSuccess) {
        onSuccess(result);
      }

      if (result && onClose) {
        onClose();
      }
    } catch (err) {
      // L'erreur est déjà gérée dans les hooks
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("project.form.key") || "Clé du projet"} *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="PROJ-KEY"
                    className={cn(
                      `theme-${colorTheme}`,
                      "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)] hover:border-[var(--hover-border)] uppercase"
                    )}
                    {...field}
                    onChange={(e) => {
                      handleKeyChange(e.target.value);
                    }}
                    disabled={isEditing} // La clé ne peut pas être changée
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("project.form.name") || "Nom du projet"} *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      t("project.form.namePlaceholder") || "Mon Super Projet"
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("project.form.description") || "Description"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    t("project.form.descriptionPlaceholder") ||
                    "Décrivez votre projet..."
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
            name="team_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("project.form.team") || "Équipe"}</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(
                      value === "none" ? undefined : parseInt(value)
                    )
                  }
                  value={field.value ? field.value.toString() : "none"}
                  disabled={teamsLoading}
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
                          teamsLoading
                            ? t("common.loading") || "Chargement..."
                            : t("project.form.selectTeam") ||
                              "Sélectionner une équipe"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("project.form.noTeam") || "Aucune équipe"}
                    </SelectItem>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
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
            name="lead_user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("project.form.lead") || "Chef de projet"}
                </FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(
                      value === "none" ? undefined : parseInt(value)
                    )
                  }
                  value={field.value ? field.value.toString() : "none"}
                  disabled={usersLoading}
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
                          usersLoading
                            ? t("common.loading") || "Chargement..."
                            : t("project.form.selectLead") ||
                              "Sélectionner un chef de projet"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("project.form.noLead") || "Aucun chef de projet"}
                    </SelectItem>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {t("project.form.cancel") || "Annuler"}
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || teamsLoading || usersLoading}
            className={cn(
              `theme-${colorTheme}`,
              "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
            )}
          >
            {loading
              ? t("project.form.saving") || "Enregistrement..."
              : isEditing
              ? t("project.form.update") || "Mettre à jour"
              : t("project.form.create") || "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
