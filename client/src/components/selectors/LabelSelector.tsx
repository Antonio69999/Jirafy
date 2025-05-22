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
}

export function LabelSelector({
  selectedLabels,
  onLabelsChange,
  availableLabels,
  label,
  error,
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
    <FormItem>
      <FormLabel>{label}</FormLabel>
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
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between",
                !selectedLabels.length && "text-muted-foreground",
                `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)] hover:border-[var(--hover-border)]`
              )}
            >
              <span>{t("dashboard.addTask.addLabels") || "Add labels"}</span>
              <Tag className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="p-0 bg-background"
          sideOffset={4}
          side="bottom"
        >
          <div className="p-2">
            {availableLabels.map((label) => (
              <button
                key={label.id}
                type="button"
                className={cn(
                  "flex items-center w-full p-2 rounded-md cursor-pointer hover:bg-muted text-left",
                  selectedLabels.includes(label.id) && "bg-muted"
                )}
                onClick={() => {
                  addLabel(label.id);
                  setIsOpen(false);
                }}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    `bg-${label.color}-500`
                  )}
                />
                <span>{label.name}</span>
              </button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
