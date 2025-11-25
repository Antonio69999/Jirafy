import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";

interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { key: string; name: string; category: string }) => void;
  projectId?: number;
}

export function CreateStatusModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
}: CreateStatusModalProps) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"todo" | "in_progress" | "done">(
    "todo"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !name.trim()) return;
    onSubmit({ key: key.toUpperCase(), name, category });
    handleClose();
  };

  const handleClose = () => {
    setKey("");
    setName("");
    setCategory("todo");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[500px] border p-6",
          `theme-${colorTheme} border-[var(--hover-border)]`
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("workflow.status.create") || "Créer un statut"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {projectId
              ? "Créer un statut personnalisé pour ce projet"
              : "Créer un statut global disponible pour tous les projets"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="key">{t("workflow.status.key") || "Clé"} *</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="REVIEW"
              pattern="[A-Z0-9_-]+"
              required
              className={cn(
                `theme-${colorTheme}`,
                "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
              )}
            />
            <p className="text-xs text-muted-foreground">
              Majuscules, chiffres, tirets et underscores uniquement (ex:
              IN_REVIEW)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t("workflow.status.name") || "Nom"} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="En révision"
              required
              className={cn(
                `theme-${colorTheme}`,
                "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              {t("workflow.status.category") || "Catégorie"} *
            </Label>
            <Select
              value={category}
              onValueChange={(value: any) => setCategory(value)}
            >
              <SelectTrigger
                className={cn(
                  `theme-${colorTheme}`,
                  "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />À faire
                  </div>
                </SelectItem>
                <SelectItem value="in_progress">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    En cours
                  </div>
                </SelectItem>
                <SelectItem value="done">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    Terminé
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              La catégorie détermine la colonne du Kanban
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel") || "Annuler"}
            </Button>
            <Button
              type="submit"
              disabled={!key.trim() || !name.trim()}
              className={cn(
                `theme-${colorTheme}`,
                "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
              )}
            >
              {t("workflow.status.create") || "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
