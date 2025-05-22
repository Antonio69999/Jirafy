import "./App.css";
import { PageContainer } from "@/components/pages/PageContainer";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecentProject from "@/components/home/RecentProject";
import HistoryTabs from "@/components/home/HistoryTabs";

function App() {
  const { t } = useTranslation();

  return (
    <PageContainer title={t("app.sidebar.home") || "For you"}>
      <div className="mb-3">
        <p className="text-xs text-muted-foreground">{t("home.description")}</p>
      </div>

      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="space-y-6 pb-6">
          <RecentProject />
          <HistoryTabs />
        </div>
      </ScrollArea>
    </PageContainer>
  );
}

export default App;
