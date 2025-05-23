import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useColorThemeStore } from "@/store/colorThemeStore";
import {
  LayoutDashboard,
  KanbanSquare,
  ListChecks,
  Calendar,
  BarChart3,
  Settings,
  ScrollText,
} from "lucide-react";

type TabType =
  | "summary"
  | "board"
  | "list"
  | "calendar"
  | "reports"
  | "settings"
  | "timeline";

type DashboardTabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  const tabs = [
    {
      id: "summary" as TabType,
      label: t("dashboard.tabs.summary") || "Summary",
      icon: LayoutDashboard,
    },
    {
      id: "board" as TabType,
      label: t("dashboard.tabs.board") || "Board",
      icon: KanbanSquare,
    },
    {
      id: "list" as TabType,
      label: t("dashboard.tabs.list") || "List",
      icon: ListChecks,
    },
    {
      id: "timeline" as TabType,
      label: t("dashboard.tabs.timeline") || "Timeline",
      icon: ScrollText,
    },
    {
      id: "calendar" as TabType,
      label: t("dashboard.tabs.calendar") || "Calendar",
      icon: Calendar,
    },
    {
      id: "reports" as TabType,
      label: t("dashboard.tabs.reports") || "Reports",
      icon: BarChart3,
    },
    {
      id: "settings" as TabType,
      label: t("dashboard.tabs.settings") || "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className={`theme-${colorTheme} mb-4`}>
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as TabType)}
        className="w-full"
      >
        <TabsList className="inline-flex h-9 items-center justify-start w-full overflow-x-auto bg-transparent p-0 border-b rounded-none space-x-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-3 py-1 text-sm font-medium data-[state=active]:border-[var(--primary)] data-[state=active]:border-b-2 bg-transparent data-[state=active]:bg-transparent",
                "transition-colors hover:text-[var(--primary)]",
                activeTab === tab.id
                  ? "text-[var(--primary)]"
                  : "text-muted-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
