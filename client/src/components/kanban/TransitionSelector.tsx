import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import type { AvailableTransition } from "@/api/services/workflowService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const { t } = useTranslation();
  const [selectedTransitionId, setSelectedTransitionId] = useState<
    string | null
  >(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const selectedTransition = transitions.find(
    (t) => t.id === parseInt(selectedTransitionId || "")
  );

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

  // CORRECTION : Accepter to_status OU toStatus
  const validTransitions = transitions.filter((t) => {
    // @ts-ignore - Accepter les deux formats
    return t.toStatus || t.to_status;
  });

  const allowedTransitions = validTransitions.filter(
    (t) => t.is_allowed !== false
  );
  const blockedTransitions = validTransitions.filter(
    (t) => t.is_allowed === false
  );

  // HELPER : Récupérer toStatus peu importe le format
  const getToStatus = (transition: any) => {
    return transition.toStatus || transition.to_status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (validTransitions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucune transition disponible</AlertTitle>
        <AlertDescription>
          Il n'y a aucune transition possible depuis le statut "
          {currentStatusName}".
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn(`theme-${colorTheme}`, "space-y-3")}>
      {/* Statut actuel */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Statut actuel :</span>
        <span className="font-medium">{currentStatusName}</span>
      </div>

      {/* Sélecteur de transition */}
      {allowedTransitions.length > 0 && (
        <div className="space-y-2">
          <Select
            value={selectedTransitionId || undefined}
            onValueChange={setSelectedTransitionId}
            disabled={isTransitioning}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une transition" />
            </SelectTrigger>
            <SelectContent>
              {allowedTransitions.map((transition) => {
                const toStatus = getToStatus(transition); // Utiliser le helper
                return (
                  <SelectItem key={transition.id} value={String(transition.id)}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{transition.name}</span>
                      {toStatus && (
                        <span className="text-xs text-muted-foreground">
                          → {toStatus.name}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Bouton de validation */}
          <Button
            onClick={handleTransition}
            disabled={!selectedTransitionId || isTransitioning}
            className="w-full"
            size="sm"
          >
            {isTransitioning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transition en cours...
              </>
            ) : (
              "Appliquer la transition"
            )}
          </Button>
        </div>
      )}

      {/* Afficher les erreurs de validation */}
      {selectedTransition &&
        selectedTransition.validation_errors &&
        selectedTransition.validation_errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Conditions non remplies</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {selectedTransition.validation_errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

      {/* Afficher les transitions bloquées */}
      {blockedTransitions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Transitions non disponibles :
          </p>
          <div className="space-y-1">
            {blockedTransitions.map((transition) => {
              const toStatus = getToStatus(transition); // Utiliser le helper
              return (
                <TooltipProvider key={transition.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 cursor-not-allowed opacity-60">
                        <X className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{transition.name}</span>
                        {toStatus && (
                          <span className="text-xs text-muted-foreground">
                            → {toStatus.name}
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-medium">Conditions requises :</p>
                        {transition.validation_errors?.map((error, index) => (
                          <p key={index} className="text-xs">
                            • {error}
                          </p>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
