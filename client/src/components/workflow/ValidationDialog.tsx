import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowValidation } from "@/api/services/workflowService";

interface ValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  validation: WorkflowValidation | null;
  colorTheme?: string;
}

export function ValidationDialog({
  isOpen,
  onClose,
  validation,
  colorTheme = "blue",
}: ValidationDialogProps) {
  if (!validation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] border p-6",
          `theme-${colorTheme} border-[var(--hover-border)]`
        )}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            {validation.valid ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                Workflow valide
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                Workflow invalide
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            Résultat de la validation du workflow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Erreurs */}
          {validation.errors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">
                  Erreurs ({validation.errors.length})
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Avertissements */}
          {validation.warnings.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">
                  Avertissements ({validation.warnings.length})
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="text-sm">
                      {warning}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Succès */}
          {validation.valid && validation.warnings.length === 0 && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Le workflow est correctement configuré et prêt à être utilisé.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
