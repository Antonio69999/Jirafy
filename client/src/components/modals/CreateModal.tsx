import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import CreateTaskForm from "@/components/forms/CreateTaskForm";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorTheme: string;
}

export function CreateModal({ isOpen, onClose, colorTheme }: CreateModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[1300px] w-[90vw] max-h-[90vh] overflow-hidden border p-6",
          `theme-${colorTheme} border-[var(--hover-border)]`
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {t("dashboard.createTask.title") || "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-80">
            {t("dashboard.createTask.description") ||
              "Fill in the details to create a new task. Click create when you're done."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-1">
            <div className="lg:col-span-3">
              <CreateTaskForm
                isEditing={false}
                initialData={{
                  title: "",
                  description: "",
                  priority: "medium",
                  dueDate: undefined,
                  assignees: [],
                  labels: [],
                  project: "",
                }}
                onClose={onClose}
              />
            </div>

            {/* Additional content area - takes 2/5 of the space on large screens */}
            <div className="lg:col-span-2 space-y-4">
              {/* Project guidelines */}
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("dashboard.createTask.guidelines.title") || "Guidelines"}
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    {t("dashboard.createTask.guidelines.description") ||
                      "Follow these guidelines for creating effective tasks:"}
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      {t("dashboard.createTask.guidelines.item1") ||
                        "Use a clear, action-oriented title"}
                    </li>
                    <li>
                      {t("dashboard.createTask.guidelines.item2") ||
                        "Include relevant details in the description"}
                    </li>
                    <li>
                      {t("dashboard.createTask.guidelines.item3") ||
                        "Assign appropriate labels for easy filtering"}
                    </li>
                    <li>
                      {t("dashboard.createTask.guidelines.item4") ||
                        "Set realistic due dates"}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick templates */}
              <div className="rounded-md border border-[var(--hover-border)] p-4 bg-card/30">
                <h3 className="text-base font-medium mb-2">
                  {t("dashboard.createTask.templates.title") ||
                    "Quick Templates"}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {t("dashboard.createTask.templates.comingSoon") ||
                    "Task templates will be available soon to help you create standardized tasks quickly."}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
