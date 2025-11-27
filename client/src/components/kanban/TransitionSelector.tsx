import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AvailableTransition } from "@/api/services/workflowService";

interface TransitionSelectorProps {
  issueId: number;
  currentStatusName: string;
  transitions: AvailableTransition[];
  onTransition: (transitionId: number) => Promise<void>;
  loading?: boolean;
  colorTheme?: string;
}

export function TransitionSelector({
  issueId,
  currentStatusName,
  transitions,
  onTransition,
  loading = false,
  colorTheme = "blue",
}: TransitionSelectorProps) {
  const [selectedTransitionId, setSelectedTransitionId] = useState<
    string | null
  >(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTransition = async () => {
    if (!selectedTransitionId) return;

    setIsTransitioning(true);
    try {
      await onTransition(parseInt(selectedTransitionId));
      setSelectedTransitionId(null);
    } finally {
      setIsTransitioning(false);
    }
  };

  if (transitions.length === 0) {
    return (
      <div className="text-xs text-muted-foreground">
        Aucune transition disponible
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-muted-foreground">
        <span className="font-medium">Statut actuel : </span>
        <span className="text-foreground">{currentStatusName}</span>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={selectedTransitionId || undefined}
          onValueChange={setSelectedTransitionId}
          disabled={loading || isTransitioning}
        >
          <SelectTrigger
            className={cn(
              "h-8 text-xs flex-1",
              `theme-${colorTheme}`,
              "focus-visible:ring-[var(--primary)]/30"
            )}
          >
            <SelectValue placeholder="Choisir une transition" />
          </SelectTrigger>
          <SelectContent>
            {transitions.map((transition) => (
              <SelectItem key={transition.id} value={String(transition.id)}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{transition.name}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span className="text-xs text-muted-foreground">
                    {transition.toStatus.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          onClick={handleTransition}
          disabled={!selectedTransitionId || loading || isTransitioning}
          className={cn(
            "h-8 px-3 text-xs",
            `theme-${colorTheme}`,
            "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          )}
        >
          {isTransitioning ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            "Appliquer"
          )}
        </Button>
      </div>
    </div>
  );
}
