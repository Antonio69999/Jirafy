import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/pages/PageContainer";
import { LanguageSelector } from "@/components/selectors/LanguageSelector";
import { ColorThemeSelector } from "@/components/selectors/ColorThemeSelector";
import { ThemeModeSelector } from "@/components/selectors/ThemeModeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordChangeForm } from "@/components/forms/PasswordChangeForm";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { AvatarChangeForm } from "@/components/forms/AvatarChangeForm";
import { ScrollArea } from "@/components/ui/scroll-area";

function Settings() {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();

  return (
    <PageContainer title={t("settings.title") || "Settings"}>
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <p className="text-muted-foreground mb-6">
          {t("settings.description") ||
            "Manage your application settings here."}
        </p>
        <ScrollArea className="h-[calc(100vh-18rem)]">
          <Tabs
            defaultValue="appearance"
            className={`w-full theme-${colorTheme}`}
          >
            <TabsList className="mb-6 w-full grid sm:grid-cols-3 grid-cols-1 gap-1">
              <TabsTrigger
                value="appearance"
                className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)] focus-visible:ring-[var(--primary)]/30"
              >
                {t("settings.appearance.title") || "Appearance"}
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)] focus-visible:ring-[var(--primary)]/30"
              >
                {t("settings.account.title") || "Account"}
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)] focus-visible:ring-[var(--primary)]/30"
              >
                {t("settings.notifications.title") || "Notifications"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-6">
              <h2 className="text-xl font-semibold">
                {t("settings.appearance.title") || "Appearance"}
              </h2>
              <div className="space-y-4">
                <ThemeModeSelector />
                <ColorThemeSelector />
                <LanguageSelector />
              </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <h2 className="text-xl font-semibold">
                {t("settings.account.title") || "Account"}
              </h2>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <AvatarChangeForm />
                </div>
                <div className="rounded-md border p-4">
                  <PasswordChangeForm />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <h2 className="text-xl font-semibold">
                {t("settings.notifications.title") || "Notifications"}
              </h2>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {/* Placeholder for notification settings */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Task assignments</p>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when you're assigned to a task
                        </p>
                      </div>
                      <div className="h-6 w-11 bg-muted rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Task updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when a task you're watching is updated
                        </p>
                      </div>
                      <div className="h-6 w-11 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium mb-4">
                    In-app Notifications
                  </h3>
                  <div className="space-y-3">
                    {/* Placeholder for in-app notification settings */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mentions</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when you're mentioned in
                          comments
                        </p>
                      </div>
                      <div className="h-6 w-11 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </PageContainer>
  );
}

export default Settings;
