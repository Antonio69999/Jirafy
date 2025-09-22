import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Label {
  id: string;
  name: string;
  color: string;
}

interface LabelSelectorProps {
  selectedLabels: string[];
  onLabelsChange: (labels: string[]) => void;
  availableLabels: Label[];
  label: string;
  error?: string;
  disabled?: boolean;
}

export function LabelSelector({
  selectedLabels,
  onLabelsChange,
  availableLabels,
  label,
  error,
  disabled = false,
}: LabelSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const addLabel = (labelId: string) => {
    if (!selectedLabels.includes(labelId)) {
      const updated = [...selectedLabels, labelId];
      onLabelsChange(updated);
    }
  };

  const removeLabel = (labelId: string) => {
    const updated = selectedLabels.filter((id) => id !== labelId);
    onLabelsChange(updated);
  };

  const getLabelStyle = (labelId: string) => {
    const labelData = availableLabels.find((l) => l.id === labelId);
    if (!labelData) return {};

    return {
      backgroundColor: labelData.color,
      color: "#ffffff",
      borderColor: labelData.color,
    };
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="mb-2">
        {selectedLabels.map((labelId) => {
          const labelData = availableLabels.find((l) => l.id === labelId);
          return (
            <Badge
              key={labelId}
              className="mr-1 mb-1 cursor-pointer"
              style={getLabelStyle(labelId)}
              onClick={() => removeLabel(labelId)}
            >
              {labelData?.name}
              <span className="ml-1">×</span>
            </Badge>
          );
        })}
      </div>

      {disabled ? (
        <div className="text-sm text-muted-foreground">
          {t("dashboard.addTask.selectProjectFirst") ||
            "Sélectionnez d'abord un projet"}
        </div>
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <FormControl>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !selectedLabels.length && "text-muted-foreground"
                )}
              >
                <span>{t("dashboard.addTask.addLabels") || "Add labels"}</span>
                <Tag className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-0 bg-background">
            <div className="p-2">
              {availableLabels.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  {t("dashboard.addTask.noLabels") ||
                    "Aucune étiquette disponible"}
                </div>
              ) : (
                availableLabels.map((labelData) => (
                  <button
                    key={labelData.id}
                    type="button"
                    className={cn(
                      "flex items-center w-full p-2 rounded-md cursor-pointer hover:bg-muted text-left",
                      selectedLabels.includes(labelData.id) && "bg-muted"
                    )}
                    onClick={() => {
                      addLabel(labelData.id);
                      setIsOpen(false);
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: labelData.color }}
                    />
                    <span>{labelData.name}</span>
                  </button>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
