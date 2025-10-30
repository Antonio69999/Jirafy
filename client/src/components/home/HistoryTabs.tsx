import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { Clock, Eye, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckSquare,
  BookmarkIcon,
  FileText,
  FolderIcon,
  Zap,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

type ActionType =
  | "complete"
  | "bookmark"
  | "view"
  | "edit"
  | "create"
  | "project";

// Types for different history items
type HistoryItem = {
  id: string;
  title: string;
  type: "task" | "project";
  identifier: string;
  timestamp: string;
  projectColor?: string;
  projectName?: string;
  createdBy?: string;
  actionType?: ActionType;
};

export default function HistoryTabs() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "worked";

  // États pour les éléments d'historique (vides par défaut)
  const [workedOnItems] = useState<HistoryItem[]>([]);
  const [viewedItems] = useState<HistoryItem[]>([]);
  const [starredItems] = useState<HistoryItem[]>([]);

  const getActionIcon = (item: HistoryItem) => {
    if (item.type === "project") {
      return <FolderIcon className="size-3.5" />;
    }

    // Pour les tâches, on se base sur l'actionType
    switch (item.actionType) {
      case "complete":
        return <CheckSquare className="size-3.5" />;
      case "bookmark":
        return <BookmarkIcon className="size-3.5" />;
      case "view":
        return <ExternalLink className="size-3.5" />;
      case "create":
        return <Zap className="size-3.5" />;
      case "edit":
        return <FileText className="size-3.5" />;
      default:
        return <CheckSquare className="size-3.5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } else if (diffInHours < 48) {
      return t("common.yesterday");
    } else {
      return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
      }).format(date);
    }
  };

  // Render a history item
  const renderHistoryItem = (item: HistoryItem) => (
    <Link
      key={item.id}
      to={
        item.type === "project"
          ? `/projects/${item.id}`
          : `/projects/tasks/${item.id}`
      }
      className={cn(
        "p-2.5 flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors",
        "group"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-5 h-5 mt-0.5 rounded-sm flex items-center justify-center text-white font-medium text-xs shrink-0"
          style={{ backgroundColor: item.projectColor || "#64748b" }}
        >
          {getActionIcon(item)}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{item.title}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium">{item.identifier}</span>
            {item.projectName && <span>• {item.projectName}</span>}
            <span>• {formatDate(item.timestamp)}</span>
          </div>
        </div>
      </div>

      {item.createdBy && item.type === "task" && (
        <div className="flex items-center gap-1.5 ml-3 shrink-0 opacity-70 group-hover:opacity-100">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {t("common.by") || "by"}
          </span>
          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {/* Image de profil ou initiales */}
            <span className="text-xs font-medium">
              {item.createdBy
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </span>
          </div>
        </div>
      )}
    </Link>
  );

  return (
    <div className={`theme-${colorTheme}`}>
      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-1">
          <TabsTrigger value="worked" className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{t("home.history.workedOn") || "Worked on"}</span>
          </TabsTrigger>
          <TabsTrigger value="viewed" className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            <span>{t("home.history.viewed") || "Viewed"}</span>
          </TabsTrigger>
          <TabsTrigger value="starred" className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5" />
            <span>{t("home.history.starred") || "Starred"}</span>
          </TabsTrigger>
        </TabsList>

        <div className="bg-card rounded-md border shadow-sm">
          <TabsContent value="worked">
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                {workedOnItems.length > 0 ? (
                  <div className="space-y-1">
                    {workedOnItems.map(renderHistoryItem)}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t("home.history.noWorkedItems") ||
                      "No recently worked on items"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="viewed">
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                {viewedItems.length > 0 ? (
                  <div className="space-y-1">
                    {viewedItems.map(renderHistoryItem)}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t("home.history.noViewedItems") ||
                      "No recently viewed items"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="starred">
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                {starredItems.length > 0 ? (
                  <div className="space-y-1">
                    {starredItems.map(renderHistoryItem)}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t("home.history.noStarredItems") || "No starred items"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
