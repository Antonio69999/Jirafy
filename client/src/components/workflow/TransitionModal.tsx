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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";

interface TransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  fromStatusName?: string;
  toStatusName?: string;
}

export function TransitionModal({
  isOpen,
  onClose,
  onSubmit,
  fromStatusName,
  toStatusName,
}: TransitionModalProps) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, description });
    setName("");
    setDescription("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
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
            {t("workflow.transition.create") || "Créer une transition"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {fromStatusName && toStatusName
              ? `De "${fromStatusName}" vers "${toStatusName}"`
              : "Définissez le nom et la description de la transition"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("workflow.transition.name") || "Nom de la transition"} *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                t("workflow.transition.namePlaceholder") ||
                "Ex: Start Progress, Complete, Reopen..."
              }
              required
              className={cn(
                `theme-${colorTheme}`,
                "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("workflow.transition.description") || "Description"}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                t("workflow.transition.descriptionPlaceholder") ||
                "Décrivez cette transition..."
              }
              rows={3}
              className={cn(
                `theme-${colorTheme}`,
                "focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]"
              )}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel") || "Annuler"}
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className={cn(
                `theme-${colorTheme}`,
                "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
              )}
            >
              {t("workflow.transition.create") || "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
