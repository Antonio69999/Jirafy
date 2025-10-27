import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
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
import { useCreateTeam, useUpdateTeam } from "@/hooks/useTeam";
import type { Team, TeamCreate, TeamUpdate } from "@/types/team";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const teamFormSchema = z.object({
  slug: z
    .string()
    .min(2, "Le slug doit contenir au moins 2 caractères")
    .max(50, "Le slug ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug doit être en minuscules, alphanumérique et tirets uniquement"
    ),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  owner_id: z.number().optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamCreationFormProps {
  isEditing?: boolean;
  initialData?: Team;
  onSuccess?: (team: Team) => void;
  onClose?: () => void;
}

export default function TeamCreationForm({
  isEditing = false,
  initialData,
  onSuccess,
  onClose,
}: TeamCreationFormProps) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const { user } = useAuthStore();

  const {
    create,
    loading: createLoading,
    error: createError,
  } = useCreateTeam();
  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdateTeam();

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  const defaultValues: Partial<TeamFormValues> = {
    slug: "",
    name: "",
    description: "",
    owner_id: user?.id,
  };

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: initialData
      ? {
          slug: initialData.slug,
          name: initialData.name,
          description: initialData.description || "",
          owner_id: undefined, // On ne change pas le owner lors de l'édition
        }
      : defaultValues,
  });

  // Transformer automatiquement le slug en minuscules
  const handleSlugChange = (value: string) => {
    const lowerValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    form.setValue("slug", lowerValue);
  };

  const onSubmit = async (data: TeamFormValues) => {
    try {
      let result: Team | null = null;

      if (isEditing && initialData) {
        // Mise à jour - ne pas envoyer owner_id
        const { owner_id, ...updateData } = data;
        result = await update(initialData.id, updateData);
        if (result) {
          toast.success(
            t("team.form.updateSuccess") || "Équipe mise à jour avec succès"
          );
        }
      } else {
        // Création
        result = await create(data as TeamCreate);
        if (result) {
          toast.success(
            t("team.form.createSuccess") || "Équipe créée avec succès"
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("team.form.slug") || "Slug"} *</FormLabel>
              <FormControl>
                <Input
                  placeholder="dev-team"
                  {...field}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={cn(
                    `theme-${colorTheme}`,
                    "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
                  )}
                  disabled={isEditing} // Le slug ne peut pas être changé en édition
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
              <FormLabel>{t("team.form.name") || "Nom"} *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Équipe de développement"
                  {...field}
                  className={cn(
                    `theme-${colorTheme}`,
                    "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
                  )}
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
                {t("team.form.description") || "Description"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez le rôle et les responsabilités de cette équipe..."
                  className={cn(
                    "min-h-[100px]",
                    `theme-${colorTheme}`,
                    "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
              {t("team.form.cancel") || "Annuler"}
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className={cn(
              `theme-${colorTheme}`,
              "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
            )}
          >
            {loading
              ? t("team.form.saving") || "Enregistrement..."
              : isEditing
              ? t("team.form.update") || "Mettre à jour"
              : t("team.form.create") || "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}